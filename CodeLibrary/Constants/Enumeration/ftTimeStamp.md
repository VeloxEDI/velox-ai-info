---
title: ftTimeStamp
description: Identifies a structured dbExpress-style SQL timestamp containing calendar and clock components but no timezone offset.
sidebar_position: 128
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, timestamp, sqltimestamp, dbexpress]
---

```Delphi
ftTimeStamp = 36
```

### Example

```Delphi
function IsSQLTimestamp(Field: TField): Boolean;
begin
  Result := Field.DataType = ftTimeStamp;
end;
```

### Usage

`ftTimeStamp` identifies a structured dbExpress-style SQL timestamp containing calendar and clock components but no timezone offset.

### Additional Technical Info
`ftTimeStamp` is declaration ordinal 36 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). Delphi maps it to `TSQLTimeStampField`, whose native value is a `TSQLTimeStamp` record with separate year, month, day, hour, minute, second and fractions components.

Current Delphi documentation and conversion source treat `Fractions` as milliseconds. The provider/database can have coarser or finer precision, so verify rounding when writing or moving timestamps. The structure carries no timezone or offset; calling it a timestamp does not establish UTC semantics.

`AsDateTime` converts the structure to Delphi's floating serial value, losing the structured custom-Variant type and potentially precision. A Null field returns the all-zero `NullSQLTimeStamp` through structured access and zero through `AsDateTime`; `AsVariant` preserves Null. Preserve the Null flag separately from any zero/sentinel representation.

String assignment calls Delphi's `StrToSQLTimeStamp` and can raise `EConvertError`; display formatting is locale-sensitive unless explicitly controlled. Use a defined wire format and explicit timezone policy. Choose [`ftTimeStampOffset`](ftTimeStampOffset.md) when the actual data contract retains an offset.

The example only inspects metadata and was source-reviewed; no timestamp conversion, clock, timezone, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType), [`TSQLTimeStampField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TSQLTimeStampField) and [`TSQLTimeStamp`](https://docwiki.embarcadero.com/Libraries/en/Data.SqlTimSt.TSQLTimeStamp).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference; structured timestamp behavior is not assumed identical.

<small>Created 2026-07-15</small>
