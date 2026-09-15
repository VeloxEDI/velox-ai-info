---
title: "IncYear"
description: "Moves a `TDateTime` by a signed number of calendar years through month arithmetic and end-of-month clamping."
sidebar_position: 65
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - calendar
  - years
---

```Delphi
Function IncYear(const AValue: TDateTime; const ANumberOfYears: Integer): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2024, 2, 29, 9, 30, 0, 0);
  Value := IncYear(InputValue, 1); // 28 February 2025 at 09:30
end;
```

### Usage

`IncYear` moves a `TDateTime` by a signed number of calendar years through month arithmetic and end-of-month clamping.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time to adjust. |
| `ANumberOfYears` | `Integer`, `const` | Signed number of calendar years to add. A negative value subtracts. |

**Returns**

A newly encoded `TDateTime` in the target month, with the encoded time of day preserved.

**Behaviour**

- Positive values move to later calendar years; negative values move earlier.
- Leap-day dates are clamped rather than rejected. For example, adding one year to 29 February produces 28 February when the destination year is not a leap year.
- The time-of-day fraction is preserved rather than converted through the millisecond timestamp chain.
- Velox requires both arguments.

**Errors**

Invalid encoded dates, integer overflow and target dates outside Velox's supported range can raise exceptions. Velox does not catch or translate them.

**Usage notes**

Choose `IncYear` when the rule is expressed in calendar years. Use fixed-duration routines only when a precise elapsed-hour or elapsed-day count is intended.

### Additional Technical Info
`IncYear` returns a new encoded date/time after adding a signed number of calendar years. Unlike the fixed-duration increment routines, it performs calendar rollover and clamps a day that does not exist in the target month.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to Delphi 37.0 `System.DateUtils.IncYear`. It multiplies the year count by 12 and delegates to DateUtils calendar-month arithmetic.

**Edge cases and quirks**

- Leap day plus or minus a non-leap number of years is clamped to 28 February in the target year.
- The multiplication by 12 uses integer arithmetic. Extreme year counts can overflow before calendar validation.
- This is calendar arithmetic on an untagged `TDateTime`; it does not apply timezone or daylight-saving rules.
- Delphi's negative/pre-epoch encoding is preserved through sign-aware time replacement, but raw fractional arithmetic on such values remains unsafe.
- A zero increment rebuilds the date and restores the encoded time. It should be logically unchanged, but callers should still avoid exact floating-point equality as a general date/time assertion.

**Side effects**

None.

**Performance and concurrency**

Constant-time calendar arithmetic with no external I/O or shared mutable state.

**Related entries**

- [`IncMonth`](IncMonth.md) performs the corresponding calendar adjustment.
- [`IncDay`](IncDay.md) adds fixed 24-hour periods rather than calendar months.

**External references**

- [Embarcadero `System.DateUtils.IncYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.IncYear)
- [Free Pascal `IncYear`](https://www.freepascal.org/docs-html/rtl/dateutils/incyear.html)

<small>Created 2026-07-15</small>
