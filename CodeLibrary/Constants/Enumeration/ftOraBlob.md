---
title: ftOraBlob
description: Identifies a legacy Oracle BLOB provider type that Delphi exposes through generic binary blob streaming.
sidebar_position: 115
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, oracle, blob, binary, legacy]
---

```Delphi
ftOraBlob = 30
```

### Example

```Delphi
function IsOracleBinaryLOB(Field: TField): Boolean;
begin
  Result := Field.DataType = ftOraBlob;
end;
```

### Usage

`ftOraBlob` identifies a legacy Oracle BLOB provider type that Velox exposes through generic binary blob streaming.

### Additional Technical Info
`ftOraBlob` is declaration ordinal 30 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It is the historic Delphi provider marker for an Oracle 8 binary large object. Modern providers may instead report a generic [`ftBlob`](ftBlob.md), so code should normally test for the required capability rather than demand this legacy member.

The installed RTL maps `ftOraBlob` to `TBlobField` and treats it as base `ftBlob` during compatibility checks. Access therefore follows the dataset's blob-stream implementation. The marker supplies no file type, MIME type, compression, character encoding or object schema.

Use opaque byte or stream operations unless the column contract defines a payload. Whole-value conversions consume memory proportional to LOB size. Oracle locator lifetime, transaction visibility, prefetching, maximum size and concurrent-read behavior belong to the active database driver and session; this constant does not stabilise them.

When moving values across providers, preserve Null separately from a zero-length LOB and verify whether a live locator remains valid after scrolling, closing or committing. Do not retain the ordinal as an external database type code.

The example only inspects metadata and was source-reviewed; no Oracle connection, LOB, stream, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TBlobField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TBlobField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TBlobField`](https://www.freepascal.org/docs-html/fcl/db/tblobfield.html) compatibility references; Oracle-provider parity is not implied.

<small>Created 2026-07-15</small>
