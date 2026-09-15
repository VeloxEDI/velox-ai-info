---
title: "EndOfTheDay"
description: "Replaces an existing TDateTime value's time with the final millisecond of the same calendar day."
sidebar_position: 41
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - day
  - boundary
  - recode
---

```Delphi
Function EndOfTheDay(const AValue: TDateTime): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 9, 15, 0, 0);
  Value := EndOfTheDay(InputValue); // 2026-07-18 23:59:59.999
end;
```

### Usage

`EndOfTheDay` replaces an existing TDateTime value's time with the final millisecond of the same calendar day.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Any supported encoded date/time; its original time is discarded. |

**Returns**

The same calendar day at `23:59:59.999`.

**Errors**

Unsupported or non-finite raw values can fail during decode/re-encode. No function catches the error.

### Additional Technical Info
`EndOfTheDay` keeps the calendar date encoded in `AValue` and replaces its clock fields with `23:59:59.999`.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.EndOfTheDay`. The terminal calls `RecodeTime(AValue, 23, 59, 59, 999)`. Recode logic decodes all fields, replaces only the four time fields and re-encodes them with correct handling for negative pre-epoch dates.

**Edge cases and quirks**

- The operation is a field replacement, not `Trunc(AValue) + 0.999...`; this distinction preserves Delphi's negative-date convention.
- The result is inclusive to the last millisecond only. External systems can have finer timestamp precision.
- No daylight-saving rule is consulted. A local wall-clock day that lasts 23 or 25 elapsed hours still ends at the same encoded clock fields.
- The function discards the original time even when it is already later than a business cut-off.

**Side effects**

None.

**Performance and concurrency**

Constant bounded field decoding and encoding with no shared state.

**Related entries**

- [`EndOfADay`](EndOfADay.md) accepts separate calendar fields.
- [`EndOfTheMonth`](EndOfTheMonth.md) also moves to the month's final date.

**External references**

- [Embarcadero `System.DateUtils.EndOfTheDay`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.EndOfTheDay)
- [Free Pascal `EndOfTheDay`](https://www.freepascal.org/docs-html/rtl/dateutils/endoftheday.html)

<small>Created 2026-07-15</small>
