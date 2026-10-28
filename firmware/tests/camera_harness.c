// SPDX-License-Identifier: Apache-2.0
#include <assert.h>
#include <stdbool.h>
#include <stdlib.h>
#include <string.h>
#include "sg_camera.h"
#include "sg_recording.h"
#include "camera.h"
#include "esp_camera.h"

static unsigned owners;
static int init_error, captures, returned, deinit_count, deinit_error;
static bool fail_frame, fail_heap, fail_task;
static sensor_t sensor = {.id.PID = OV2640_PID};
static uint8_t jpeg[] = {0xFF, 0xD8, 0xFF, 0xD9};
static camera_fb_t fb = {.buf=jpeg, .len=4, .width=320, .height=240, .format=PIXFORMAT_JPEG};
static void (*pending)(void *);
static void *pending_arg;
static cJSON *received;
static unsigned long long generation;
static char received_id[64];

esp_err_t sg_recording_init(void) { return ESP_OK; }
bool sg_recording_set(unsigned owner, bool on) {
    if (on) owners |= owner; else owners &= ~owner;
    return true;
}
esp_err_t esp_camera_init(const camera_config_t *cfg) {
    assert(owners & SG_RECORD_CAMERA);
    assert(cfg->fb_count == 1 && cfg->frame_size == FRAMESIZE_QVGA);
    assert(cfg->pixel_format == PIXFORMAT_JPEG && cfg->pin_reset == -1);
    assert(cfg->pin_d0 == 4 && cfg->pin_sccb_sda == 16 && cfg->pin_sccb_scl == 17);
    return init_error;
}
esp_err_t esp_camera_deinit(void) { deinit_count++; return deinit_error; }
sensor_t *esp_camera_sensor_get(void) { return &sensor; }
camera_fb_t *esp_camera_fb_get(void) { captures++; return fail_frame ? NULL : &fb; }
void esp_camera_fb_return(camera_fb_t *f) { assert(f == &fb); returned++; }
void *heap_caps_malloc(size_t n,unsigned caps) { return fail_heap ? NULL : malloc(n); }
int mbedtls_base64_encode(unsigned char *out,size_t cap,size_t *written,const unsigned char *in,size_t n) {
    assert(n==4 && in==jpeg && cap>=9);
    memcpy(out,"/9j/2Q==",9); *written=8; return 0;
}
int xTaskCreateWithCaps(void (*fn)(void *),const char *name,unsigned stack,void *arg,unsigned pri,void *handle,unsigned caps) {
    if (fail_task) return 0;
    assert(pending == NULL); pending=fn; pending_arg=arg; return 1;
}
void vTaskDeleteWithCaps(void *task) { assert(task==NULL); }
void noise_ctrl_send_command_result(noise_ctrl_session_generation_t gen,const char *id,cJSON *result) {
    assert(received == NULL); generation=gen; strcpy(received_id,id); received=result;
}
static void run_capture(bool ok) {
    cJSON *r=sg_camera_command("request-1",42);
    assert(cJSON_IsTrue(cJSON_GetObjectItem(r,"_async"))); cJSON_Delete(r);
    r=sg_camera_command("busy",43);
    assert(!strcmp(cJSON_GetObjectItem(cJSON_GetObjectItem(r,"error"),"code")->valuestring,"camera_busy"));
    cJSON_Delete(r);
    void (*fn)(void *)=pending; void *arg=pending_arg; pending=NULL; fn(arg);
    assert(received && generation==42 && !strcmp(received_id,"request-1"));
    assert(cJSON_IsTrue(cJSON_GetObjectItem(received,"ok")) == ok);
    if (ok) {
        cJSON *p=cJSON_GetObjectItem(received,"payload");
        assert(!strcmp(cJSON_GetObjectItem(p,"format")->valuestring,"jpeg-base64"));
        assert(!strcmp(cJSON_GetObjectItem(p,"data_base64")->valuestring,"/9j/2Q=="));
    }
    assert(!(owners & SG_RECORD_CAMERA));
    cJSON_Delete(received); received=NULL;
}
int main(void) {
    sg_camera_register();
    // Camera release must not extinguish a simultaneous microphone indicator.
    owners=SG_RECORD_MIC; run_capture(true); assert(owners==SG_RECORD_MIC);
    assert(captures==2 && returned==2 && deinit_count==1);
    init_error=ESP_FAIL; run_capture(false); init_error=0;
    sensor.id.PID=0; run_capture(false); sensor.id.PID=OV2640_PID;
    fail_frame=true; run_capture(false); fail_frame=false;
    fb.len=32769; run_capture(false); fb.len=4;
    fail_heap=true; run_capture(false); fail_heap=false;
    fail_task=true; cJSON *r=sg_camera_command("task-fail",1);
    assert(cJSON_IsFalse(cJSON_GetObjectItem(r,"ok"))); cJSON_Delete(r); fail_task=false;
    run_capture(true); // Failed task/capture paths must always release the busy flag.
    char long_id[65]; memset(long_id,'x',64);long_id[64]=0;
    r=sg_camera_command(long_id,1); assert(cJSON_IsFalse(cJSON_GetObjectItem(r,"ok"))); cJSON_Delete(r);
    // Faulted shutdown must retain the indication and refuse another init.
    deinit_error=ESP_FAIL;
    r=sg_camera_command("shutdown-fail",42);cJSON_Delete(r);
    void (*fn)(void *)=pending;void *arg=pending_arg;pending=NULL;fn(arg);
    assert(received && (owners & SG_RECORD_CAMERA));cJSON_Delete(received);received=NULL;
    int before=captures;
    r=sg_camera_command("latched",42);cJSON_Delete(r);
    fn=pending;arg=pending_arg;pending=NULL;fn(arg);
    assert(received && cJSON_IsFalse(cJSON_GetObjectItem(received,"ok")));
    assert(captures==before && (owners & SG_RECORD_CAMERA));
    cJSON_Delete(received);
    return 0;
}
