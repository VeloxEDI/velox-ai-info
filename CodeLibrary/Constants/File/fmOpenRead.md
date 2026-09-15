---
title: fmOpenRead
description: Opens an existing file read-only, with an explicit share mode required when concurrent readers or writers must be allowed.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, stream, read, access-mode]
---

```Delphi
fmOpenRead = 0
```

### Example

```Delphi
procedure ReadSharedFile(const FileName: String; Dest: TStream);
var
  Source: TFileStream;
begin
  Source := TFileStream.Create(FileName, fmOpenRead or fmShareDenyWrite);
  try
    Dest.CopyFrom(Source, 0, 65536);
  finally
    Source.Free;
  end;
end;
```

### Usage

`fmOpenRead` opens an existing file read-only, with an explicit share mode required when concurrent readers or writers must be allowed.

### Additional Technical Info
`fmOpenRead` selects read-only access to an existing file. [`TFileStream.Create`](../../Classes/Stream/TFileStream/Methods/Create.md) calls the current Delphi `FileOpen` path, which opens with `OPEN_EXISTING`; it does not create a missing file. Reads are allowed, while Write or resizing operations can fail through the read-only handle.

The value is zero because access is encoded in the low two bits. It is normally OR-ed with exactly one share-mode alternative. A subtle consequence is that bare `fmOpenRead` contains no explicit sharing bits. On the current Windows RTL, zero sharing grants no read or write sharing to other opens, so it behaves like exclusive sharing for the handle lifetime.

The example explicitly adds [`fmShareDenyWrite`](fmShareDenyWrite.md), allowing other readers while preventing compatible writers. Use [`fmShareDenyNone`](fmShareDenyNone.md) only when concurrent writes are acceptable and the reader can tolerate observing changing content.

The file cursor starts at byte 0. The returned stream must be freed in `finally`. Opening and reading remain separate non-atomic steps: permissions, replacement, truncation by permitted writers, short reads and storage errors can still matter according to the chosen sharing policy.

The example is source-reviewed only; no file was opened.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create)
- [Free Pascal `FileOpen`](https://www.freepascal.org/docs-html/rtl/sysutils/fileopen.html)

<small>Created 2026-07-15</small>
