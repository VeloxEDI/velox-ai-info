---
title: Create
description: Opens or creates a file using the supplied access/share bit mask, with fmCreate as the only exposed truncating creation path.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, stream, file, create, open-mode, share-mode]
---

```Delphi
constructor Create(FileName: string; Mode: Word);
```

### Example

```Delphi
procedure CopyFileToMemory(const FileName: String; Dest: TMemoryStream);
var
  Source: TFileStream;
begin
  Source := TFileStream.Create(FileName, fmOpenRead or fmShareDenyWrite);
  try
    Dest.CopyFrom(Source, 0, 65536);
    Dest.Position := 0;
  finally
    Source.Free;
  end;
end;
```

### Usage

Opens or creates a file using the supplied access/share bit mask, with fmCreate as the only exposed truncating creation path.

### Additional Technical Info
`Create` opens `FileName` and returns a file-backed stream positioned at byte 0. This is the only TFileStream overload registered for Velox scripting; the native overload that accepts POSIX rights is not available.

`Mode` combines one access mode with, for existing files, one share mode:

| Access constant | Behavior |
|---|---|
| [`fmCreate`](../../../../Constants/File/fmCreate.md) | Create or truncate the file and open it for writing. In this implementation its `$FFFF` value also selects exclusive sharing. |
| [`fmOpenRead`](../../../../Constants/File/fmOpenRead.md) | Open an existing file read-only. |
| [`fmOpenWrite`](../../../../Constants/File/fmOpenWrite.md) | Open an existing file write-only without truncating it at construction. |
| [`fmOpenReadWrite`](../../../../Constants/File/fmOpenReadWrite.md) | Open an existing file for both operations. |

Existing-file access values can be OR-ed with `fmShareCompat`, `fmShareExclusive`, `fmShareDenyWrite`, `fmShareDenyRead` or `fmShareDenyNone`. The exact cross-process effect is operating-system dependent. The common read pattern uses `fmOpenRead or fmShareDenyWrite`, which permits other readers while denying writers.

#### Effects and failures

The `fmCreate` path calls the RTL file-create operation. If the target exists, truncation occurs during construction, before the caller can enter later processing. Do not probe a path with fmCreate. Use a non-mutating existence/policy check followed by a controlled create workflow, while recognizing that check/open races still exist.

Other access modes call the RTL file-open operation and require an existing file. Failure raises `EFCreateError` or `EFOpenError` with the expanded path and operating-system error. Parent directories are not created. A successful instance owns the handle and must be freed.

The constructor performs no sandboxing, extension validation or path normalization policy. Validate trusted roots before calling it. Opening succeeds or fails independently of whether later Read, Write or Size changes are appropriate for the selected access mode.

The example is source-reviewed only; no file was opened or copied.

**External references**

- [Embarcadero: `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create) - native overloads and mode definitions.
- [Free Pascal: `TFileStream.Create`](https://www.freepascal.org/docs-html/rtl/classes/tfilestream.create.html) - compatible access/share mode reference.

<small>Created 2026-07-15</small>
