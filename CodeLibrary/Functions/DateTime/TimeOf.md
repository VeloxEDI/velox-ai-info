---
title: "TimeOf"
description: "Returns the raw fractional-day portion of a `TDateTime` value."
sidebar_position: 143
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - time
  - tdatetime
  - fraction
  - pre-epoch
---

```Delphi
Function TimeOf( const AValue : TDateTime) : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 16, 14, 30, 0, 0);
  Value := TimeOf(InputValue); // Same fraction as EncodeTime(14, 30, 0, 0)
end;
```

### Usage

`TimeOf` returns the raw fractional-day portion of a `TDateTime` value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded value whose raw fractional portion is required. |

**Returns**

`Frac(AValue)` as a `TDateTime`. Its magnitude represents time of day; its sign follows the raw input.

**Behaviour**

- For zero or positive values, the result is normally in the half-open range 0 to less than 1.
- Calendar whole days are discarded.
- Floating precision is preserved; the result is not quantised to milliseconds by this routine.
- No clock, timezone or locale state is used.

**Errors**

No validation is performed. Ordinary finite values do not raise; core floating behaviour applies to invalid raw values.

**Usage notes**

Use component extractors such as `HourOf` when sign-independent clock fields are wanted. Avoid using raw `TimeOf` subtraction for pre-epoch chronology.

### Additional Technical Info
`TimeOf` returns the raw fractional portion of the `Double`-backed `TDateTime`. For ordinary post-epoch values this is the familiar non-negative fraction of a day.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.TimeOf`. The complete installed implementation is `Result := Frac(AValue)`; it performs no decoding, absolute-value operation, validation or rounding.

**Edge cases and quirks**

- Delphi encodes a timed pre-epoch date using a negative fractional part. `TimeOf` therefore returns a negative result for such a value, even though its magnitude represents a positive time after midnight.
- This is why `SameTime` applies `Abs(TimeOf(...))` before rounding to milliseconds.
- If a universally non-negative time fraction is required, the caller must account for the pre-epoch sign deliberately; do not silently use raw subtraction.
- Arbitrary non-finite `Double` values are outside the valid date/time contract.
- Free Pascal provides the same-name operation, but dialect representation details should not be used to override installed Delphi behaviour.

**Side effects**

None.

**Performance and concurrency**

Constant-time floating-point `Frac` operation with no I/O or shared state.

**Related entries**

- [`SameTime`](SameTime.md) compares absolute rounded time portions.
- [`HourOf`](HourOf.md) decodes a sign-independent hour component.

**External references**

- [Embarcadero `System.DateUtils.TimeOf`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.TimeOf)
- [Free Pascal `TimeOf`](https://www.freepascal.org/docs-html/rtl/dateutils/timeof.html)

<small>Created 2026-07-15</small>
