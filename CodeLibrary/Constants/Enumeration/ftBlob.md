---
title: ftBlob
description: Identifies a generic binary large object whose bytes are normally accessed through a dataset-provided blob stream rather than the record buffer.
sidebar_position: 89
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, blob, binary, stream]
---

```Delphi
ftBlob = 15
```

### Example

```Delphi
function IsBinaryLargeObject(Field: TField): Boolean;
begin
  Result := Field.DataType = ftBlob;
end;
```

### Usage

`ftBlob` identifies a generic binary large object whose bytes are normally accessed through a dataset-provided blob stream rather than the record buffer.

### Additional Technical Info
`ftBlob` is declaration ordinal 15 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It is the provider-neutral marker for a binary large object (BLOB). The value describes field metadata; it does not identify a file format, character encoding, compression method or MIME type.

Delphi normally represents this member with `TBlobField`. Its data is not stored in the ordinary record buffer: the installed RTL reports a field `DataSize` of zero and asks the dataset to create a blob stream for reads and writes. Use the field or dataset's blob-stream operations for large values. Reading `AsBytes`, `AsVariant` or `AsString` materialises the complete value and therefore has memory proportional to the blob size.

Treat the bytes as opaque until the schema or producer supplies a format. `AsString` is especially unsafe for arbitrary binary content because the generic blob path decodes bytes through the host ANSI encoding. Empty and Null are distinct provider concepts, although modified zero-length blobs require dataset-specific handling. Stream lifetime, edit state, transaction scope, maximum LOB size and concurrent access are all controlled by the concrete dataset/provider.

The example only inspects metadata and was source-reviewed; no blob, stream, dataset, database, file, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType).
- [Embarcadero `TBlobField`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TBlobField).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) and [`TBlobField`](https://www.freepascal.org/docs-html/fcl/db/tblobfield.html) compatibility references.

<small>Created 2026-07-15</small>
