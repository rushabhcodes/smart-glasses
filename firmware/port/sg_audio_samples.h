// SPDX-License-Identifier: Apache-2.0
#pragma once
#include <stdint.h>

// INMP441: signed 24-bit, MSB aligned in a Philips I2S 32-bit slot.
// Take the upper 16 bits without left-shifting negative signed integers.
static inline int16_t sg_mic_pcm16(int32_t slot) {
    uint16_t top = (uint32_t)slot >> 16;
    return top <= INT16_MAX ? (int16_t)top : (int16_t)((int32_t)top - 65536);
}

static inline int32_t sg_speaker_slot(int16_t sample, int percent) {
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    return (int32_t)(((int64_t)sample * 65536 * percent) / 100);
}
