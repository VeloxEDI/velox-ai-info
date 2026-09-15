---
title: ftBytes
description: Identifies a fixed-length inline byte sequence whose declared Size participates in field compatibility and buffer allocation.
sidebar_position: 92
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, bytes, binary, fixed-length]
---

```Delphi
ftBytes = 12
```

### Example

```Delphi
function IsFixedBinary(Field: TField): Boolean;
begin
  Result := Field.DataType = ftBytes;
end;
```

### Usage

`ftBytes` identifies a fixed-length inline byte sequence whose declared Size participates in field compatibility and buffer allocation.

### Additional Technical Info
`ftBytes` is declaration ordinal 12 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It identifies fixed-length binary data stored through a normal field buffer, not a streamed BLOB.

The installed RTL maps it to `TBytesField`. `DataSize` equals the field's declared `Size`; a newly constructed field defaults to 16 bytes, but persistent or provider-created fields obtain their effective size from metadata. Dataset compatibility checks require both the binary family and exact size to match. Never assume the constructor default describes an actual database column.

This member carries no encoding or structure. It can hold hashes, protocol identifiers or application-defined packed bytes only when the surrounding schema says so. Do not decode it as text, GUID or number merely because its length happens to fit. When copying to a different field or system, define how shorter values are padded and whether longer values are rejected or truncated; provider behavior can differ.

Null remains separate from a sequence containing zero bytes, and a zero-filled sequence is different from an empty value. Prefer explicit byte-array access and preserve exact length. Use [`ftVarBytes`](ftVarBytes.md) when the logical length varies, or [`ftBlob`](ftBlob.md) for large/streamed binary content.

The example only inspects metadata and was source-reviewed; no binary conversion, dataset, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TBytesField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TBytesField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TBytesField`](https://www.freepascal.org/docs-html/fcl/db/tbytesfield.html) compatibility references.

<small>Created 2026-07-15</small>
