#!/usr/bin/env python3
"""Materialize pinned upstream sources, then apply our reviewed patch and overlay."""
from pathlib import Path
import csv
import hashlib
import io
import json
import shutil
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parents[2]
FW = ROOT / "firmware"
CACHE = ROOT / ".cache"
UPSTREAM = CACHE / "muse-gadget-sdk-upstream"
PROJECT = CACHE / "muse-smart-glasses-sdk"
LOCK = json.loads((FW / "upstream.lock.json").read_text())


def run(*args, **kwargs):
    return subprocess.run(args, check=True, **kwargs)


def prepare():
    CACHE.mkdir(exist_ok=True)
    sdk = LOCK["muse_sdk"]
    if not UPSTREAM.exists():
        run("git", "clone", "--no-checkout", "--filter=blob:none", "--depth=1", sdk["url"], str(UPSTREAM))
        run("git", "-C", str(UPSTREAM), "fetch", "--depth=1", "origin", sdk["commit"])
        run("git", "-C", str(UPSTREAM), "checkout", "--detach", sdk["commit"])
    revision = run("git", "-C", str(UPSTREAM), "rev-parse", "HEAD", capture_output=True, text=True).stdout.strip()
    if revision != sdk["commit"]:
        # Never reset a checkout that could contain local work.
        raise SystemExit(f"SDK cache is {revision}; expected {sdk['commit']}. Use a pristine pinned checkout.")
    dirty = run("git", "-C", str(UPSTREAM), "status", "--porcelain", capture_output=True, text=True).stdout
    if dirty:
        raise SystemExit("SDK cache contains changes; keep it pristine and edit firmware/port or patches instead.")
    marker = PROJECT / ".smart-glasses-upstream"
    if PROJECT.exists() and (not marker.exists() or marker.read_text().strip() != revision):
        raise SystemExit(f"Generated SDK pin changed; move {PROJECT} aside, then prepare again.")
    if not PROJECT.exists():
        PROJECT.mkdir()
        archive = run("git", "-C", str(UPSTREAM), "archive", "HEAD", capture_output=True).stdout
        with tarfile.open(fileobj=io.BytesIO(archive)) as source:
            source.extractall(PROJECT, filter="data")
        marker.write_text(revision + "\n")
    patches = sorted((FW / "patches").glob("*.patch"))
    inputs = [Path(__file__).resolve(), FW / "upstream.lock.json", ROOT / "docs/proposed-gpio-map.csv", *patches, *sorted((FW / "port").glob("*"))]
    digest = hashlib.sha256(b"".join(p.read_bytes() for p in inputs if p.is_file())).hexdigest()
    stamp = PROJECT / ".smart-glasses-overlay"
    if not stamp.exists() or stamp.read_text().strip() != digest:
        paths = set()
        for patch in patches:
            for line in patch.read_text().splitlines():
                if line.startswith("--- a/"):
                    paths.add(line[6:])
        for path in paths:
            content = run("git", "-C", str(UPSTREAM), "show", f"{revision}:{path}", capture_output=True).stdout
            (PROJECT / path).write_bytes(content)
        for patch in patches:
            run("git", "apply", "--directory=" + str(PROJECT.relative_to(ROOT)), str(patch), cwd=ROOT)
        for path in (FW / "port").iterdir():
            if path.is_file():
                shutil.copy2(path, PROJECT / "esp32/main" / path.name)
        rows = list(csv.DictReader((ROOT / "docs/proposed-gpio-map.csv").open()))
        pins = {row["Signal"]: int(row["Proposed GPIO"]) for row in rows}
        reserved = {0, 3, 19, 20, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 43, 44, 45, 46}
        if len(set(pins.values())) != len(pins) or set(pins.values()) & reserved:
            raise SystemExit("Proposed GPIO map duplicates a pin or uses a reserved module pin.")
        header = "// Generated from docs/proposed-gpio-map.csv; PROVISIONAL wiring.\n#pragma once\n"
        header += "".join(f"#define SG_PIN_{name} {pin}\n" for name, pin in pins.items())
        (PROJECT / "esp32/main/sg_pins.h").write_text(header)
        stamp.write_text(digest + "\n")
    dependency_lock = FW / "dependencies.lock"
    if dependency_lock.exists():
        shutil.copy2(dependency_lock, PROJECT / "esp32/dependencies.lock")
    print(PROJECT / "esp32")


if __name__ == "__main__":
    prepare()
