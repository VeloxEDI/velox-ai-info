---
title: "DaysBetween"
description: "Returns the absolute number of complete 24-hour periods between two TDateTime values."
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - duration
  - days
  - milliseconds
  - delphi
---

```Delphi
Function DaysBetween(const ANow, AThen: TDateTime): Integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDate(2026, 7, 18) + EncodeTime(12, 0, 0, 0);
  SecondValue := EncodeDate(2026, 7, 20) + EncodeTime(11, 59, 59, 999);
  Value := DaysBetween(FirstValue, SecondValue); // 1 complete day
end;
```

### Usage

`DaysBetween` returns the absolute number of complete 24-hour periods between two TDateTime values.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime`, `const` | First encoded date/time. The name does not require the actual current time. |
| `AThen` | `TDateTime`, `const` | Second encoded date/time. Argument order does not affect the magnitude returned. |

**Returns**

The absolute integer number of complete 86,400,000-millisecond periods between the arguments. Equal values and all differences shorter than one day return `0`.

**Behaviour**

The result is symmetric and non-negative. It measures duration, not the number of calendar boundaries crossed: `23:59` on one day to `00:01` on the next is only two minutes and returns `0`.

**Errors**

No ordinary error for valid values. Timestamp/numeric failures from unsupported raw values propagate; there is no function handler.

**Usage notes**

Use [`DaySpan`](DaySpan.md) when the fractional remainder matters. To count calendar dates rather than elapsed time, compare `DateOf` values under an explicitly chosen timezone convention.

### Additional Technical Info
`DaysBetween` measures the absolute elapsed difference between two encoded date/time values and returns only the number of complete 24-hour units. Any remainder shorter than a day is discarded.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.DaysBetween`. The routine converts each value to an integer millisecond count, subtracts them, applies `Abs`, then performs integer division by `CMillisPerDay`.

**Edge cases and quirks**

- The discarded remainder is based on absolute elapsed milliseconds. A difference of one day minus one millisecond returns `0`; exactly one day returns `1`.
- The calculation is timezone- and daylight-saving-naive. If local wall-clock values span a DST change, the numeric difference still uses encoded 24-hour days unless the caller has converted them to an absolute timeline.
- Conversion to milliseconds defines the effective precision; sub-millisecond `Double` differences do not affect the result.
- Extremely distant unsupported numeric values can overflow timestamp arithmetic or absolute subtraction. Ordinary Delphi dates are safely within the practical integer result range.
- Free Pascal documents the same whole-day contract, but Velox uses Delphi's millisecond terminal.

**Side effects**

None.

**Performance and concurrency**

Constant-time timestamp arithmetic with no allocation or shared state.

**Related entries**

- [`DaySpan`](DaySpan.md) preserves fractional days.
- [`CompareDate`](CompareDate.md) compares calendar dates while ignoring time.

**External references**

- [Embarcadero `System.DateUtils.DaysBetween`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DaysBetween) - documents the exact Delphi whole-day routine.
- [Free Pascal `DaysBetween`](https://www.freepascal.org/docs-html/rtl/dateutils/daysbetween.html) - documents the compatible complete-day semantics.

<small>Created 2026-07-15</small>
