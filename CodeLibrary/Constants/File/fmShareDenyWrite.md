---
title: fmShareDenyWrite
description: Allows compatible readers while denying compatible writers, the common Velox mode for a stable shared file read.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, stream, sharing, deny-write]
---

```Delphi
fmShareDenyWrite = 32
```

### Example

```Delphi
function OpenForStableSharedRead(const FileName: String): TFileStream;
begin
  Result := TFileStream.Create(FileName, fmOpenRead or fmShareDenyWrite);
end;
```

### Usage

`fmShareDenyWrite` allows compatible readers while denying compatible writers, the common Velox mode for a stable shared file read.

### Additional Technical Info
`fmShareDenyWrite` permits compatible competing readers and denies compatible competing writers for the lifetime of the handle. The current Windows RTL passes `FILE_SHARE_READ` to `CreateFile`.

`fmOpenRead or fmShareDenyWrite` is the common Delphi and Velox stable-read pattern: multiple readers can coexist, while a process that requests write access cannot open compatibly until the readers close. Velox uses this pattern for script loading, file-engine input, XML/dataset loading and several transport/file readers.

This is sharing at open-handle level, not a transaction or content signature. It cannot undo a mutation completed before open, guarantee remote/network filesystem semantics, prevent a process using incompatible low-level behavior, or ensure that a path is still the same object after the handle closes. Always free the stream in `finally` so writers are not blocked longer than necessary.

OR this share value with one access-mode alternative. Do not OR it with another share constant; the high-nibble encodings are mutually exclusive choices.

The example returns an owned stream and is source-reviewed only; no file was opened.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create)
- [Free Pascal `FileOpen`](https://www.freepascal.org/docs-html/rtl/sysutils/fileopen.html)

<small>Created 2026-07-15</small>
