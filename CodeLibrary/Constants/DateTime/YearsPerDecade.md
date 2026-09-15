---
title: YearsPerDecade
description: "Defines the exact unit ratio of 10 years per decade without choosing a reporting boundary."
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, years, decade, calendar]
---

```Delphi
YearsPerDecade = 10
```

### Example

```Delphi
function DecadesToYears(const Decades: Integer): Int64;
begin
  Result := Int64(Decades) * YearsPerDecade;
end;
```

### Usage

`YearsPerDecade` defines the exact unit ratio of 10 years per decade without choosing a reporting boundary.

### Additional Technical Info
`YearsPerDecade` is registered from Delphi DateUtils as a signed `LongInt`. It is the exact ratio between the units decade and year.

The value does not select whether a named decade means digit grouping such as 2020..2029 or ordinal grouping such as 2021..2030. It also does not account for variable leap-day counts or define a fixed duration in days/seconds.

Use calendar-year arithmetic for actual dates and define the boundary convention for grouping/reporting. Promote before multiplying large/untrusted counts. The example is source-reviewed only; no date was calculated.

**Related Code Library entries**

- [YearsPerCentury](YearsPerCentury.md) - 100-year unit ratio.
- [YearsPerMillennium](YearsPerMillennium.md) - 1,000-year unit ratio.

**External references**

- [Embarcadero System.DateUtils](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils) - declaring Delphi calendar unit.
- [Free Pascal YearsPerDecade](https://www.freepascal.org/docs-html/rtl/dateutils/yearsperdecade.html) - compatible constant.

<small>Created 2026-07-15</small>
