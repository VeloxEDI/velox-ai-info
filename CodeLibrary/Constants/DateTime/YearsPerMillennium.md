---
title: YearsPerMillennium
description: "Defines the exact unit ratio of 1,000 years per millennium without imposing numbering or date-range support."
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, years, millennium, calendar]
---

```Delphi
YearsPerMillennium = 1000
```

### Example

```Delphi
function MillenniaToYears(const Millennia: Integer): Int64;
begin
  Result := Int64(Millennia) * YearsPerMillennium;
end;
```

### Usage

`YearsPerMillennium` defines the exact unit ratio of 1,000 years per millennium without imposing numbering or date-range support.

### Additional Technical Info
`YearsPerMillennium` is registered from Delphi DateUtils as a signed `LongInt`. It is the exact ratio between the named units millennium and year.

The constant does not guarantee that adding the resulting year count stays inside Delphi `TDateTime`'s supported calendar range. Nor does it define millennium numbering: in conventional AD numbering without a year zero, the third millennium began in 2001, while colloquial digit-grouping may use 2000.

A millennium is not a fixed number of days or seconds because leap-year rules apply. Use calendar functions, validate the destination range and promote before scaling. The example is source-reviewed only; no calculation was executed.

**Related Code Library entries**

- [YearsPerCentury](YearsPerCentury.md) - 100-year unit ratio.
- [YearsPerDecade](YearsPerDecade.md) - ten-year unit ratio.

**External references**

- [Embarcadero System.DateUtils](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils) - declaring Delphi calendar unit.
- [Free Pascal YearsPerMillennium](https://www.freepascal.org/docs-html/rtl/dateutils/yearspermillennium.html) - compatible constant.

<small>Created 2026-07-15</small>
