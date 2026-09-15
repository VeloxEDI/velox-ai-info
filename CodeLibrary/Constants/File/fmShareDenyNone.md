---
title: fmShareDenyNone
description: Allows compatible competing readers and writers while a file handle is open, without providing atomicity or content stability.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, stream, sharing, concurrency]
---

```Delphi
fmShareDenyNone = 64
```

### Example

```Delphi
function OpenForConcurrentRead(const FileName: String): TFileStream;
begin
  Result := TFileStream.Create(FileName, fmOpenRead or fmShareDenyNone);
end;
```

### Usage

`fmShareDenyNone` allows compatible competing readers and writers while a file handle is open, without providing atomicity or content stability.

### Additional Technical Info
`fmShareDenyNone` requests that compatible competing opens be allowed for both reading and writing. In the current Windows RTL, the resulting handle passes `FILE_SHARE_READ or FILE_SHARE_WRITE` to the operating system.

This is the most permissive exposed share mode. It is useful when external processes must continue updating or replacing a file, but it provides no stable snapshot: Size and content can change between or during reads, and interleaved writers can overwrite each other. A successful open does not make a later multi-step operation atomic.

Share flags are evaluated against other handles' requested access and sharing. They do not override permissions, make non-cooperating access safe, lock in a path target, prevent rename/delete behavior on every platform, or remove check/open races. Free the stream promptly so the handle does not outlive the intended operation.

OR this value with exactly one existing-file access mode. It cannot make [`fmCreate`](fmCreate.md) permissive in Velox because the script's legacy `$FFFF` create value already has every share bit set and is remapped to exclusive.

The example returns an owned stream and is source-reviewed only; no file was opened.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create)
- [Free Pascal `FileOpen`](https://www.freepascal.org/docs-html/rtl/sysutils/fileopen.html)

<small>Created 2026-07-15</small>
