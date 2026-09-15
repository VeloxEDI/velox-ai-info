---
title: YearsPerCentury
description: "Defines the exact unit ratio of 100 years per century without imposing century numbering or boundary conventions."
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, years, century, calendar]
---

```Delphi
YearsPerCentury = 100
```

### Example

```Delphi
function CenturiesToYears(const Centuries: Integer): Int64;
begin
  Result := Int64(Centuries) * YearsPerCentury;
end;
```

### Usage

`YearsPerCentury` defines the exact unit ratio of 100 years per century without imposing century numbering or boundary conventions.

### Additional Technical Info
`YearsPerCentury` is registered from Delphi DateUtils as a signed `LongInt`. It is the exact ratio between the named units century and year.

The constant does not determine a civil century number or its first/last year. In the conventional proleptic Gregorian/AD numbering without a year zero, the first century is years 1..100 and the twenty-first is 2001..2100. Some reporting systems instead group labels by their leading digits; document that business convention explicitly.

It is not a fixed day count because centuries contain different numbers of leap years under Gregorian rules. Use calendar functions for dates and promote before scaling large counts. The example is source-reviewed only.

**Related Code Library entries**

- [YearsPerDecade](YearsPerDecade.md) - ten-year unit ratio.
- [YearsPerMillennium](YearsPerMillennium.md) - thousand-year unit ratio.

**External references**

- [Embarcadero System.DateUtils](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils) - declaring Delphi calendar unit.
- [Free Pascal YearsPerCentury](https://www.freepascal.org/docs-html/rtl/dateutils/yearspercentury.html) - compatible constant.

<small>Created 2026-07-15</small>
