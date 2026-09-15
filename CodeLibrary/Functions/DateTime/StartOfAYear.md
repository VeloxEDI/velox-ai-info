---
title: "StartOfAYear"
description: "Constructs midnight on 1 January of a supplied calendar year."
sidebar_position: 136
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - year
  - midnight
  - construction
---

```Delphi
Function StartOfAYear( const AYear : Word) : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StartOfAYear(2026); // 1 January 2026 00:00:00.000
end;
```

### Usage

`StartOfAYear` constructs midnight on 1 January of a supplied calendar year.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Calendar year from 1 through 9999. |

**Returns**

The encoded date 1 January of `AYear` at midnight.

**Behaviour**

- The result is the calendar-year boundary, not an ISO week-year boundary.
- All time fields are zero.
- No clock, locale or timezone information is consulted.

**Errors**

Invalid years propagate the SysUtils conversion exception.

**Usage notes**

Use `StartOfTheYear` when the year comes from an existing date/time value.

### Additional Technical Info
`StartOfAYear` constructs midnight on the first day of a supplied Gregorian calendar year.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to `System.DateUtils.StartOfAYear`. The installed implementation calls `System.SysUtils.EncodeDate(AYear, 1, 1)`.

**Edge cases and quirks**

- Year zero and years above 9999 are invalid.
- The returned value is an untagged proleptic-Gregorian `TDateTime`.
- Free Pascal documents the same concept; installed Delphi's range and encoder govern Velox.

**Side effects**

None.

**Performance and concurrency**

Constant-time encoding with no I/O or global state.

**Related entries**

- [`StartOfTheYear`](StartOfTheYear.md) derives the year.
- [`EndOfAYear`](EndOfAYear.md) returns the final millisecond of a supplied year.

**External references**

- [Embarcadero `System.DateUtils.StartOfAYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.StartOfAYear)
- [Free Pascal `StartOfAYear`](https://www.freepascal.org/docs-html/rtl/dateutils/startofayear.html)

<small>Created 2026-07-15</small>
