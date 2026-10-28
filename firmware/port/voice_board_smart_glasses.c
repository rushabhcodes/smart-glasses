// SPDX-License-Identifier: Apache-2.0
// Proposed custom-board wiring only; not a DevKit pin preset.
#include "voice_board.h"
#include "sg_audio_samples.h"
#include "sg_pins.h"
#include "sg_recording.h"
#include <stdatomic.h>
#include "driver/gpio.h"
#include "driver/i2s_std.h"
#include "esp_check.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "sdkconfig.h"

#if CONFIG_SG_AMP_ACTIVE_HIGH
#define AMP_ON 1
#else
#define AMP_ON 0
#endif

static const char *TAG = "link.sg.audio";
static i2s_chan_handle_t s_tx, s_rx;
static bool s_ready;
static atomic_bool s_recording;
static atomic_bool s_rx_fault;
static atomic_int s_volume = CONFIG_SG_DEFAULT_VOLUME;
#define CHUNK 320
// Single microphone reader and single speaker writer, on separate tasks.
static int32_t s_rx_slots[CHUNK * 2];
static int32_t s_tx_slots[CHUNK * 2];

void voice_board_amp(bool on) {
    gpio_set_level(SG_PIN_AMP_ENABLE,
        on && s_ready ? AMP_ON : !AMP_ON);
}

esp_err_t voice_board_init(void) {
    esp_err_t err;
    gpio_config_t amp = {.pin_bit_mask = 1ULL << SG_PIN_AMP_ENABLE, .mode = GPIO_MODE_OUTPUT};
    ESP_RETURN_ON_ERROR(gpio_config(&amp), TAG, "amp control GPIO");
    voice_board_amp(false);
    ESP_RETURN_ON_ERROR(sg_recording_init(), TAG, "recording indicator");
    i2s_chan_config_t chan = I2S_CHANNEL_DEFAULT_CONFIG(I2S_NUM_0, I2S_ROLE_MASTER);
    chan.dma_desc_num = 6;
    chan.dma_frame_num = CHUNK;
    chan.auto_clear = true; // Underflow sends zeros, never repeats stale speech.
    ESP_RETURN_ON_ERROR(i2s_new_channel(&chan, &s_tx, &s_rx), TAG, "I2S allocation");
    i2s_std_config_t bus = {
        .clk_cfg = I2S_STD_CLK_DEFAULT_CONFIG(VOICE_MIC_RATE),
        .slot_cfg = I2S_STD_PHILIPS_SLOT_DEFAULT_CONFIG(I2S_DATA_BIT_WIDTH_32BIT, I2S_SLOT_MODE_STEREO),
        .gpio_cfg = {
            .mclk = I2S_GPIO_UNUSED, .bclk = SG_PIN_AUDIO_BCLK, .ws = SG_PIN_AUDIO_LRCLK,
            .dout = SG_PIN_AUDIO_DOUT, .din = SG_PIN_MIC_SD,
        },
    };
    if ((err = i2s_channel_init_std_mode(s_tx, &bus)) != ESP_OK) goto fail;
    if ((err = i2s_channel_init_std_mode(s_rx, &bus)) != ESP_OK) goto fail;
    if ((err = i2s_channel_enable(s_tx)) != ESP_OK) goto fail;
    // Keep the shared BCLK/LRCLK running; RX DMA is enabled only during a turn.
    // This allows the INMP441 to settle before the first press (no power gating yet).
    vTaskDelay(pdMS_TO_TICKS(300));
    s_ready = true;
    ESP_LOGI(TAG, "INMP441 + MAX98357A: 16 kHz, stereo 32-bit slots, half duplex");
    return ESP_OK;
fail:
    if (s_rx) { i2s_del_channel(s_rx); s_rx = NULL; }
    if (s_tx) { i2s_del_channel(s_tx); s_tx = NULL; }
    voice_board_amp(false);
    return err;
}

esp_err_t voice_board_mic_start(void) {
    if (!s_ready || atomic_load(&s_recording)) return ESP_ERR_INVALID_STATE;
    if (!sg_recording_set(SG_RECORD_MIC, true)) return ESP_FAIL;
    esp_err_t err = i2s_channel_enable(s_rx);
    if (err != ESP_OK) { sg_recording_set(SG_RECORD_MIC, false); return err; }
    atomic_store(&s_recording, true);
    return ESP_OK;
}

void voice_board_mic_stop(void) {
    if (atomic_exchange(&s_recording, false)) {
        esp_err_t err = i2s_channel_disable(s_rx);
        if (err != ESP_OK) {
            // Keep the indicator on if DMA could still be receiving.
            atomic_store(&s_recording, true);
            atomic_store(&s_rx_fault, true);
            ESP_LOGE(TAG, "RX disable failed: %s", esp_err_to_name(err));
            return;
        }
    }
    sg_recording_set(SG_RECORD_MIC, false);
}

size_t voice_board_mic_read(int16_t *pcm, size_t frames, int *peak) {
    *peak = 0;
    if (!pcm || !atomic_load(&s_recording)) return 0;
    if (frames > CHUNK) frames = CHUNK;
    size_t bytes = 0;
    esp_err_t err = i2s_channel_read(s_rx, s_rx_slots, frames * 2 * sizeof(int32_t), &bytes, 100);
    if (err != ESP_OK && err != ESP_ERR_TIMEOUT) return 0;
    size_t count = bytes / (2 * sizeof(int32_t));
    for (size_t i = 0; i < count; ++i) {
        pcm[i] = sg_mic_pcm16(s_rx_slots[2 * i]); // L/R strapped LOW => left slot.
        int a = pcm[i] < 0 ? -(int)pcm[i] : pcm[i];
        if (a > *peak) *peak = a;
    }
    return count;
}

esp_err_t voice_board_speaker_write(const int32_t *frames, size_t count) {
    if (!s_ready || !frames) return ESP_ERR_INVALID_STATE;
    while (count) {
        size_t n = count < CHUNK ? count : CHUNK;
        int volume = atomic_load(&s_volume);
        for (size_t i = 0; i < 2 * n; ++i)
            s_tx_slots[i] = sg_speaker_slot(sg_mic_pcm16(frames[i]), volume);
        size_t bytes = 0, wanted = n * 2 * sizeof(int32_t);
        esp_err_t err = i2s_channel_write(s_tx, s_tx_slots, wanted, &bytes, 100);
        if (err != ESP_OK) return err;
        if (bytes != wanted) return ESP_ERR_TIMEOUT;
        frames += 2 * n;
        count -= n;
    }
    return ESP_OK;
}

void voice_board_set_volume(int percent) {
    if (percent < 0) percent = 0;
    if (percent > CONFIG_SG_MAX_VOLUME) percent = CONFIG_SG_MAX_VOLUME;
    atomic_store(&s_volume, percent);
}
bool voice_board_muted(void) { return !s_ready || atomic_load(&s_rx_fault); }
bool voice_board_echo_cancelled(void) { return false; }
int voice_board_dial_steps(void) { return 0; }
