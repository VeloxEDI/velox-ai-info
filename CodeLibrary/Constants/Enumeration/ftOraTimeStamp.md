---
title: ftOraTimeStamp
description: Identifies a provider-specific Oracle timestamp mapped by Delphi to the structured TSQLTimeStamp field class.
sidebar_position: 118
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, oracle, timestamp, sqltimestamp]
---

```Delphi
ftOraTimeStamp = 40
```

### Example

```Delphi
function IsOracleTimestamp(Field: TField): Boolean;
begin
  Result := Field.DataType = ftOraTimeStamp;
end;
```

### Usage

`ftOraTimeStamp` identifies a provider-specific Oracle timestamp mapped by Velox to the structured TSQLTimeStamp field class.

### Additional Technical Info
`ftOraTimeStamp` is declaration ordinal 40 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It is the historic provider-specific marker for an Oracle timestamp.

The installed RTL maps it to `TSQLTimeStampField`, the same class used by [`ftTimeStamp`](ftTimeStamp.md), and treats both as base `ftTimeStamp` for compatibility. Its structured value contains year, month, day, hour, minute, second and a fractions field. Current Delphi conversion routines use millisecond fractions. The database/driver can support different precision and may round when crossing this boundary.

The member does not say whether the Oracle source column is a plain timestamp, a timestamp with local time zone, or a timestamp with time zone. In particular, `TSQLTimeStamp` itself contains no offset. Confirm the live column and provider mapping; otherwise timezone information can be normalised or lost before script code sees it.

`AsDateTime` converts to a timezone-free Delphi serial and can lose structure/precision. Prefer the structured field value/custom Variant when exact components matter. Text parsing and display depend on Delphi/provider formatting and should not be treated as a stable wire contract.

The example only inspects metadata and was source-reviewed; no Oracle connection, timestamp conversion, clock, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType), [`TSQLTimeStampField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TSQLTimeStampField) and [`TSQLTimeStamp`](https://docwiki.embarcadero.com/Libraries/en/Data.SqlTimSt.TSQLTimeStamp).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference; Oracle-provider parity is not implied.

<small>Created 2026-07-15</small>
