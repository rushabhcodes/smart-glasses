// SPDX-License-Identifier: Apache-2.0
#include "sg_camera.h"
#include "sg_pins.h"
#include "sg_recording.h"
#include "camera.h"
#include "esp_camera.h"
#include "esp_heap_caps.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/idf_additions.h"
#include "freertos/task.h"
#include "mbedtls/base64.h"
#include "sdkconfig.h"
#include <stdatomic.h>
#include <stdlib.h>
#include <string.h>

static const char *TAG = "link.sg.camera";
static atomic_flag s_request = ATOMIC_FLAG_INIT;
static bool s_camera_on;

static void power_off(void) {
    if (s_camera_on) {
        esp_err_t err = esp_camera_deinit();
        if (err != ESP_OK) {
            ESP_LOGE(TAG, "deinit failed; leaving recording indicator on");
            return;
        }
        s_camera_on = false;
    }
    sg_recording_set(SG_RECORD_CAMERA, false);
}

static esp_err_t capture(camera_frame_t *out) {
    // A failed shutdown latches the indicator on until reboot; never reinitialize
    // over a live driver and accidentally clear its recording indication.
    if (s_camera_on) return ESP_ERR_INVALID_STATE;
    if (!sg_recording_set(SG_RECORD_CAMERA, true)) return ESP_FAIL;
    camera_config_t cfg = {
        .pin_pwdn = SG_PIN_CAM_PWDN, .pin_reset = -1,
        .pin_xclk = SG_PIN_CAM_XCLK, .pin_sccb_sda = SG_PIN_CAM_SIOD, .pin_sccb_scl = SG_PIN_CAM_SIOC,
        .pin_d0 = SG_PIN_CAM_D0, .pin_d1 = SG_PIN_CAM_D1, .pin_d2 = SG_PIN_CAM_D2, .pin_d3 = SG_PIN_CAM_D3,
        .pin_d4 = SG_PIN_CAM_D4, .pin_d5 = SG_PIN_CAM_D5, .pin_d6 = SG_PIN_CAM_D6, .pin_d7 = SG_PIN_CAM_D7,
        .pin_vsync = SG_PIN_CAM_VSYNC, .pin_href = SG_PIN_CAM_HREF, .pin_pclk = SG_PIN_CAM_PCLK,
        .xclk_freq_hz = 20000000, .ledc_timer = LEDC_TIMER_0, .ledc_channel = LEDC_CHANNEL_0,
        .pixel_format = PIXFORMAT_JPEG, .frame_size = FRAMESIZE_QVGA, .jpeg_quality = 20,
        .fb_count = 1, .fb_location = CAMERA_FB_IN_PSRAM, .grab_mode = CAMERA_GRAB_WHEN_EMPTY,
        .sccb_i2c_port = 0,
    };
    esp_err_t err = esp_camera_init(&cfg);
    if (err != ESP_OK) {
        sg_recording_set(SG_RECORD_CAMERA, false);
        return err;
    }
    s_camera_on = true;
    sensor_t *sensor = esp_camera_sensor_get();
    if (!sensor || sensor->id.PID != OV2640_PID) { power_off(); return ESP_ERR_NOT_SUPPORTED; }
    // Discard the first exposure; only one PSRAM frame buffer is ever owned.
    camera_fb_t *fb = esp_camera_fb_get();
    if (fb) esp_camera_fb_return(fb);
    fb = esp_camera_fb_get();
    if (!fb) { power_off(); return ESP_ERR_TIMEOUT; }
    if (fb->format != PIXFORMAT_JPEG || !fb->len || fb->len > CONFIG_SG_CAMERA_MAX_JPEG_BYTES) {
        esp_camera_fb_return(fb);
        power_off();
        return ESP_ERR_INVALID_SIZE;
    }
    *out = (camera_frame_t){.jpeg = fb->buf, .len = fb->len, .width = fb->width, .height = fb->height, .priv = fb};
    return ESP_OK;
}

