"""Run our camera backend/async command against deterministic hardware fakes."""
from pathlib import Path
import subprocess
import tempfile
import unittest

FW = Path(__file__).resolve().parents[1]
SDK = FW.parent / ".cache/muse-smart-glasses-sdk/esp32"


class CameraPort(unittest.TestCase):
    def test_capture_ownership_errors_busy_and_generation(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp)
            headers = {
                "esp_err.h": '''#pragma once
#include <stdint.h>
typedef int esp_err_t;
#define ESP_OK 0
#define ESP_FAIL -1
#define ESP_ERR_NO_MEM 1
#define ESP_ERR_INVALID_STATE 2
#define ESP_ERR_NOT_SUPPORTED 3
#define ESP_ERR_TIMEOUT 4
#define ESP_ERR_INVALID_SIZE 5
static inline const char *esp_err_to_name(int e) { (void)e; return "test"; }
''',
                "esp_log.h": '#define ESP_LOGE(tag, ...) ((void)(tag))\n#define ESP_LOGW(tag, ...) ((void)(tag))\n',
                "sdkconfig.h": '#define CONFIG_SG_CAMERA_MAX_JPEG_BYTES 32768\n',
                "esp_heap_caps.h": '''#pragma once
#include <stddef.h>
#define MALLOC_CAP_SPIRAM 1
#define MALLOC_CAP_8BIT 2
void *heap_caps_malloc(size_t, unsigned);
''',
                "freertos/FreeRTOS.h": '#pragma once\n#define pdPASS 1\n',
                "freertos/idf_additions.h": '''#pragma once
int xTaskCreateWithCaps(void (*fn)(void *), const char *, unsigned, void *, unsigned, void *, unsigned);
void vTaskDeleteWithCaps(void *);
''',
                "freertos/task.h": '#pragma once\n',
                "mbedtls/base64.h": '#pragma once\n#include <stddef.h>\nint mbedtls_base64_encode(unsigned char *,size_t,size_t *,const unsigned char *,size_t);\n',
                "esp_camera.h": '''#pragma once
#include <stddef.h>
#include <stdint.h>
#include "esp_err.h"
#define PIXFORMAT_JPEG 1
#define FRAMESIZE_QVGA 1
#define CAMERA_FB_IN_PSRAM 1
#define CAMERA_GRAB_WHEN_EMPTY 0
#define LEDC_TIMER_0 0
#define LEDC_CHANNEL_0 0
#define OV2640_PID 0x26
typedef struct { int pin_pwdn,pin_reset,pin_xclk,pin_sccb_sda,pin_sccb_scl;
int pin_d0,pin_d1,pin_d2,pin_d3,pin_d4,pin_d5,pin_d6,pin_d7;
int pin_vsync,pin_href,pin_pclk,xclk_freq_hz,ledc_timer,ledc_channel;
int pixel_format,frame_size,jpeg_quality,fb_count,fb_location,grab_mode,sccb_i2c_port;} camera_config_t;
typedef struct {uint8_t *buf;size_t len,width,height;int format;} camera_fb_t;
typedef struct {struct {int PID;} id;} sensor_t;
esp_err_t esp_camera_init(const camera_config_t *);
esp_err_t esp_camera_deinit(void);
sensor_t *esp_camera_sensor_get(void);
camera_fb_t *esp_camera_fb_get(void);
void esp_camera_fb_return(camera_fb_t *);
''',
            }
            for name, text in headers.items():
                p = out / name
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_text(text)
            # Same generated pin proposal as the actual build.
            (out / "sg_pins.h").write_text((SDK / "main/sg_pins.h").read_text())
            cjson = SDK / "managed_components/espressif__cjson/cJSON"
            exe = out / "camera"
            subprocess.run(["cc", "-std=c11", "-Wall", "-Wextra", "-Werror", "-Wno-unused-parameter",
                            "-fsanitize=address,undefined", "-fno-sanitize-recover=all",
                            "-I", str(out), "-I", str(FW / "port"), "-I", str(cjson),
                            "-I", str(SDK / "components/camera"), "-I", str(SDK / "main"),
                            str(FW / "port/sg_camera.c"), str(SDK / "components/camera/camera.c"),
                            str(cjson / "cJSON.c"), str(FW / "tests/camera_harness.c"), "-lm", "-o", str(exe)], check=True)
            subprocess.run([str(exe)], check=True)
