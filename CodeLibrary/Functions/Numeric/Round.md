---
title: "Round"
description: "Rounds an Extended value to the nearest 32-bit LongInt using the active floating-point rounding mode."
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - rounding
  - overflow
---

```Delphi
function Round(E: Extended): LongInt;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Round(2.5); // normally 2 under nearest/even rounding
end;
```

### Usage

Rounds an Extended value to the nearest 32-bit LongInt using the active floating-point rounding mode.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `E` | `Extended` | Floating value to round according to the active x87/SSE rounding mode. |

**Returns**

For a Velox-rounded value within `Low(LongInt)`..`High(LongInt)`, the expected 32-bit integer. Values outside that range but still within `Int64` silently wrap modulo 2^32 because `Velox scripting.inc` disables range/overflow checks in `DefProc`.

| Velox `Int64` result | Velox `LongInt` result |
|---|---|
| `2147483647` | `2147483647` |
| `2147483648` | `-2147483648` |
| `4294967295` | `-1` |
| `4294967296` | `0` |

### Additional Technical Info
`Round` rounds an `Extended` value to an integer using Delphi `System.Round`, then stores only a PascalScript 32-bit `LongInt` result.

The default floating-point mode is nearest with ties to even (`2.5 -> 2`, `3.5 -> 4`), but the wrapper does not force that mode. Its 32-bit unchecked narrowing is materially different from Delphi's documented `Int64` result. The example is fictional and source-reviewed only.

**Implementation**

1. The modified PascalScript compiler declares `Round` in the Numeric group.
2. Runtime `DefProc` selector 18 reads an `Extended` from the stack.
3. Delphi `System.Round` produces an `Int64` according to the active floating-point mode.
4. Passing that value to `Stack.SetInt` narrows it to `LongInt` with checks explicitly disabled.

**Edge cases and errors**

- Default midpoint behavior is nearest/even, not always away from zero.
- Code elsewhere in the process can change the floating-point rounding mode, altering results; Velox does not restore a known mode around this call.
- NaN, infinity or a rounded value outside Delphi's `Int64` conversion range can raise `EInvalidOp`/a math error before the 32-bit narrowing.
- `Extended` is Double on default Win64 and wider on Win32, so borderline values can differ by target.
- Do not use this function as a checked conversion. Validate the 32-bit range before calling if wraparound is unacceptable.

**Related entries**

- [`Trunc`](Trunc.md) discards the fraction toward zero and has the same unchecked 32-bit narrowing.
- [`Round2BR`](Round2BR.md) scales a Double and uses Delphi Round before rescaling.
- [`Round2Up`](Round2Up.md) implements midpoint-away-from-zero behavior through text for supported inputs.

**External references**

- [Free Pascal: `System.Round`](https://www.freepascal.org/docs-html/rtl/system/round.html)
- [Embarcadero DocWiki: `System.Round`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Round)

<small>Created 2026-07-15</small>
