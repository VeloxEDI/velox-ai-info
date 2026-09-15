---
title: "StartOfAMonth"
description: "Constructs midnight on the first day of a supplied calendar year and month."
sidebar_position: 134
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - month
  - midnight
  - construction
---

```Delphi
Function StartOfAMonth( const AYear, AMonth : Word) : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StartOfAMonth(2026, 7); // 1 July 2026 00:00:00.000
end;
```

### Usage

`StartOfAMonth` constructs midnight on the first day of a supplied calendar year and month.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Gregorian calendar year from 1 through 9999. |
| `AMonth` | `Word`, `const` | Calendar month from 1 through 12. |

**Returns**

The encoded date `AYear-AMonth-01` at midnight.

**Behaviour**

- The result always has zero hour, minute, second and millisecond fields.
- Gregorian leap rules do not affect day one.
- No current clock, locale or timezone is consulted.
- The return is an untagged `TDateTime`.

**Errors**

Invalid year/month values propagate the SysUtils date-conversion exception.

**Usage notes**

Use `StartOfTheMonth` when the year and month should be decoded from an existing value.

### Additional Technical Info
`StartOfAMonth` constructs midnight on day one of a supplied calendar month and year.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import calls `System.DateUtils.StartOfAMonth`. The installed implementation is a direct `System.SysUtils.EncodeDate(AYear, AMonth, 1)` call.

**Edge cases and quirks**

- Year zero, years above 9999 and months outside 1 through 12 are rejected rather than normalised.
- The function constructs a specified month; it does not inspect or alter another date/time value.
- Free Pascal documents the same boundary operation; installed Delphi's encoder is the Velox terminal.

**Side effects**

None.

**Performance and concurrency**

Constant-time calendar validation and encoding with no shared state.

**Related entries**

- [`StartOfTheMonth`](StartOfTheMonth.md) derives the month from a value.
- [`StartOfADay`](StartOfADay.md) adds a supplied day offset to this boundary.

**External references**

- [Embarcadero `System.DateUtils.StartOfAMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.StartOfAMonth)
- [Free Pascal `StartOfAMonth`](https://www.freepascal.org/docs-html/rtl/dateutils/startofamonth.html)

<small>Created 2026-07-15</small>
