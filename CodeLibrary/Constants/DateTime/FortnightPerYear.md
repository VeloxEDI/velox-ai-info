---
title: FortnightPerYear
description: "Defines a legacy 26-fortnight approximation for a year rather than an exact calendar or elapsed-time conversion."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, fortnight, year, approximation]
---

```Delphi
FortnightPerYear = 26
```

### Example

```Delphi
function ApproximateFortnightIndex(const WeekNumber: Integer): Integer;
begin
  Result := (WeekNumber - 1) div WeeksPerFortnight + 1;
end;
```

### Usage

`FortnightPerYear` defines a legacy 26-fortnight approximation for a year rather than an exact calendar or elapsed-time conversion.

### Additional Technical Info
The Velox DateUtils importer registers `FortnightPerYear` as a signed `LongInt` literal. It represents `52 div 2`, not the exact duration or complete period count of a civil/ISO year. The singular identifier is the published API spelling.

Twenty-six fortnights contain 364 days. A civil year contains 365 or 366, leaving one or two days outside that simple partition. An ISO week-numbering year can contain 53 weeks, so it can intersect a 27th two-week bucket depending on the chosen anchor and business rule.

The current installed Delphi DateUtils source retains `WeeksPerFortnight=2` but no longer declares this approximate `FortnightPerYear` name; Velox continues to expose the explicitly registered literal. Do not infer that all current Delphi routines use it.

Define the anchor date, partial-period handling and year/week convention before using fortnight numbers for reporting, billing or file routing. The example uses an ordinary 1-based week number only as an approximation and was not executed.

**Related Code Library entries**

- [WeeksPerFortnight](WeeksPerFortnight.md) - exact two-week ratio.
- [WeeksPerYear](WeeksPerYear.md) - related 52-week approximation.

**External references**

- [Embarcadero System.DateUtils](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils) - current Delphi calendar API; exact Velox legacy registration is described above.
- [Free Pascal DateUtils](https://www.freepascal.org/docs-html/rtl/dateutils/index.html) - compatible calendar context.

<small>Created 2026-07-15</small>
