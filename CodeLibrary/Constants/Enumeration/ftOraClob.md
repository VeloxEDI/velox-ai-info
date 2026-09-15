---
title: ftOraClob
description: Identifies a legacy Oracle character large object whose character set and streaming behavior remain provider-controlled.
sidebar_position: 116
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, oracle, clob, text, legacy]
---

```Delphi
ftOraClob = 31
```

### Example

```Delphi
function IsOracleCharacterLOB(Field: TField): Boolean;
begin
  Result := Field.DataType = ftOraClob;
end;
```

### Usage

`ftOraClob` identifies a legacy Oracle character large object whose character set and streaming behaviour remain provider-controlled.

### Additional Technical Info
`ftOraClob` is declaration ordinal 31 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It is the historic Delphi provider marker for an Oracle 8 character large object. A modern driver can expose the same database concept as a generic memo/wide-memo type, so do not make this exact enum a portability requirement.

The installed RTL maps it to `TMemoField` but treats it as base `ftBlob` for dataset compatibility. This is important: the logical value is character data, yet the concrete driver controls Oracle database character-set conversion, Unicode support and stream behavior. The enum itself does not distinguish CLOB from NCLOB or declare an on-wire encoding.

Prefer string access for bounded values and provider blob streams for large values. Verify source/destination character sets before migration; an ANSI memo path can lose characters even when the database column can represent them. Preserve Null independently from empty text, and define line-ending/normalisation rules at the integration boundary.

Oracle locator lifetime, transaction visibility and maximum-size behavior are driver/session contracts. Do not persist the ordinal as an Oracle type code or assume it remains valid after dataset movement or commit.

The example only inspects metadata and was source-reviewed; no Oracle connection, CLOB, encoding, stream, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TMemoField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TMemoField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TMemoField`](https://www.freepascal.org/docs-html/fcl/db/tmemofield.html) compatibility references; Oracle-provider parity is not implied.

<small>Created 2026-07-15</small>