static void release(camera_frame_t *frame) {
    esp_camera_fb_return(frame->priv);
    power_off();
}

void sg_camera_register(void) {
    static const camera_driver_t driver = {
        .name = "OV2640 (smart glasses prototype)", .max_width = 320, .max_height = 240,
        .capture = capture, .release = release,
    };
    if (sg_recording_init() == ESP_OK) camera_register(&driver);
    else ESP_LOGE(TAG, "indicator unavailable; camera disabled");
}

typedef struct {
    noise_ctrl_session_generation_t generation;
    char id[64];
} request_t;

static cJSON *failure(const char *code) {
    cJSON *r = cJSON_CreateObject();
    if (!r) return NULL;
    cJSON *e = cJSON_AddObjectToObject(r, "error");
    if (!e || !cJSON_AddBoolToObject(r, "ok", false) ||
        !cJSON_AddStringToObject(e, "code", code) ||
        !cJSON_AddStringToObject(e, "message", "Still capture unavailable; check device logs and wiring")) {
        cJSON_Delete(r); return NULL;
    }
    return r;
}

static void capture_task(void *arg) {
    request_t *req = arg;
    camera_frame_t frame = {0};
    cJSON *result = NULL;
    char *b64 = NULL;
    esp_err_t err = camera_capture(&frame);
    if (err == ESP_OK) {
        size_t cap = 4 * ((frame.len + 2) / 3) + 1, written = 0;
        b64 = heap_caps_malloc(cap, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
        if (!b64) err = ESP_ERR_NO_MEM;
        else if (mbedtls_base64_encode((unsigned char *)b64, cap, &written, frame.jpeg, frame.len)) err = ESP_FAIL;
        else {
            b64[written] = 0;
            result = cJSON_CreateObject();
            cJSON *p = result ? cJSON_AddObjectToObject(result, "payload") : NULL;
            if (!p || !cJSON_AddBoolToObject(result, "ok", true) ||
                !cJSON_AddStringToObject(p, "format", "jpeg-base64") ||
                !cJSON_AddStringToObject(p, "data_base64", b64) ||
                !cJSON_AddNumberToObject(p, "width", frame.width) ||
                !cJSON_AddNumberToObject(p, "height", frame.height)) {
                cJSON_Delete(result); result = NULL; err = ESP_ERR_NO_MEM;
            }
        }
        camera_release(&frame); // Always return frame/deinit, including allocation failures.
    }
    free(b64);
    if (err != ESP_OK) {
        ESP_LOGW(TAG, "capture failed: %s", esp_err_to_name(err));
        result = failure(err == ESP_ERR_NO_MEM ? "out_of_memory" : "camera_capture_failed");
    }
    // SDK owns result. Generation rejects stale responses after reconnection.
    noise_ctrl_send_command_result(req->generation, req->id, result);
    free(req);
    atomic_flag_clear(&s_request);
    vTaskDeleteWithCaps(NULL);
}

cJSON *sg_camera_command(const char *request_id, noise_ctrl_session_generation_t generation) {
    if (!request_id || strlen(request_id) >= sizeof(((request_t *)0)->id)) return failure("invalid_request_id");
    if (atomic_flag_test_and_set(&s_request)) return failure("camera_busy");
    request_t *req = calloc(1, sizeof(*req));
    cJSON *async = cJSON_CreateObject();
    if (!req || !async || !cJSON_AddBoolToObject(async, "_async", true)) goto fail;
    req->generation = generation;
    strcpy(req->id, request_id);
    if (xTaskCreateWithCaps(capture_task, "sg_camera", 8192, req, 4, NULL,
                            MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT) != pdPASS) goto fail;
    return async;
fail:
    free(req);
    cJSON_Delete(async);
    atomic_flag_clear(&s_request);
    return failure("out_of_memory");
}
