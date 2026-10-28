"""Test the real shared indicator implementation, including active-low configuration."""
from pathlib import Path
import subprocess
import tempfile
import unittest

FW = Path(__file__).resolve().parents[1]


class RecordingIndicator(unittest.TestCase):
    def test_ownership_initialization_failure_and_both_polarities(self):
        for active in (0, 1):
            with self.subTest(active_high=active), tempfile.TemporaryDirectory() as tmp:
                out = Path(tmp)
                headers = {
                    "esp_err.h": '#pragma once\ntypedef int esp_err_t;\n#define ESP_OK 0\n#define ESP_FAIL -1\n',
                    "sdkconfig.h": '#define CONFIG_SG_RECORD_LED_ACTIVE_HIGH 1\n' if active else '',
                    "sg_pins.h": '#define SG_PIN_REC_LED 48\n',
                    "freertos/FreeRTOS.h": '#pragma once\ntypedef int portMUX_TYPE;\n#define portMUX_INITIALIZER_UNLOCKED 0\n#define portENTER_CRITICAL(x) ((void)(x))\n#define portEXIT_CRITICAL(x) ((void)(x))\n',
                    "driver/gpio.h": '#pragma once\n#include <stdint.h>\n#include "esp_err.h"\n#define GPIO_MODE_OUTPUT 1\ntypedef struct {uint64_t pin_bit_mask;int mode;} gpio_config_t;\nesp_err_t gpio_config(const gpio_config_t *);\nesp_err_t gpio_set_level(int,int);\n',
                }
                for name, text in headers.items():
                    p = out / name; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(text)
                src = out / "indicator.c"
                src.write_text('''
#include <assert.h>
#include "sg_recording.h"
#include "driver/gpio.h"
static int cfg_fail=1, level_fail, level=-1;
esp_err_t gpio_config(const gpio_config_t *c) {assert(c->pin_bit_mask==(1ULL<<48));return cfg_fail?ESP_FAIL:ESP_OK;}
esp_err_t gpio_set_level(int pin,int on) {assert(pin==48);if(level_fail)return ESP_FAIL;level=on;return ESP_OK;}
int main(void) {
    assert(!sg_recording_set(SG_RECORD_MIC,true));
    assert(sg_recording_init()==ESP_FAIL);
    cfg_fail=0;level_fail=1;assert(sg_recording_init()==ESP_FAIL);
    assert(!sg_recording_set(SG_RECORD_CAMERA,true));
    level_fail=0;assert(sg_recording_init()==ESP_OK);assert(level==!ACTIVE);
    assert(sg_recording_set(SG_RECORD_MIC,true));assert(level==ACTIVE);
    assert(sg_recording_set(SG_RECORD_CAMERA,true));assert(level==ACTIVE);
    assert(sg_recording_set(SG_RECORD_MIC,false));assert(level==ACTIVE);
    assert(sg_recording_set(SG_RECORD_CAMERA,false));assert(level==!ACTIVE);
    level_fail=1;assert(!sg_recording_set(SG_RECORD_CAMERA,true));
    level_fail=0;assert(sg_recording_set(SG_RECORD_MIC,false));assert(level==ACTIVE);
    assert(sg_recording_set(SG_RECORD_CAMERA,false));assert(level==!ACTIVE);
    return 0;
}
''')
                exe = out / "indicator"
                subprocess.run(["cc", "-std=c11", "-Wall", "-Wextra", "-Werror", f"-DACTIVE={active}", "-I", str(out), "-I", str(FW / "port"), str(src), str(FW / "port/sg_recording.c"), "-o", str(exe)], check=True)
                subprocess.run([str(exe)], check=True)
