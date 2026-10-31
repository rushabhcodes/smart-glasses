// SPDX-License-Identifier: Apache-2.0
#include "ov5640_sequence.h"
static bool valid(const sg_cam_ops *o) {
    return o && o->rail_enable && o->rail_in_range && o->rail_below_100mv &&
        o->dvp_enable && o->sccb_enable && o->sccb_idle && o->af_below_100mv && o->pwdn &&
        o->resetb && o->clock_enable && o->delay_us;
}
static void isolate(const sg_cam_ops *o) {
    o->sccb_enable(o->ctx, false);
    o->pwdn(o->ctx, true);
    o->resetb(o->ctx, false);
    o->clock_enable(o->ctx, false);
    o->dvp_enable(o->ctx, false);
}
static bool wait_rail(const sg_cam_ops *o, sg_cam_rail r, bool on) {
    // Rise must finish in <5ms. Discharge may take longer (analog bleed).
    uint32_t limit = on ? 5000 : 1000000;
    for (uint32_t t = 0; t < limit; t += 100) {
        if (on ? o->rail_in_range(o->ctx, r) : o->rail_below_100mv(o->ctx, r))
            return true;
        o->delay_us(o->ctx, 100);
    }
    return false;
}
bool sg_ov5640_power_off(const sg_cam_ops *o) {
    if (!valid(o)) return false;
    isolate(o);
    if (!o->af_below_100mv(o->ctx)) return false;
    for (int r = SG_CAM_CORE; r >= SG_CAM_IO; --r) {
        o->rail_enable(o->ctx, (sg_cam_rail)r, false);
        // On failure keep earlier rails on and controls isolated; do not
        // falsely report a safe discharge or reverse the required rail order.
        if (!wait_rail(o, (sg_cam_rail)r, false)) return false;
    }
    return true;
}
bool sg_ov5640_power_on(const sg_cam_ops *o) {
    if (!valid(o) || !sg_ov5640_power_off(o)) return false;
    for (int r = SG_CAM_IO; r <= SG_CAM_CORE; ++r) {
        o->rail_enable(o->ctx, (sg_cam_rail)r, true);
        if (!wait_rail(o, (sg_cam_rail)r, true)) {
            (void)sg_ov5640_power_off(o);
            return false;
        }
    }
    o->delay_us(o->ctx, 5000);
    for (int r = SG_CAM_IO; r <= SG_CAM_CORE; ++r)
        if (!o->rail_in_range(o->ctx, (sg_cam_rail)r)) {
            (void)sg_ov5640_power_off(o); return false;
        }
    o->dvp_enable(o->ctx, true);
    o->pwdn(o->ctx, false);
    o->clock_enable(o->ctx, true);
    o->delay_us(o->ctx, 1000);
    o->resetb(o->ctx, true);
    o->delay_us(o->ctx, 20000);
    bool healthy = true;
    for (int r = SG_CAM_IO; r <= SG_CAM_CORE; ++r)
        healthy = healthy && o->rail_in_range(o->ctx, (sg_cam_rail)r);
    if (!healthy || !o->sccb_idle(o->ctx)) {
        (void)sg_ov5640_power_off(o);
        return false;
    }
    o->sccb_enable(o->ctx, true);
    return true;
}
