---
title: SaveToFile
description: Creates or truncates a destination file and copies the current record's complete BLOB into it.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, blob, file, destructive]
---

```Delphi
procedure SaveToFile(const FileName: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Blob: TBlobField;
begin
  Blob := TBlobField(DATA_Self.FieldByName('Payload'));
  Blob.SaveToFile('C:\Fictional\Outbound\payload-copy.bin');
  Value := True;
end;
```

### Usage

`SaveToFile` creates or truncates a destination file and copies the current record's complete BLOB into it.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `FileName` | `string`, `const` | Destination path available to the executing Velox process. Its parent directory must exist. Relative paths use the process current directory. |

**Behaviour**

- A null or zero-length BLOB produces a zero-byte file; this file output does not preserve the null-versus-empty distinction.
- The method reads the field on the dataset's current record. Dataset movement before the call changes which value is exported.
- The operation does not decode, transcode or validate the BLOB's content.
- Normal completion means the copy call completed, but the method adds no checksum, atomic replacement or post-write verification.

**Errors**

Invalid/denied paths, missing parent directories, inactive datasets, invalid current records, BLOB-read failures, allocation errors and filesystem write/close errors can raise. Because truncation occurs first, any later failure can leave an empty or partial file; there is no temporary file or rollback.

**Usage notes**

Use a flow-controlled staging filename plus an explicitly verified rename/move when an existing output must survive failure. Do not treat the path as safe merely because it came from data; validate and constrain configuration-derived filenames before use.

### Additional Technical Info
`SaveToFile` creates or replaces a file with every byte from the current record's BLOB. An existing destination is truncated before the BLOB read is attempted.

The example writes to a fictional path and would replace that destination. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Delphi `TBlobField.SaveToFile` constructs a `TFileStream` with `fmCreate`, delegates to `SaveToStream`, then closes the file in a `finally` block. `SaveToStream` creates a dataset BLOB stream in `bmRead` mode and calls destination `CopyFrom(BlobStream, 0)`.

The Count-zero copy rewinds the internal BLOB stream, obtains its complete Size and writes at the file stream's current position, initially zero. `fmCreate` creates a missing file or truncates an existing one before the owning dataset is asked for readable BLOB data.

**Side effects**

Creates or irreversibly truncates the destination file under the executing process identity. It reads but does not edit, post or free the field/dataset.

**Performance and concurrency**

The call is synchronous and linear in BLOB size. It uses a bounded copy buffer; the owning dataset can additionally materialise the complete BLOB. Direct replacement is not atomic for other readers. Coordinate dataset navigation and destination consumers.

**Related entries**

- [`SaveToStream`](SaveToStream.md) writes into a caller-owned destination without truncating it.
- [`LoadFromFile`](LoadFromFile.md) replaces the current BLOB from a file.

**External references**

- [Embarcadero DocWiki: `Data.DB.TBlobField.SaveToFile`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TBlobField.SaveToFile) - the Delphi file export method used by Velox.
- [Embarcadero DocWiki: `System.Classes.TStream.CopyFrom`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.CopyFrom) - the whole-source copy terminal.
- [Free Pascal: `TBlobField.SaveToFile`](https://www.freepascal.org/docs-html/fcl/db/tblobfield.savetofile.html) - compatible create/write behaviour and failure context.

<small>Created 2026-07-15</small>
