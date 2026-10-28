// SPDX-License-Identifier: Apache-2.0
#include "sg_recording.h"
#include "sg_pins.h"
#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "sdkconfig.h"

#if CONFIG_SG_RECORD_LED_ACTIVE_HIGH
#define LED_ON 1
#else
#define LED_ON 0
#endif

static portMUX_TYPE s_lock = portMUX_INITIALIZER_UNLOCKED;
static unsigned s_owners;
static bool s_ready;

esp_err_t sg_recording_init(void) {
    if (s_ready) return ESP_OK; // Called once, before camera/voice workers start.
    gpio_config_t cfg = {.pin_bit_mask = 1ULL << SG_PIN_REC_LED, .mode = GPIO_MODE_OUTPUT};
    esp_err_t err = gpio_config(&cfg);
    if (err != ESP_OK) return err;
    err = gpio_set_level(SG_PIN_REC_LED, !LED_ON);
    s_ready = err == ESP_OK;
    return err;
}

bool sg_recording_set(unsigned owner, bool active) {
    if (!s_ready) return false; // Refuse acquisition without an initialized indicator.
    portENTER_CRITICAL(&s_lock);
    if (active) s_owners |= owner;
    else s_owners &= ~owner;
    bool ok = gpio_set_level(SG_PIN_REC_LED,
        s_owners ? LED_ON : !LED_ON) == ESP_OK;
    portEXIT_CRITICAL(&s_lock);
    return ok;
}
