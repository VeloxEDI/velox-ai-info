---
title: fmOpenReadWrite
description: Opens an existing file for in-place reading and writing without creating or truncating it at construction.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, stream, read-write, access-mode]
---

```Delphi
fmOpenReadWrite = 2
```

### Example

```Delphi
function OpenForUpdate(const FileName: String): TFileStream;
begin
  Result := TFileStream.Create(FileName, fmOpenReadWrite or fmShareExclusive);
end;
```

### Usage

`fmOpenReadWrite` opens an existing file for in-place reading and writing without creating or truncating it at construction.

### Additional Technical Info
`fmOpenReadWrite` selects both read and write access to an existing file. The current Windows RTL requests `GENERIC_READ or GENERIC_WRITE` with `OPEN_EXISTING`, so a missing file is not created and an existing file is not truncated by construction.

Reads and writes share one byte cursor, initially at position 0. Writes replace bytes in place and can extend the file, but bytes beyond the last write remain unless script code deliberately changes Size. Use [`fmCreate`](fmCreate.md) when replacement/truncation is intended, recognizing its immediate destructive effect.

OR this access value with one share-mode alternative. The example uses [`fmShareExclusive`](fmShareExclusive.md), which rejects compatible competing opens while the handle remains alive. A more permissive share mode increases concurrency but does not make multi-step updates atomic or protect data from interleaved writers.

The returned stream is owned by the caller and must be freed. Invalid paths, missing files, permissions and incompatible handles raise during construction; read/write/resize failures can occur later and leave an in-place update partially applied.

The example returns an owned stream deliberately; its caller must free it. It is source-reviewed only and was not executed.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create)
- [Free Pascal `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html)

<small>Created 2026-07-15</small>
