---
title: "DateOf"
description: "Removes the time component by truncating a TDateTime value to its date portion."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - truncation
  - delphi
---

```Delphi
Function DateOf(const AValue: TDateTime): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Timestamp: TDateTime;
begin
  Timestamp := EncodeDate(2026, 7, 18) + EncodeTime(14, 30, 0, 0);
  Value := DateOf(Timestamp); // 18 July 2026 at midnight
end;
```

### Usage

`DateOf` removes the time component by truncating a TDateTime value to its date portion.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Date/time value from which to remove the time component. |

**Returns**

`Trunc(AValue)`, normally representing the same calendar date at midnight.

**Behaviour**

For an ordinary encoded value, every timestamp on the same day produces the same result. The routine neither rounds nor validates the floating value and does not convert between local time and UTC.

**Errors**

Valid finite values do not raise. The function does not validate NaN, infinity or an out-of-domain numeric date.

**Usage notes**

Use `DateOf` when you already have a timestamp. Use [`Date`](Date.md) only when you specifically need the host's current local date.

### Additional Technical Info
`DateOf` removes the time of day from an existing `TDateTime` value without reading a clock or applying timezone rules. It returns the value's integral Delphi date component.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.DateOf`. Its entire terminal implementation is `Result := Trunc(AValue)`.

**Edge cases and quirks**

- For pre-epoch values, Delphi encodes the time as the magnitude of a negative fraction. `Trunc` still removes that time according to Delphi's convention; do not replace it with `Floor`, which would select a different integer for negative values.
- Floating-point arithmetic can produce a value just across an intended midnight boundary. Because `DateOf` simply truncates, it can then return the adjacent date. Embarcadero recommends rounding an imprecisely calculated value before applying `DateOf` when this risk exists.
- A result of `0.0` is the valid Delphi epoch date, 30 December 1899, not an error sentinel.
- Free Pascal implements the same `Trunc` operation, but its reference is compatibility information rather than the runtime used by Velox.

**Side effects**

None.

**Performance and concurrency**

Constant-time scalar truncation with no allocation or shared state.

**Related entries**

- [`Date`](Date.md) obtains the current local date.
- [`DecodeDate`](DecodeDate.md) returns year, month and day as separate values.
- [`CompareDate`](CompareDate.md) compares two date portions without returning them.

**External references**

- [Embarcadero `System.DateUtils.DateOf`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DateOf) - documents the exact routine and its calculated-value precision warning.
- [Free Pascal `DateOf`](https://www.freepascal.org/docs-html/rtl/dateutils/dateof.html) - documents the compatible truncation-based implementation.

<small>Created 2026-07-15</small>
