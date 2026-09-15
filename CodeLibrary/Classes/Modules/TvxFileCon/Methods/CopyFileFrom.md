---
title: CopyFileFrom
description: Copies an explicit source file into this FileCon's processed primary directory and updates current-file state.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, copy-file, current-file]
---

```Delphi
function CopyFileFrom(const aSourceFile: String; aDestName: String): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  { Effectful example: both locations must be authorised. }
  if FileCon <> nil then
    Value := FileCon.CopyFileFrom('C:\Velox\Staging\input.xml', 'input.xml')
  else
    Value := False;
end;
```

### Usage

`CopyFileFrom` copies an explicit source file into this FileCon's processed primary directory and updates current-file state.

**Critical state quirks**

- If uniqueness changes the destination, `CurrentFileName` remains the **pre-unique** name rather than the file actually copied.
- If directory creation, lock waiting or copy fails, `CurrentFileName` can still point at a destination that does not exist.
- If log status is already false/cancelled, the method returns its initial `True` without copying or changing current state.
- A nonempty pending NewFileName is cleared before the copy attempt, so failure does not restore it.
- The Boolean does not return or verify the final destination path; inspect logs/files under a governed workflow rather than inferring from `True`.

### Additional Technical Info
`CopyFileFrom` copies `aSourceFile` into the FileCon's processed primary directory and changes its current-file state.

**Name and destination**

The destination name is chosen from explicit nonempty `aDestName`, otherwise tag-processed/consumed [`NewFileName`](../Properties/NewFileName.md), otherwise the source basename. Only the pending-name branch forcibly extracts a basename. The destination directory is [`ProcessFileDir`](ProcessFileDir.md) and is created when missing.

Explicit names are not tag-processed, sanitised or root-contained. Do not allow untrusted names or source paths.

**Implementation and result**

Before directory creation, unique-name selection or copying, the method assigns `CurrentFileName` to the initially constructed destination. It then optionally chooses a GUID-suffixed unique actual destination, waits up to 30 seconds for the source lock and calls Windows `CopyFileEx` with replacement allowed.

Errors are caught/logged and returned through `Log.Status`; the copy is not transactionally reversible.

**Performance and concurrency**

Network/large file copies block synchronously. The unique-name check and mutable current/pending-name fields are unsynchronised and race-prone. Use one FileCon per action thread.

**Related entries**

- [`CopyFile`](CopyFile.md) — current source to an explicit destination directory.
- [`CurrentFileName`](../Properties/CurrentFileName.md) — pre-unique/failure caveat.
- [`FilePath`](../Properties/FilePath.md) — explicit/discovered input path state.

**External references**

- [Microsoft Learn: `CopyFileExW`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-copyfileexw)

<small>Created 2026-07-15</small>
