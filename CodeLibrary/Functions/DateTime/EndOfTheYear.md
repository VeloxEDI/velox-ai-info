---
title: "EndOfTheYear"
description: "Returns the final millisecond of the calendar year containing a supplied TDateTime value."
sidebar_position: 44
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - year
  - boundary
  - calendar
---

```Delphi
Function EndOfTheYear(const AValue: TDateTime): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EndOfTheYear(EncodeDate(2026, 7, 18)); // 31 December 2026, 23:59:59.999
end;
```

### Usage

`EndOfTheYear` returns the final millisecond of the calendar year containing a supplied TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Supported date/time whose calendar year is selected; its month, day and time are discarded. |

**Returns**

31 December in `AValue`'s calendar year at `23:59:59.999`.

**Important usage notes**

- This is a calendar-year boundary, not the end of the ISO week-numbering year.
- All original fields except the year are discarded.
- The final-millisecond output can be unsuitable as an inclusive boundary for stores with finer precision; an exclusive next-year start avoids that gap.
- The value has no inherent UTC/local interpretation.

**Errors**

Unsupported raw values can cause year decoding or subsequent encoding to fail. No function catches the exception.

### Additional Technical Info
`EndOfTheYear` extracts the calendar year from `AValue` and returns 31 December of that year at its final millisecond.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.EndOfTheYear`. The terminal obtains `YearOf(AValue)`, encodes 31 December for that year and delegates to `EndOfTheDay`.

**Side effects**

None.

**Performance and concurrency**

Constant-time calendar arithmetic with no shared state.

**Related entries**

- [`EndOfAYear`](EndOfAYear.md) accepts the calendar year explicitly.
- [`EndOfTheMonth`](EndOfTheMonth.md) returns a month boundary.

**External references**

- [Embarcadero `System.DateUtils.EndOfTheYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.EndOfTheYear)
- [Free Pascal `EndOfTheYear`](https://www.freepascal.org/docs-html/rtl/dateutils/endoftheyear.html)

<small>Created 2026-07-15</small>
