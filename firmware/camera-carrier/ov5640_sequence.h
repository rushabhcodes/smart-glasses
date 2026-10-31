// SPDX-License-Identifier: Apache-2.0
#pragma once
#include <stdbool.h>
#include <stdint.h>
typedef enum { SG_CAM_IO, SG_CAM_ANALOG, SG_CAM_CORE } sg_cam_rail;
// Prototype contract only. A real adapter must measure actual rails, provide
// default-off GPIO states and drive AXC OE by open drain (never 3.3V).
// This is intentionally not connected to the existing OV2640 firmware port.
typedef struct {
    void *ctx;
    void (*rail_enable)(void *, sg_cam_rail, bool);
    bool (*rail_in_range)(void *, sg_cam_rail);
    bool (*rail_below_100mv)(void *, sg_cam_rail);
    void (*dvp_enable)(void *, bool);
    void (*sccb_enable)(void *, bool);
    bool (*sccb_idle)(void *);
    bool (*af_below_100mv)(void *); // AF supply remains isolated in this milestone.
    void (*pwdn)(void *, bool);
    void (*resetb)(void *, bool);
    void (*clock_enable)(void *, bool);
    void (*delay_us)(void *, uint32_t);
} sg_cam_ops;
bool sg_ov5640_power_on(const sg_cam_ops *);
bool sg_ov5640_power_off(const sg_cam_ops *);
