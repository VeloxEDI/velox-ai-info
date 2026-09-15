---
title: "Get20thOfNextMonth"
description: "Moves a TDateTime one calendar month forward, selects day 20 and preserves its time of day."
sidebar_position: 47
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - month
  - day
  - recode
---

```Delphi
Function Get20thOfNextMonth(const aNow: TDateTime): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 12, 31, 9, 15, 0, 0);
  Value := Get20thOfNextMonth(InputValue); // 20 January 2027, 09:15
end;
```

### Usage

`Get20thOfNextMonth` moves a TDateTime one calendar month forward, selects day 20 and preserves its time of day.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aNow` | `TDateTime`, `const` | Supported starting date/time. |

**Returns**

Day 20 of the following calendar month, with `aNow`'s original hour, minute, second and millisecond.

**Important usage notes**

- An input on 29, 30 or 31 can be clamped by `IncMonth`, but the final day is still 20. The clamp therefore does not change the documented final day.
- December advances into January of the next calendar year.
- Time fields, including milliseconds, are preserved through both helpers.
- The operation is calendar-based, not a fixed number of elapsed days.
- Neither helper applies timezone or daylight-saving conversion.

**Errors**

An unsupported input or a month increment beyond Velox's supported date range can raise a conversion exception. Velox does not catch it.

### Additional Technical Info
`Get20thOfNextMonth` is a Velox convenience wrapper that advances one calendar month, then replaces the resulting day with 20. It preserves the complete time of day and crosses year boundaries normally.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The Velox date-tools implementation first calls Delphi `IncMonth(aNow, 1)`, stores that intermediate result, then calls `RecodeDay(..., 20)`. `IncMonth` adjusts the year and clamps an original end-of-month day when the next month is shorter; the subsequent recode always replaces that intermediate day with 20.

**Side effects**

None.

**Performance and concurrency**

Constant bounded calendar arithmetic with no shared state.

**Related entries**

- [`Get20thOfMonth`](Get20thOfMonth.md) keeps the current month.

**External references**

- [Embarcadero `System.SysUtils.IncMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IncMonth)
- [Free Pascal `IncMonth`](https://www.freepascal.org/docs-html/rtl/sysutils/incmonth.html)
- [Embarcadero `System.DateUtils.RecodeDay`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.RecodeDay)
- [Free Pascal `RecodeDay`](https://www.freepascal.org/docs-html/rtl/dateutils/recodeday.html)

<small>Created 2026-07-15</small>
