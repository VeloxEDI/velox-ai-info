---
title: fmShareDenyRead
description: Allows compatible writers but denies compatible readers, creating a deliberately unstable and platform-sensitive concurrency policy.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, stream, sharing, deny-read]
---

```Delphi
fmShareDenyRead = 48
```

### Example

```Delphi
function OpenWhileAllowingWriters(const FileName: String): TFileStream;
begin
  Result := TFileStream.Create(FileName, fmOpenReadWrite or fmShareDenyRead);
end;
```

### Usage

`fmShareDenyRead` allows compatible writers but denies compatible readers, creating a deliberately unstable and platform-sensitive concurrency policy.

### Additional Technical Info
`fmShareDenyRead` denies compatible competing read access while permitting compatible write access. The current Windows RTL passes `FILE_SHARE_WRITE` as the handle's sharing mask.

This counterintuitive policy does not protect the current handle from concurrent mutation: another process can open for writing if its own share request is compatible. Reads can observe changing content and writes can interleave or overwrite. Use it only when that precise coordination policy is required; it is not a general “lock for update.”

Embarcadero marks this value nonportable, and Free Pascal documents that deny-read locking is not supported uniformly outside Windows. Deployment behavior must therefore be treated as operating-system specific.

OR the value with exactly one existing-file access mode and free the stream promptly. Combining multiple share values is invalid reasoning: bitwise OR can accidentally select a different defined nibble rather than combining independent permissions.

The example returns an owned stream and is source-reviewed only; no file was opened.

**External references**

- [Embarcadero `TFileStream.Create`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TFileStream.Create)
- [Free Pascal `FileOpen`](https://www.freepascal.org/docs-html/rtl/sysutils/fileopen.html)

<small>Created 2026-07-15</small>
