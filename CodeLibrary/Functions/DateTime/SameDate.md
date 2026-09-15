---
title: "SameDate"
description: "Reports whether two `TDateTime` values have the same truncated encoded date portion."
sidebar_position: 121
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - comparison
  - tdatetime
---

```Delphi
Function SameDate( const A, B : TDateTime) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  MorningValue, EveningValue: TDateTime;
begin
  MorningValue := EncodeDateTime(2026, 7, 16, 8, 0, 0, 0);
  EveningValue := EncodeDateTime(2026, 7, 16, 18, 30, 0, 0);
  Value := SameDate(MorningValue, EveningValue); // True
end;
```

### Usage

`SameDate` reports whether two `TDateTime` values have the same truncated encoded date portion.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `TDateTime`, `const` | First encoded value. |
| `B` | `TDateTime`, `const` | Second encoded value. |

**Returns**

`True` when `Trunc(A)` equals `Trunc(B)`; otherwise `False`.

**Behaviour**

- Any two ordinary times on the same encoded calendar date compare equal.
- The comparison is symmetric.
- Timezone, daylight-saving and locale information are not present in either value and are not considered.
- Valid pre-epoch values use Velox's negative `TDateTime` representation; truncation still selects their encoded date integer.

**Errors**

Ordinary finite `TDateTime` inputs do not raise. Velox performs no additional validation.

**Usage notes**

Use `SameDateTime` when date and millisecond-resolved time must both match. Use `SameTime` when only the time of day matters.

### Additional Technical Info
`SameDate` reports whether two encoded values have the same date portion. Their time-of-day fields are deliberately ignored.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils script import binds directly to Delphi 37.0 `System.DateUtils.SameDate`. The installed implementation applies `Trunc` to both `Double`-backed `TDateTime` values and compares the integer results. It does not call `SameDateTime`, decode individual fields or consult a tolerance.

**Edge cases and quirks**

- This is a raw date-part comparison. It does not determine whether two timezone-aware instants fall on the same local date.
- No validation or normalisation occurs before `Trunc`. Arbitrary non-finite or out-of-range floating values are outside the normal `TDateTime` contract.
- `IsSameDay` is a different routine: it tests whether one raw value falls within an interval based on another and has a documented timed pre-epoch defect. `SameDate` compares two truncated date parts directly.
- Free Pascal currently describes its implementation through `CompareDate`; that is compatible at the API level but is not the terminal used by installed Delphi.

**Side effects**

None.

**Performance and concurrency**

Constant-time floating-point truncation and integer comparison with no allocation, I/O or shared state.

**Related entries**

- [`SameDateTime`](SameDateTime.md) compares date and time down to the encoded millisecond.
- [`IsSameDay`](IsSameDay.md) has different value/basis interval semantics.

**External references**

- [Embarcadero `System.DateUtils.SameDate`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.SameDate)
- [Free Pascal `SameDate`](https://www.freepascal.org/docs-html/rtl/dateutils/samedate.html)

<small>Created 2026-07-15</small>
