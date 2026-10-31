# Isolated OV5640 sequencing contract

These portable C files are **not linked into the active OV2640 ESP-IDF port**.
They define the separate carrier's default-off interface for a host harness.
No GPIO, expander or voltage-monitor circuit is invented or assigned.

The adapter must measure actual rail-in-range and below100 mV states, provide
safe initial outputs, AXC OE open-drain control, SCCB EN, PWDN/RESETB/XCLK,
bus-idle detection and microsecond delays. AF must stay unpowered and below100 mV.
The AF supply/driver and OV5640 register setup are unfinished.

Power-up establishes discharged rails, enables IO→analog→core, checks each rise
in<5 ms, waits5 ms before PWDN release,1 ms before RESETB release and20 ms before
SCCB. Clock is active throughout the final delay and rail health is rechecked.
Shutdown isolates interfaces, asserts PWDN/reset, stops clock and removes core,
analog and IO with measured discharge checks. A discharge timeout leaves earlier
rails on and controls isolated, returning failure rather than claiming power-off.
The actual adapter must continuously handle brownouts; this host contract does
not validate real voltage rise/fall or implement that adapter.

The harness covers ordering/timing, all three rise failures, stuck discharge,
busy SCCB, missing operations and powered-AF refusal. These are **host tests**,
not hardware camera/image/autofocus verification.

```sh
cc -std=c11 -Wall -Wextra -Werror -pedantic \
  firmware/camera-carrier/ov5640_sequence.c \
  firmware/camera-carrier/test_sequence.c -o /tmp/smart-glasses-camera-sequence
/tmp/smart-glasses-camera-sequence
```

[Electrical and mechanical review](../../docs/camera-carrier-review.md).
