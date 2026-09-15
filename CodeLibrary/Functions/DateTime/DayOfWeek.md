---
title: "DayOfWeek"
description: "Returns the Delphi weekday number for a TDateTime value, with Sunday 1 and Saturday 7."
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - weekday
  - sunday-first
  - calendar
  - delphi
---

```Delphi
function DayOfWeek(const DateTime: TDateTime): Word;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DayOfWeek(EncodeDate(2026, 7, 19)); // 1: Sunday
end;
```

### Usage

`DayOfWeek` returns the Velox weekday number for a TDateTime value, with Sunday 1 and Saturday 7.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `DateTime` | `TDateTime`, `const` | Date/time whose calendar date is converted to a weekday. |

**Returns**

`1` Sunday, `2` Monday, `3` Tuesday, `4` Wednesday, `5` Thursday, `6` Friday or `7` Saturday.

**Behaviour**

The numbering is fixed by the function and does not follow a locale's configured first day of week. The time component is ignored.

**Errors**

Valid dates do not raise. The script binding adds no validation or exception handling.

### Additional Technical Info
`DayOfWeek` returns Delphi's traditional Sunday-first weekday number. Use it only when that convention is required; ISO-related DateUtils functions use a different Monday-first result.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The modified PascalScript runtime registers this entry directly to Delphi 37.0 `System.SysUtils.DayOfWeek`. The RTL converts the value to `TTimeStamp`, then calculates `TimeStamp.Date mod 7 + 1`. Only the date field participates.

**Edge cases and quirks**

- This function is **not ISO 8601**. [`DayOfTheWeek`](DayOfTheWeek.md) returns Monday `1` through Sunday `7` and should be used with ISO week functions.
- The return type in Velox is `Word`; Free Pascal documents `Integer`, but the ordinary values are the same `1..7` range.
- No timezone conversion occurs. The weekday comes from the date already encoded in the value.
- Unsupported raw values outside the Delphi timestamp domain have no validated result contract.

**Side effects**

None.

**Performance and concurrency**

Constant-time timestamp/modulo operation with no allocation or shared state.

**Related entries**

- [`DayOfTheWeek`](DayOfTheWeek.md) supplies Monday-first ISO numbering.
- [`DecodeDate`](DecodeDate.md) returns the calendar fields rather than weekday.

**External references**

- [Embarcadero `System.SysUtils.DayOfWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.DayOfWeek) - documents the exact Sunday-first Delphi routine.
- [Free Pascal `DayOfWeek`](https://www.freepascal.org/docs-html/rtl/sysutils/dayofweek.html) - documents the compatible Free Pascal convention and its differing return type.

<small>Created 2026-07-15</small>
