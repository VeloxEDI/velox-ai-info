---
title: TFileStream
description: Provides an owned file handle as a seekable byte stream with explicit open, creation, sharing and lifetime responsibilities.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, file, io, handle, filesystem]
---

```Delphi
TFileStream = class(THandleStream)
```

### Example

```Delphi
procedure InspectFileSize(const FileName: String);
var
  Source: TFileStream;
begin
  Source := TFileStream.Create(FileName, fmOpenRead or fmShareDenyWrite);
  try
    Log('File bytes: ' + IntToStr(Source.Size));
  finally
    Source.Free;
  end;
end;
```

### Usage

`TFileStream` provides an owned file handle as a seekable byte stream with explicit open, creation, sharing and lifetime responsibilities.

### Additional Technical Info
`TFileStream` exposes a file as a [`TStream`](TStream.md). It owns the operating-system handle opened by [`Create`](TFileStream/Methods/Create.md), closes that handle when freed, and dispatches inherited Read, Write, Seek, Position and Size operations to the file.

The Stream scripting category hides the native `THandleStream` ancestor, but its visible TStream contract is inherited. The native `FileName` and `Handle` properties are not part of this visible generated surface.

#### Ownership and authority

A successful constructor returns a script-owned object. Always call `Free` in `finally`; otherwise the file can remain open until the surrounding script runtime releases it, retaining locks and handles longer than intended. If construction raises, no object was assigned and there is nothing to free.

The object has the same filesystem authority as the Velox process. Validate paths at the integration boundary, restrict them to approved roots, and do not allow untrusted values to select arbitrary configuration, credential or system files. Relative paths use the service/application working-directory context and are deployment-dependent.

The open mode governs whether reads, writes and resizing are permitted. A method can be present in the class yet fail because the underlying handle was opened read-only or because the operating system denies access. Multiple streams/processes also interact through the chosen share mode; no locking or transaction is added by TFileStream itself.

#### Cursor and file state

Newly opened streams begin at Position 0. Reads and writes advance one shared byte cursor. Writing existing files is in place unless the constructor used `fmCreate` or code explicitly changes Size; opening with `fmOpenWrite` does not itself guarantee removal of trailing old bytes.

All changes are immediate and nontransactional. A failure can leave a partially written/truncated file. Use an approved temporary-file-and-replace workflow where atomic publication matters.

The example is source-reviewed only; no file was opened.

**External references**

- [Embarcadero: `TFileStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream) - Delphi file-stream class.
- [Free Pascal: `TFileStream`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.html) - compatible class and inheritance reference.

<small>Created 2026-07-15</small>
