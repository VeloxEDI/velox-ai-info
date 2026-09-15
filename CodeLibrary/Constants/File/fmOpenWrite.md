---
title: fmOpenWrite
description: Opens an existing file write-only and writes in place; the compiled RTL does not truncate it during construction.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, stream, write, access-mode]
---

```Delphi
fmOpenWrite = 1
```

### Example

```Delphi
function OpenExistingForWrite(const FileName: String): TFileStream;
begin
  Result := TFileStream.Create(FileName, fmOpenWrite or fmShareExclusive);
end;
```

### Usage

`fmOpenWrite` opens an existing file write-only and writes in place; the compiled RTL does not truncate it during construction.

### Additional Technical Info
`fmOpenWrite` selects write-only access to an existing file. The current Delphi implementation used by Velox calls `CreateFile` with `GENERIC_WRITE` and `OPEN_EXISTING`. It neither creates a missing file nor truncates an existing file when the stream is constructed.

**Important documentation/implementation boundary**

The current Embarcadero `TFileStream.Create` table describes write-only mode using replacement wording. The compiled Studio 37.0 source is more precise for Velox: writes begin at byte position 0 and replace bytes in place. If fewer bytes are written than the old length, the untouched trailing bytes remain unless Size is explicitly reduced. Use [`fmCreate`](fmCreate.md) for immediate replacement/truncation.

The handle cannot be read through successfully. OR the value with exactly one share mode; the example denies all compatible competing opens. More permissive sharing allows concurrency but does not serialize writers or make partial updates transactional.

The returned stream must be freed by its caller. Construction and later writes can raise, and later failure can leave a partially modified existing file.

The example returns an owned stream and is source-reviewed only; it was not executed.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create)
- [Free Pascal `FileOpen`](https://www.freepascal.org/docs-html/rtl/sysutils/fileopen.html)

<small>Created 2026-07-15</small>
