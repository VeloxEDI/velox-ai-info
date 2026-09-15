---
title: WeeksPerFortnight
description: "Defines the exact two-week size of a fortnight without choosing a calendar anchor or year-boundary policy."
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, weeks, fortnight, calendar]
---

```Delphi
WeeksPerFortnight = 2
```

### Example

```Delphi
procedure AddFortnights(const StartDate: TDateTime; Count: Integer;
  var FinishDate: TDateTime);
begin
  FinishDate := IncWeek(StartDate, Count * WeeksPerFortnight);
end;
```

### Usage

`WeeksPerFortnight` defines the exact two-week size of a fortnight without choosing a calendar anchor or year-boundary policy.

### Additional Technical Info
`WeeksPerFortnight` is registered from Delphi DateUtils as a signed `LongInt`. A fortnight is exactly two seven-day weeks, or 14 nominal calendar days.

The constant does not define when a reporting fortnight starts, how partial periods are numbered, or whether an annual series resets at a calendar, fiscal or ISO week-year boundary. Store or configure that anchor separately.

For civil dates, use `IncWeek`/`IncDay` rather than assuming a fixed number of elapsed seconds across timezone offset changes. Validate large counts before multiplying. The example is source-reviewed only; no date arithmetic was executed.

**Related Code Library entries**

- [DaysPerWeek](DaysPerWeek.md) - exact seven-day week size.
- [FortnightPerYear](FortnightPerYear.md) - approximate annual count and its remainder.

**External references**

- [Embarcadero System.DateUtils](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils) - declaring Delphi unit.
- [Free Pascal WeeksPerFortnight](https://www.freepascal.org/docs-html/rtl/dateutils/weeksperfortnight.html) - compatible constant.

<small>Created 2026-07-15</small>
