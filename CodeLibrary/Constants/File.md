---
title: File
description: "File access and sharing mode constants used by TFileStream, including Velox's legacy create value and Windows sharing boundaries."
sidebar_position: 3
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, constants, file, stream, access, sharing, truncate]
---

## Available constants

| Role | Constants | Contract |
|---|---|---|
| Create/truncate | [`fmCreate`](File/fmCreate.md) | Create a missing file or truncate an existing file and open it read/write with exclusive sharing. |
| Access mode | [`fmOpenRead`](File/fmOpenRead.md), [`fmOpenWrite`](File/fmOpenWrite.md), [`fmOpenReadWrite`](File/fmOpenReadWrite.md) | Low two bits select read, write or read/write access to an existing file. |
| Sharing mode | [`fmShareCompat`](File/fmShareCompat.md), [`fmShareExclusive`](File/fmShareExclusive.md), [`fmShareDenyWrite`](File/fmShareDenyWrite.md), [`fmShareDenyRead`](File/fmShareDenyRead.md), [`fmShareDenyNone`](File/fmShareDenyNone.md) | Upper mode bits control which compatible handles other processes may open while this handle remains alive. |

## Building an open mode

For an existing file, combine exactly one access constant with one explicit sharing constant using `or`:

```Delphi
Input := TFileStream.Create(FileName, fmOpenRead or fmShareDenyWrite);
```

`fmOpenRead` and `fmShareCompat` are both zero. Omitting the share part therefore silently selects the legacy compatibility slot, which the current Windows RTL treats as restrictive sharing. Use `fmShareDenyWrite` for the common stable shared-read policy or `fmShareDenyNone` only when concurrent mutation is intentionally tolerated.

`fmOpenWrite` and `fmOpenReadWrite` do not create a missing file and do not truncate an existing file during construction. Writes start at the current stream position, initially byte zero, and can leave an old suffix unless the caller changes `Size` or deliberately replaces the file.

## `fmCreate` compatibility quirk

Velox exposes the legacy PascalScript value `fmCreate = $FFFF`, while current Delphi source declares `$FF00`. The compiled `TFileStream` recognizes the legacy all-bits-set value and creates/truncates with exclusive sharing. Because every bit is already set, `fmCreate or fmShareDenyNone` is still `$FFFF`; the requested share mode is not honored. Use `fmCreate` alone and treat successful construction as an immediate destructive operation.

## Safety, errors and concurrency

- Construction can fail for a missing parent, invalid path, permissions, incompatible sharing, handle exhaustion or platform errors. Parent directories are not created.
- Create/truncate is not transactional. A later write, conversion or disk-full failure can leave an empty or partial target. For safe publication, write a separate temporary file, flush/close it and use an appropriately designed replacement operation.
- Share modes coordinate only with handles that participate in the operating-system sharing contract. They do not lock application records, make multi-step reads atomic or protect a path after the stream is closed.
- Keep every file stream in `try..finally`. Its sharing policy remains active until the handle is freed.
- Mode interpretation is platform/RTL specific. The documented terminal is the Windows Delphi RTL used by Velox; portable scripts must not infer identical POSIX locking semantics.

No file was created, truncated or opened while documenting this group.

**External references**

- [Embarcadero file mode constants](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.fmOpenRead)
- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create)
- [Free Pascal `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html)

<small>Created 2026-07-15</small>
