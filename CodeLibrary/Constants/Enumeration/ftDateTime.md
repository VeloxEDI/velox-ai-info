---
title: ftDateTime
description: Identifies a combined date and time represented through Delphi's timezone-free floating TDateTime serial value.
sidebar_position: 98
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, datetime, tdatetime, timezone]
---

```Delphi
ftDateTime = 11
```

### Example

```Delphi
function IsDelphiDateTime(Field: TField): Boolean;
begin
  Result := Field.DataType = ftDateTime;
end;
```

### Usage

`ftDateTime` identifies a combined date and time represented through Velox's timezone-free floating TDateTime serial value.

### Additional Technical Info
`ftDateTime` is declaration ordinal 11 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). Delphi maps it to `TDateTimeField`, whose value is an eight-byte `TDateTime`/Double serial: the integral part represents days around the Delphi epoch and the fraction represents time of day.

The value contains no timezone or UTC-offset flag. Whether it represents UTC, server local time, company local time or a timezone-free wall-clock value is an application/schema contract. Never perform timezone conversion solely because this enum is present. Record the interpretation separately and use explicit UTC/offset types at system boundaries.

Binary floating representation limits exact fractional precision. Database/provider precision can be lower and may round fractional seconds. Text assignment uses locale-sensitive `StrToDateTime`; an empty string clears the field. `AsDateTime` returns zero for Null, so use `IsNull` or `AsVariant` when the difference between Null and `1899-12-30 00:00:00` matters.

For higher-structure SQL values use [`ftTimeStamp`](ftTimeStamp.md); to retain an explicit offset use [`ftTimeStampOffset`](ftTimeStampOffset.md). Define an unambiguous output format rather than exporting field display text.

The example only inspects metadata and was source-reviewed; no clock, timezone, parsing, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType), [`TDateTimeField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TDateTimeField) and [`TDateTime`](https://docwiki.embarcadero.com/Libraries/en/System.TDateTime).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TDateTimeField`](https://www.freepascal.org/docs-html/fcl/db/tdatetimefield.html) compatibility references.

<small>Created 2026-07-15</small>
