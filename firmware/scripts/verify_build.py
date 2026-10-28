#!/usr/bin/env python3
"""Reject a successful build that silently used the wrong target/media profile."""
from pathlib import Path
import csv
import re
import subprocess

ROOT = Path(__file__).resolve().parents[2]
BUILD = ROOT / "firmware/build"
config = (BUILD / "sdkconfig").read_text()
expected = {
    "IDF_TARGET": '"esp32s3"', "ESPTOOLPY_FLASHSIZE": '"8MB"',
    "ESPTOOLPY_FLASHMODE_QIO": "y", "FREERTOS_TASK_CREATE_ALLOW_EXT_MEM": "y",
    "SPIRAM": "y", "SPIRAM_MODE_OCT": "y", "SPIRAM_SPEED_80M": "y",
    "HOMEHUB_SMART_GLASSES": "y", "HOMEHUB_VOICE": "y", "MUSE_BOARD_ID": '"none"',
    "HOMEHUB_LED_BACKEND_NONE": "y", "MUSE_REALTIME_VOICE": "y",
    "SG_MAX_VOLUME": "20", "SG_CAMERA_MAX_JPEG_BYTES": "32768", "GADGET_SDK_TOKEN": '""',
    "PARTITION_TABLE_CUSTOM_FILENAME": '"partitions_muse_8mb.csv"',
}
for key, value in expected.items():
    if not re.search(rf'^CONFIG_{key}={re.escape(value)}$', config, re.M):
        raise SystemExit(f"Wrong or missing build setting: CONFIG_{key}")
for key in ("MUSE_ENABLED", "MUSE_REALTIME_VOICE_AEC_DUPLEX", "HOMEHUB_OTA_ENABLED", "SECURE_BOOT", "SECURE_FLASH_ENC_ENABLED"):
    if re.search(rf'^CONFIG_{key}=y$', config, re.M):
        raise SystemExit(f"Unexpected enabled setting: CONFIG_{key}")
rows = csv.DictReader((ROOT / "docs/proposed-gpio-map.csv").open())
pins = {r["Signal"]: int(r["Proposed GPIO"]) for r in rows}
if f'CONFIG_HOMEHUB_BUTTON_GPIO={pins["USER_BUTTON"]}\n' not in config:
    raise SystemExit("SDK button configuration differs from GPIO proposal")
symbols = subprocess.run(["xtensa-esp-elf-nm", "--defined-only", str(BUILD / "muse-gadget.elf")], check=True, capture_output=True, text=True).stdout
for name in ("sg_camera_register", "sg_camera_command", "voice_board_mic_read", "voice_board_speaker_write", "esp_camera_fb_get", "muse_voice_call_start"):
    if not re.search(rf'\b{re.escape(name)}$', symbols, re.M):
        raise SystemExit(f"Media path missing from ELF: {name}")
if re.search(r'\blv_(?:init|display_create)$', symbols, re.M):
    raise SystemExit("Unexpected LVGL UI linked into displayless build")
size = (BUILD / "muse-gadget.bin").stat().st_size
slot = 0x3E0000
if size > slot * 0.9:
    raise SystemExit("App leaves less than 10% partition headroom")
print(f"Verified S3 N8R8 displayless profile; camera/audio/realtime linked; empty token; app {size:,}/{slot:,} bytes ({100 * (slot-size)/slot:.1f}% free).")
