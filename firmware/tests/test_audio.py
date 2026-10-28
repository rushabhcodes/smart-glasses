"""Exercise real conversion helpers across the full PCM16 range with UBSan."""
from pathlib import Path
import subprocess
import tempfile
import unittest

FW = Path(__file__).resolve().parents[1]


class AudioSamples(unittest.TestCase):
    def test_signed_alignment_gain_and_limits(self):
        with tempfile.TemporaryDirectory() as tmp:
            src = Path(tmp) / "samples.c"
            exe = Path(tmp) / "samples"
            src.write_text(r'''
#include <assert.h>
#include "sg_audio_samples.h"
int main(void) {
    for (int s = -32768; s <= 32767; s++) {
        int32_t aligned = (int32_t)((int64_t)s * 65536);
        assert(sg_mic_pcm16(aligned) == s);
        assert(sg_mic_pcm16((int32_t)((uint32_t)aligned | 0xFF00u)) == s);
        assert(sg_speaker_slot((int16_t)s, 100) == aligned);
        assert(sg_speaker_slot((int16_t)s, 101) == aligned);
        assert(sg_speaker_slot((int16_t)s, 0) == 0);
        assert(sg_speaker_slot((int16_t)s, -1) == 0);
        assert(sg_speaker_slot((int16_t)s, 20) == (int64_t)aligned / 5);
    }
    assert(sg_mic_pcm16(INT32_MIN) == INT16_MIN);
    assert(sg_mic_pcm16(INT32_MAX) == INT16_MAX);
    return 0;
}
''')
            subprocess.run(["cc", "-std=c11", "-Wall", "-Wextra", "-Werror", "-fsanitize=undefined", "-fno-sanitize-recover=all", "-I", str(FW / "port"), str(src), "-o", str(exe)], check=True)
            subprocess.run([str(exe)], check=True)
