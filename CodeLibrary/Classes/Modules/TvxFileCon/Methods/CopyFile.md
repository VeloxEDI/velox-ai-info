---
title: CopyFile
description: Copies the current FileCon file into a destination directory using Velox naming, uniqueness, lock-wait and logging rules.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-connection, copy-file, filesystem]
---

```Delphi
function CopyFile(const aDestPath: String; aDestName: String): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  { Effectful example: use only an authorised destination. }
  if FileCon <> nil then
    if FileCon.CurrentFileName <> '' then
      Value := FileCon.CopyFile('C:\Velox\Outbound', '')
    else
      Value := False
  else
    Value := False;
end;
```

### Usage

`CopyFile` copies the current FileCon file into a destination directory using Velox naming, uniqueness, lock-wait and logging rules.

**Critical no-op and failure semantics**

- The local result starts `True`. If the log is already cancelled or false, the method exits immediately and returns `True` even though no copy occurred.
- `True` therefore means only that current log status is true (or an early no-op occurred), not that destination bytes were verified.
- `CurrentFileName` continues to identify the source; the actual destination is not returned.
- Unique-name selection is a check-then-copy sequence and can race another writer.
- The copy is an external side effect and is not rolled back with database/action failure.

**Security and performance**

Paths run in Velox service/process identity. Validate trusted roots and prohibit transaction-controlled traversal/names. Large/network copies can block the script thread beyond the pre-copy lock wait and can overwrite when uniqueness is disabled.

### Additional Technical Info
`CopyFile` copies [`CurrentFileName`](../Properties/CurrentFileName.md) to `aDestPath` without changing the source file.

**Destination-name precedence**

1. A nonempty `aDestName` is used exactly as supplied.
2. Otherwise a pending [`NewFileName`](../Properties/NewFileName.md) is tag-processed, reduced to its basename and cleared.
3. Otherwise the basename of `CurrentFileName` is used.

The selected name is appended to `aDestPath` after adding a trailing path delimiter. Explicit `aDestName` is not tag-processed, basename-restricted or sanitised. The method creates `aDestPath` when missing, but does not separately create subdirectories embedded in the name.

**Copy terminal and result**

Velox waits up to 30 seconds for exclusive-enough access to the source, independently of the FileCon discovery `WaitFor` setting. With the default non-script-visible unique-name option, an existing destination gains a GUID suffix; otherwise Windows `CopyFileEx` is called with flags that allow replacement of an existing ordinary destination.

The method catches copy errors, marks/logs failure and returns the shared `Log.Status`. It does not raise those filesystem exceptions to the script.

**Related entries**

- [`CopyFileFrom`](CopyFileFrom.md) — copies an explicitly supplied source into this connection's FileDir.
- [`MoveFile`](MoveFile.md) — moves the current file and mutates routing state.
- [`NewFileName`](../Properties/NewFileName.md) — pending one-use fallback name.

**External references**

- [Microsoft Learn: `CopyFileExW`](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-copyfileexw)

<small>Created 2026-07-15</small>
