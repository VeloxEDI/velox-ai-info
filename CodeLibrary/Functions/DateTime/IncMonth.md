---
title: "IncMonth"
description: "Moves a `TDateTime` by a signed number of calendar months, clamping the day when necessary and preserving its time."
sidebar_position: 62
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - calendar
  - months
---

```Delphi
Function IncMonth(const DateTime: TDateTime; NumberOfMonths: Integer): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2025, 1, 31, 9, 30, 0, 0);
  Value := IncMonth(InputValue, 1); // 28 February 2025 at 09:30
end;
```

### Usage

`IncMonth` moves a `TDateTime` by a signed number of calendar months, clamping the day when necessary and preserving its time.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `DateTime` | `TDateTime`, `const` | Encoded date/time to adjust. |
| `NumberOfMonths` | `Integer` | Signed number of calendar months to add. A negative value subtracts. It is passed by value and is not modified in the caller. |

**Returns**

A newly encoded `TDateTime` in the target month, with the encoded time of day preserved.

**Behaviour**

- Positive values move to later calendar months; negative values move earlier.
- Month-end dates are clamped rather than rejected. For example, 31 January plus one month becomes the last valid day of February.
- The time-of-day fraction is preserved rather than converted through the millisecond timestamp chain.
- Velox requires both arguments.

**Errors**

Invalid encoded dates, integer overflow and target dates outside Velox's supported range can raise exceptions. Velox does not catch or translate them.

**Usage notes**

Choose `IncMonth` when the rule is expressed in calendar months. Use fixed-duration routines only when a precise elapsed-hour or elapsed-day count is intended.

### Additional Technical Info
`IncMonth` returns a new encoded date/time after adding a signed number of calendar months. Unlike the fixed-duration increment routines, it performs calendar rollover and clamps a day that does not exist in the target month.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

Velox's SysUtils import registers its `SysUtilsImport.IncMonth` wrapper. The wrapper delegates to Delphi `System.SysUtils.IncMonth`, which decodes the date, applies calendar-month rollover, clamps the day to the target month's last valid day, re-encodes the date and restores the encoded time part.

**Edge cases and quirks**

- Repeated monthly application is not reversible at month end: after 31 January becomes 28 February, adding another month operates from day 28 rather than restoring day 31.
- Large positive or negative counts can exceed the supported year range even when the initial value is valid.
- This is calendar arithmetic on an untagged `TDateTime`; it does not apply timezone or daylight-saving rules.
- Delphi's negative/pre-epoch encoding is preserved through sign-aware time replacement, but raw fractional arithmetic on such values remains unsafe.
- A zero increment rebuilds the date and restores the encoded time. It should be logically unchanged, but callers should still avoid exact floating-point equality as a general date/time assertion.

**Side effects**

None.

**Performance and concurrency**

Constant-time calendar arithmetic with no external I/O or shared mutable state.

**Related entries**

- [`IncYear`](IncYear.md) performs the corresponding calendar adjustment.
- [`IncDay`](IncDay.md) adds fixed 24-hour periods rather than calendar months.

**External references**

- [Embarcadero `System.SysUtils.IncMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IncMonth)
- [Free Pascal `IncMonth`](https://www.freepascal.org/docs-html/rtl/sysutils/incmonth.html)

<small>Created 2026-07-15</small>
