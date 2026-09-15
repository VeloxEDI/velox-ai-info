---
title: "Trunc"
description: "Discards an Extended value's fraction toward zero and narrows the result to a 32-bit LongInt."
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - truncation
  - overflow
---

```Delphi
function Trunc(E: Extended): LongInt;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Trunc(-12.75); // -12
end;
```

### Usage

`Trunc` discards an Extended value's fraction toward zero and narrows the result to a 32-bit LongInt.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `E` | `Extended` | Floating value whose fractional component is discarded toward zero. |

**Returns**

For a truncated value within `Low(LongInt)`..`High(LongInt)`, the expected 32-bit integer. Otherwise, the low 32 bits of the Velox `Int64` result are reinterpreted as signed LongInt.

| Velox `Int64` result | Velox `LongInt` result |
|---|---|
| `2147483648` | `-2147483648` |
| `4294967295` | `-1` |
| `4294967296` | `0` |
| `-2147483649` | `2147483647` |

### Additional Technical Info
`Trunc` discards the fractional part of an `Extended` value by rounding toward zero, obtains Delphi's `Int64` result, then stores only a PascalScript 32-bit `LongInt`.

The unchecked 32-bit narrowing is a critical difference from Delphi's public `Int64` contract. Values outside the LongInt range silently wrap modulo 2^32 if they are still convertible to `Int64`. The example is fictional and source-reviewed only.

**Implementation**

1. The modified PascalScript compiler declares `Trunc` in the Numeric group.
2. Runtime `DefProc` selector 19 reads the argument as real.
3. Delphi `System.Trunc` produces an `Int64` by rounding toward zero.
4. `Stack.SetInt` accepts a `LongInt`; `PascalScript.inc` has disabled range/overflow checks, so narrowing wraps.

**Edge cases and errors**

- `Trunc(-12.75)` is `-12`, not floor `-13`.
- NaN, infinity or a value outside Delphi's `Int64` conversion range can raise `EInvalidOp`/a PascalScript math error before narrowing.
- `Extended` is Double on default Win64 and wider on Win32; near-boundary binary representation can differ.
- This is not a checked numeric conversion. Validate against the 32-bit LongInt range before calling if wraparound is not acceptable.

**Related entries**

- [`Int`](../Math/Int.md) also removes the fraction toward zero but returns floating `Extended` and does not narrow to LongInt.
- [`Frac`](Frac.md) returns the complementary signed fractional part.
- [`Round`](Round.md) rounds to nearest before applying the same unchecked 32-bit narrowing.

**External references**

- [Free Pascal: `System.Trunc`](https://www.freepascal.org/docs-html/rtl/system/trunc.html)
- [Embarcadero DocWiki: `System.Trunc`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Trunc)

<small>Created 2026-07-15</small>
