---
title: "Get20thOfMonth"
description: "Replaces a TDateTime value's day with 20 in the same month while preserving its time of day."
sidebar_position: 46
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - day
  - recode
  - calendar
---

```Delphi
Function Get20thOfMonth(const aNow: TDateTime): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 31, 14, 30, 0, 0);
  Value := Get20thOfMonth(InputValue); // 20 July 2026, 14:30
end;
```

### Usage

`Get20thOfMonth` replaces a TDateTime value's day with 20 in the same month while preserving its time of day.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aNow` | `TDateTime`, `const` | Supported date/time whose day field is replaced. |

**Returns**

The 20th day of `aNow`'s calendar month with the original hour, minute, second and millisecond.

**Important usage notes**

- The function does not return midnight unless `aNow` was already at midnight.
- It can move backwards or forwards within the month depending on the original day.
- The recode path handles negative pre-epoch dates correctly; it does not perform unsafe raw fractional addition.
- No timezone conversion occurs.

**Errors**

Unsupported or non-finite raw values can fail while the recoder decodes and re-encodes the date. No Velox exception handler is present.

### Additional Technical Info
`Get20thOfMonth` is a Velox convenience wrapper that changes only the calendar day field to 20. The year, month and complete time-of-day fields remain unchanged.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The Velox date-tools implementation is exactly `RecodeDay(aNow, 20)`. Delphi's recoder decodes all fields, substitutes day 20 and re-encodes the complete value. Because every calendar month has a day 20, a valid input cannot fail because of the replacement day.

**Side effects**

None.

**Performance and concurrency**

Constant-time field decoding/encoding with no shared state.

**Related entries**

- [`Get20thOfNextMonth`](Get20thOfNextMonth.md) moves forward one month before selecting day 20.

**External references**

- [Embarcadero `System.DateUtils.RecodeDay`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.RecodeDay)
- [Free Pascal `RecodeDay`](https://www.freepascal.org/docs-html/rtl/dateutils/recodeday.html)

<small>Created 2026-07-15</small>
