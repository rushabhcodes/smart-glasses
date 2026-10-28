#!/usr/bin/env bash
# Intentionally build-only: never connects to a serial port or accepts flash targets.
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
ACTION="${1:-build}"
[[ $# -le 1 ]] || { echo 'Usage: build.sh [build|test|size]'; exit 2; }
case "$ACTION" in build|test|size) ;; *) echo 'Only build, test and size are supported; flashing is not implemented.'; exit 2;; esac
export IDF_TOOLS_PATH="$ROOT/.cache/espressif"
export PIP_CACHE_DIR="$ROOT/.cache/pip"
export XDG_CACHE_HOME="$ROOT/.cache/xdg"
export PATH="$ROOT/.cache/python-bin:$PATH"
[[ -f "$IDF_TOOLS_PATH/python_env/idf6.0_py3.12_env/bin/activate" ]] || { echo 'Run npm run firmware:bootstrap first.'; exit 1; }
export IDF_PATH="$ROOT/.cache/esp-idf-v6.0.1"
source "$IDF_PATH/export.sh" >/dev/null
python3 firmware/scripts/prepare.py
PROJECT="$ROOT/.cache/muse-smart-glasses-sdk/esp32"
BUILD="$ROOT/firmware/build"
if [[ "$ACTION" == test ]]; then
    python3 -m unittest discover -s firmware/tests -p 'test_*.py' -v
    export FREEINK_SOURCE_DIR="$ROOT/.cache/freeink-host-tests"
    python3 firmware/scripts/host_test_deps.py
    cd "$PROJECT"
    python3 -m unittest discover -s tests -p 'test_*.py' -v
else
    idf.py -C "$PROJECT" -B "$BUILD" -DIDF_TARGET=esp32s3 \
        -DSDKCONFIG_DEFAULTS="$PROJECT/sdkconfig.defaults;$ROOT/firmware/sdkconfig.smart-glasses" "$ACTION"
    if [[ "$ACTION" == build ]]; then python3 "$ROOT/firmware/scripts/verify_build.py"; fi
fi
