---
title: "HoursBetween"
description: "Returns the absolute number of complete millisecond-encoded hours between two TDateTime values."
sidebar_position: 56
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - hours
  - interval
  - truncation
---

```Delphi
Function HoursBetween(const ANow, AThen: TDateTime): Int64
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDateTime(2026, 7, 18, 9, 0, 0, 0);
  SecondValue := EncodeDateTime(2026, 7, 18, 11, 59, 59, 999);
  Value := HoursBetween(FirstValue, SecondValue); // 2
end;
```

### Usage

`HoursBetween` returns the absolute number of complete millisecond-encoded hours between two TDateTime values.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime`, `const` | First encoded timestamp. Argument order does not affect the result. |
| `AThen` | `TDateTime`, `const` | Second encoded timestamp. |

**Returns**

The absolute millisecond difference divided by 3,600,000 using integer division. Equal values and differences shorter than one complete hour return `0`.

**Errors**

Unsupported or non-finite raw values can fail during timestamp conversion. No function catches the exception.

### Additional Technical Info
`HoursBetween` returns the absolute count of whole hours between two encoded timestamps. Partial hours are discarded rather than rounded.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.HoursBetween`. Each input is converted with `DateTimeToTimeStamp` to a chronological integer millisecond count. The terminal subtracts those counts, takes the absolute value and divides by milliseconds per hour.

**Edge cases and quirks**

- The result loses direction; swapping inputs has no effect.
- Partial hours are truncated. A difference of `2:59:59.999` returns `2`, not `3`.
- Conversion is millisecond-resolution, so sub-millisecond differences are not represented.
- Unlike `HourSpan`, the timestamp conversion handles Delphi's negative pre-epoch time convention before subtraction, so valid historical timestamps are compared chronologically at millisecond resolution.
- The calculation is timezone-neutral and does not apply daylight-saving transitions. Encoded local clock values must be converted to an appropriate common timescale first when elapsed real time matters.

**Side effects**

None.

**Performance and concurrency**

Constant-time integer arithmetic with no allocation or shared state.

**Related entries**

- [`HourSpan`](HourSpan.md) returns a fractional raw numeric span but has different pre-epoch behaviour.
- [`DaysBetween`](DaysBetween.md) performs the equivalent whole-day calculation.

**External references**

- [Embarcadero `System.DateUtils.HoursBetween`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.HoursBetween)
- [Free Pascal `HoursBetween`](https://www.freepascal.org/docs-html/rtl/dateutils/hoursbetween.html)

<small>Created 2026-07-15</small>
