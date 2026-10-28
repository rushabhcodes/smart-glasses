// SPDX-License-Identifier: Apache-2.0
#pragma once
#include "cJSON.h"
#include "noise_control.h"
void sg_camera_register(void);
cJSON *sg_camera_command(const char *request_id, noise_ctrl_session_generation_t generation);
