---
title: fmCreate
description: Creates or immediately truncates a file through TFileStream, using Velox's legacy all-bits-set value and forced exclusive sharing.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, stream, create, truncate]
---

```Delphi
fmCreate = 65535
```

### Example

```Delphi
procedure ReplaceFile(const FileName: String; Source: TStream);
var
  Dest: TFileStream;
begin
  Dest := TFileStream.Create(FileName, fmCreate);
  try
    Dest.CopyFrom(Source, 0, 65536);
  finally
    Dest.Free;
  end;
end;
```

### Usage

`fmCreate` creates or immediately truncates a file through TFileStream, using Velox's legacy all-bits-set value and forced exclusive sharing.

**Effects and risk**

- This is not a probe for writability: an existing target can be destroyed merely by successful construction.
- Later serialization, source reads, disk-full errors or write failures can leave an empty or partial file. The operation is not transactional or atomic publication.
- Parent directories are not created. Invalid paths, permissions and incompatible existing handles raise from the constructor.
- The returned stream owns the file handle and must be freed in `finally`; sharing restrictions last for that handle's lifetime.

### Additional Technical Info
`fmCreate` tells [`TFileStream.Create`](../../Classes/Stream/TFileStream/Methods/Create.md) to create a missing file or truncate an existing file and return a read/write handle positioned at byte 0. Truncation happens inside the constructor, before any later script statement can succeed or fail.

**Velox/Delphi compatibility quirk**

Velox's Pascal Script import deliberately exposes the legacy value `$FFFF` (`65535`). Current Delphi declares `fmCreate = $FF00`. The compiled `TFileStream` recognises the all-bits-set legacy value, sees lower byte `$FF`, and remaps the share mode to [`fmShareExclusive`](fmShareExclusive.md) before calling `FileCreate`.

Because every bit in `$FFFF` is already set, OR-ing `fmCreate` with an access or share constant cannot change the result. In Velox scripts, `fmCreate or fmShareDenyNone` is still `$FFFF` and still creates/truncates with exclusive sharing. Use `fmCreate` by itself so this is obvious.

**Related entries**

- [`fmOpenWrite`](fmOpenWrite.md) opens an existing file for in-place writing without constructor-time truncation.
- [`fmOpenReadWrite`](fmOpenReadWrite.md) opens an existing file for both reads and writes.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create)
- [Free Pascal `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html)

<small>Created 2026-07-15</small>
