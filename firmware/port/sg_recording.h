// SPDX-License-Identifier: Apache-2.0
#pragma once
#include <stdbool.h>
#include "esp_err.h"
#define SG_RECORD_MIC 1u
#define SG_RECORD_CAMERA 2u
esp_err_t sg_recording_init(void);
bool sg_recording_set(unsigned owner, bool active);
