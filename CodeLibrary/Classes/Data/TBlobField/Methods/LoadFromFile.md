---
title: LoadFromFile
description: Replaces the current record's BLOB value with every byte from a read-only source file.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, blob, file, destructive]
---

```Delphi
procedure LoadFromFile(const FileName: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Blob: TBlobField;
begin
  // DATA_Self and its Payload field must already exist.
  DATA_Self.Edit;
  Blob := TBlobField(DATA_Self.FieldByName('Payload'));
  Blob.LoadFromFile('C:\Fictional\Inbound\payload.bin');
  Value := not Blob.IsNull;
  // The surrounding flow decides when to Post or cancel this edit.
end;
```

### Usage

`LoadFromFile` replaces the current record's BLOB value with every byte from a read-only source file.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `FileName` | `string`, `const` | Source path visible to the executing Velox process. Relative paths use that process's current directory. |

**Errors**

Missing/denied files, invalid paths, wrong field type, inactive or invalid records, read-only fields, non-editing datasets, allocation failures and file/BLOB read or write errors can raise. There is no rollback to the previous BLOB after the write stream is created; a failure can leave a truncated or partial record buffer. Dataset-specific finalisation can route an error through the host exception handler.

**Usage notes**

Validate the path and place the dataset in the correct editing state before calling. Use the surrounding flow's normal cancel/recovery path on failure and post/apply only after the load succeeds.

### Additional Technical Info
`LoadFromFile` reads the complete source file and replaces the BLOB buffer for the current dataset record. It changes dataset state only; it does not post the record, apply updates or commit a database transaction.

The example uses a fictional path and intentionally leaves persistence to the surrounding flow. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Delphi `TBlobField.LoadFromFile` constructs a `TFileStream` with `fmOpenRead or fmShareDenyWrite`, calls `LoadFromStream`, then frees the file stream in a `finally` block. `LoadFromStream` creates a dataset BLOB stream in `bmWrite` mode and calls installed Delphi `TStream.CopyFrom(Source, 0)`.

For Count zero, Delphi rewinds the file stream to offset zero, obtains its Size and copies that exact number of bytes. On the common client-dataset path, constructing the write BLOB stream requires edit, insert or new-value state and truncates the prior value before copying.

**Behaviour**

- The source is opened before the dataset write stream is created. A not-editing failure can therefore occur after the file was successfully opened, although the file is still closed.
- The open handle denies concurrent write access while the copy runs but permits other readers. A conflicting existing handle prevents the source from opening.
- On a successful non-empty load, the current client-dataset record buffer contains the file bytes and the field is marked modified when the internal stream closes.
- Loading a zero-byte file performs no stream write. The common client-dataset path can therefore represent it as null rather than a distinct non-null empty BLOB.

**Side effects**

Reads a host file, replaces the current record's BLOB buffer and marks the field/dataset modified according to the owning dataset. It never deletes, moves or changes the source file.

**Performance and concurrency**

The operation is synchronous and linear in file size. Delphi copies in bounded chunks, while the common client dataset also holds the complete modified BLOB in memory. Coordinate dataset cursor/edit access and external file writers.

**Related entries**

- [`LoadFromStream`](LoadFromStream.md) performs the same BLOB replacement from a caller-owned stream.
- [`SaveToFile`](SaveToFile.md) creates or replaces a file from the current BLOB.

**External references**

- [Embarcadero DocWiki: `Data.DB.TBlobField.LoadFromFile`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TBlobField.LoadFromFile) - the Delphi file-to-BLOB method used by Velox.
- [Embarcadero DocWiki: `System.Classes.TStream.CopyFrom`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.CopyFrom) - establishes Count-zero source rewind and whole-stream copying.
- [Free Pascal: `TBlobField.LoadFromFile`](https://www.freepascal.org/docs-html/fcl/db/tblobfield.loadfromfile.html) - compatible file-loading context.

<small>Created 2026-07-15</small>
