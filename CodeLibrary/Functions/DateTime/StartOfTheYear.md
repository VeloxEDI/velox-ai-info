---
title: "StartOfTheYear"
description: "Returns midnight on 1 January of the supplied value's encoded calendar year."
sidebar_position: 140
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - year
  - midnight
  - boundary
---

```Delphi
Function StartOfTheYear( const AValue : TDateTime) : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 16, 14, 30, 5, 125);
  Value := StartOfTheYear(InputValue); // 1 January 2026 00:00:00.000
end;
```

### Usage

`StartOfTheYear` returns midnight on 1 January of the supplied value's encoded calendar year.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Value that supplies the calendar year. |

**Returns**

An encoded `TDateTime` for 1 January of the decoded year at midnight.

**Behaviour**

- Month, day and all time fields from the input are discarded.
- The boundary belongs to the calendar year, not necessarily the ISO week-year.
- Valid pre-epoch dates are decoded using Velox's normal date rules.
- No current-clock or timezone state is involved.

**Errors**

Decode/encode exceptions propagate unchanged.

**Usage notes**

Use `StartOfAYear` when the desired calendar year is a separate number.

### Additional Technical Info
`StartOfTheYear` returns midnight on 1 January of the calendar year encoded by `AValue`.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import calls `System.DateUtils.StartOfTheYear`. The installed implementation obtains `YearOf(AValue)` through date decoding and passes that year to `EncodeDate(year, 1, 1)`.

**Edge cases and quirks**

- An early-January date may belong to the previous ISO week-year, but this routine still returns 1 January of its calendar year.
- Invalid raw input can raise while decoding.
- Free Pascal documents the same calendar boundary; the installed Delphi path defines Velox behaviour.

**Side effects**

None.

**Performance and concurrency**

Constant-time date decoding and encoding with no shared mutable state.

**Related entries**

- [`StartOfAYear`](StartOfAYear.md) constructs a supplied year.
- [`EndOfTheYear`](EndOfTheYear.md) returns the final encoded millisecond.

**External references**

- [Embarcadero `System.DateUtils.StartOfTheYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.StartOfTheYear)
- [Free Pascal `StartOfTheYear`](https://www.freepascal.org/docs-html/rtl/dateutils/startoftheyear.html)

<small>Created 2026-07-15</small>
