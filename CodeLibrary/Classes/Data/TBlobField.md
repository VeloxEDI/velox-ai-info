---
title: TBlobField
description: Represents the current record's binary large-object field and provides byte-preserving file and stream transfers.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, data, blob, field, stream]
---

```Delphi
TBlobField = class(TField)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Blob: TBlobField;
  Buffer: TMemoryStream;
begin
  // DATA_Self must already contain a BLOB field named Payload.
  Blob := TBlobField(DATA_Self.FieldByName('Payload'));
  Buffer := TMemoryStream.Create;
  try
    Blob.SaveToStream(Buffer);
    Value := Buffer.Size;
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`TBlobField` represents the current record's binary large-object field and provides byte-preserving file and stream transfers.

**Behaviour**

The field object is owned by its dataset and refers to that dataset's current record. Save operations read the current record. Load operations replace the current record's BLOB buffer but do not call `Post`, apply updates or commit a database transaction.

Use `LoadFromStream` and `SaveToStream` for binary content. Do not use the script-visible `Value: string` property: it can truncate writes and return invalid text.

**Usage notes**

Do not free a `TBlobField` obtained from a dataset. Keep any cast and transfer close to the point where the dataset position is known, and perform the normal dataset post/apply/transaction sequence after a successful load when persistence is required.

### Additional Technical Info
`TBlobField` represents binary large-object (BLOB) data for the current record of an owning dataset. Its four script-visible methods copy the complete BLOB to or from files and streams without interpreting the bytes.

The example reads a fictional field into a script-owned memory stream and reports its byte count. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox registers the Delphi `Data.DB.TBlobField` class as a descendant of `TField`. Scripts normally obtain an instance from an active dataset's `FieldByName` or `Fields` collection. No constructor is registered for scripts.

Every transfer asks the owning dataset to create a BLOB stream for this field. The dataset implementation therefore controls edit-state checks, buffering, null handling and when modified bytes enter its record buffer. The common `TvxClientDataSet` path loads a BLOB into memory, requires edit/insert/new-value state for writes and applies the modified buffer when its internal BLOB stream is freed.

**Edge cases and quirks**

- Null and zero-length non-null BLOBs are not represented consistently by every dataset implementation. The common client-dataset write stream needs a write event to distinguish them.
- Moving the dataset changes which record the same field object addresses. Closing, rebuilding or freeing the dataset invalidates the borrowed field reference.
- A field returned as `TField` must actually be a BLOB-compatible runtime class before casting it to `TBlobField`.
- Memo, wide-memo, graphic and typed-binary descendants can attach different meaning to the bytes, but the four transfer methods themselves do not encode or decode them.

**Performance and concurrency**

The transfers are synchronous and proportional to BLOB size. The common client-dataset BLOB stream materialises the complete value in memory in addition to the copy buffer or caller stream. Do not navigate, edit or transfer the same dataset concurrently.

**External references**

- [Embarcadero DocWiki: `Data.DB.TBlobField`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TBlobField) - the Delphi class used by Velox.
- [Free Pascal: `TBlobField`](https://www.freepascal.org/docs-html/fcl/db/tblobfield.html) - a compatible class overview; Velox executes Delphi and its own scripting adapter.

<small>Created 2026-07-15</small>
