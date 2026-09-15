---
title: "IsSameDay"
description: "Reports whether one `TDateTime` falls in the numeric day interval selected by another value."
sidebar_position: 73
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - validation
  - boolean
---

```Delphi
Function IsSameDay(const AValue, ABasis: TDateTime): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  ValueToCheck, BasisValue: TDateTime;
begin
  ValueToCheck := EncodeDateTime(2026, 7, 18, 23, 59, 0, 0);
  BasisValue := EncodeDateTime(2026, 7, 18, 8, 0, 0, 0);
  Value := IsSameDay(ValueToCheck, BasisValue); // True
end;
```

### Usage

`IsSameDay` reports whether one `TDateTime` falls in the numeric day interval selected by another value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Value tested against the basis interval. |
| `ABasis` | `TDateTime`, `const` | Value whose truncated numeric day defines the interval. |

**Returns**

`True` when `AValue >= Trunc(ABasis)` and `AValue < Trunc(ABasis) + 1`; otherwise `False`.

**Behaviour**

- For ordinary dates on or after Velox's epoch, times from midnight inclusive to the following midnight exclusive match the basis day.
- The arguments have different roles: `ABasis` selects the interval and `AValue` is tested, so this is not implemented as a symmetric component comparison.
- No timezone conversion occurs.

**Errors**

There is no function exception handling. Invalid or non-finite encoded values can raise during decoding or produce non-useful comparisons rather than a meaningful Boolean.

**Usage notes**

Use the result as the documented field or date predicate only. It does not establish a timezone, business calendar or input provenance.

### Additional Technical Info
`IsSameDay` reports whether one `TDateTime` falls in the numeric day interval selected by another value.

The example is fictional and source-reviewed. It is deterministic for the supplied fields. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.IsSameDay`. It truncates only `ABasis`, then applies two ordered comparisons to the raw `TDateTime` numbers. It does not decode and compare year/month/day components.

**Edge cases and quirks**

- For timed dates before 30 December 1899, Delphi stores the time as the magnitude of a negative fraction. Raw ordered comparisons then do not describe the intended calendar-day interval; even comparing a pre-epoch non-midnight value with itself can return `False`. Decode and compare date components or use a sign-aware timestamp strategy for historical dates.
- A `NaN` or otherwise non-finite value makes ordered comparisons non-useful rather than producing a meaningful date answer.
- Do not swap arguments when code relies on the interval semantics, especially near the epoch.

**Side effects**

None.

**Performance and concurrency**

Constant-time field decoding or comparison with no external I/O. The routine uses no shared mutable state.

**Related entries**

- [`IsToday`](IsToday.md) uses this function with the host's current local `Date`.
- [`DateOf`](DateOf.md) removes the encoded time component with DateUtils semantics.

**External references**

- [Embarcadero `System.DateUtils.IsSameDay`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.IsSameDay)
- [Free Pascal `IsSameDay`](https://www.freepascal.org/docs-html/rtl/dateutils/issameday.html)

<small>Created 2026-07-15</small>
