#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
export IDF_TOOLS_PATH="$ROOT/.cache/espressif"
export PIP_CACHE_DIR="$ROOT/.cache/pip"
export XDG_CACHE_HOME="$ROOT/.cache/xdg"
# Keep every downloaded tool under this repository. Do not edit shell profiles.
if [[ ! -x .cache/python-bin/python3.12 ]]; then
    command -v uv >/dev/null || { echo 'Install uv or provide a local Python 3.12 at .cache/python-bin/python3.12'; exit 1; }
    UV_PYTHON_INSTALL_DIR="$ROOT/.cache/python" UV_PYTHON_BIN_DIR="$ROOT/.cache/python-bin" UV_CACHE_DIR="$ROOT/.cache/uv" uv python install 3.12
fi
ln -sfn python3.12 .cache/python-bin/python3
ln -sfn python3.12 .cache/python-bin/python
export PATH="$ROOT/.cache/python-bin:$PATH"
if [[ ! -d .cache/esp-idf-v6.0.1 ]]; then
    git clone --depth 1 --filter=blob:none --branch v6.0.1 --recursive --shallow-submodules https://github.com/espressif/esp-idf.git .cache/esp-idf-v6.0.1
fi
actual="$(git -C .cache/esp-idf-v6.0.1 rev-parse HEAD)"
expected="$(python3 -c 'import json; print(json.load(open("firmware/upstream.lock.json"))["esp_idf"]["commit"])')"
[[ "$actual" == "$expected" ]] || { echo 'ESP-IDF cache revision does not match firmware/upstream.lock.json'; exit 1; }
.cache/esp-idf-v6.0.1/install.sh esp32s3
