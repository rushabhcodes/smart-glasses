#!/usr/bin/env python3
"""Pinned sources needed only by upstream UI regression tests, not by our firmware."""
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[2]
manifest = (ROOT / ".cache/muse-gadget-sdk-upstream/esp32/components/muse/idf_component.yml").read_text()
pin = re.search(r"freeink-sdk:\s+git:.*?\s+version: ([0-9a-f]{40})", manifest).group(1)
source = ROOT / ".cache/freeink-host-tests"
if not source.exists():
    subprocess.run(["git", "clone", "--no-checkout", "--filter=blob:none", "--depth=1", "https://github.com/Free-Ink/freeink-sdk.git", str(source)], check=True)
    subprocess.run(["git", "-C", str(source), "fetch", "--depth=1", "origin", pin], check=True)
    subprocess.run(["git", "-C", str(source), "checkout", "--detach", pin], check=True)
revision = subprocess.check_output(["git", "-C", str(source), "rev-parse", "HEAD"], text=True).strip()
if revision != pin:
    raise SystemExit("Host-test FreeInk cache is at the wrong pin; preserve changes before replacing it.")
