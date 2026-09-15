---
title: ftDate
description: Identifies date-only field metadata that Delphi exposes through TDateField and the common TDateTime conversion surface.
sidebar_position: 97
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, date, tdatetime]
---

```Delphi
ftDate = 9
```

### Example

```Delphi
function IsDateOnly(Field: TField): Boolean;
begin
  Result := Field.DataType = ftDate;
end;
```

### Usage

`ftDate` identifies date-only field metadata that Velox exposes through TDateField and the common TDateTime conversion surface.

### Additional Technical Info
`ftDate` is declaration ordinal 9 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It requests date-only semantics. Delphi maps it to `TDateField`, a `TDateTimeField` descendant with a four-byte provider data size, while script access normally uses a Delphi `TDateTime` value.

The field/provider is responsible for converting its native date buffer to the public serial value. A `TDateTime` can also contain a time fraction, but that does not make the database column time-capable; verify whether assignment truncates, rounds or rejects a non-zero time for the active provider. Null is independent of the Delphi epoch value: `AsDateTime` returns `0` when the field is Null, whereas `AsVariant` preserves Null.

Text assignment uses `StrToDate` with current host `FormatSettings`; display uses the short-date format unless an explicit display format applies. These locale-dependent strings are not stable integration formats. For wire data, use an explicit unambiguous format and validate calendar/date range against the destination.

This member carries no timezone. Treat a business date such as an invoice date as a calendar value, not an instant to convert between UTC and local time.

The example only inspects metadata and was source-reviewed; no clock, calendar, parsing, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType), [`TDateField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TDateField) and [`TDateTime`](https://docwiki.embarcadero.com/Libraries/en/System.TDateTime).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TDateField`](https://www.freepascal.org/docs-html/fcl/db/tdatefield.html) compatibility references.

<small>Created 2026-07-15</small>
