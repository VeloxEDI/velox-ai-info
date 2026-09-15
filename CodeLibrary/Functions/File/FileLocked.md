---
title: "FileLocked"
description: "Reports whether Velox cannot open a path for read/write access while denying other writers."
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - lock
  - sharing
---

```Delphi
Function FileLocked( const aFilePath : string) : boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := FileLocked('C:\Fictional\Inbound\order.xml');
end;
```

### Usage

`FileLocked` reports whether Velox cannot open a path for read/write access while denying other writers.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFilePath` | `string`, `const` | Literal file path to probe. Wildcards are not expanded by Velox open. |

**Returns**

`False` when `FileOpen(aFilePath, fmOpenReadWrite or fmShareDenyWrite)` returns a valid handle; otherwise `True`.

**Behaviour**

- A compatible existing writable file normally returns `False`.
- A file held with an incompatible sharing mode returns `True`.
- The probe itself briefly prevents other writers while its handle is open.
- No handle or lock remains after return.

**Important usage notes**

- `True` does **not** specifically prove another process holds a lock. Missing files, read-only media/attributes, denied permissions, directories, invalid paths and unavailable shares also fail the requested read/write open.
- A file can be readable but still report `True` because write access is requested.
- A current compatible open does not guarantee the next open; another actor can change sharing or delete/replace the path immediately.
- Relative paths depend on shared across the Velox process current-directory state.

**Errors**

All ordinary open errors are collapsed to `True`; no last-error code or exception is exposed.

### Additional Technical Info
`FileLocked` returns `False` only when Velox can briefly open the path for both reading and writing while allowing other readers but denying other writers. Every open failure is reported as `True`.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Installed Delphi `FileOpen` maps this mode to Win32 `CreateFileW` with `GENERIC_READ or GENERIC_WRITE`, share mode `FILE_SHARE_READ`, `OPEN_EXISTING` and `FILE_ATTRIBUTE_NORMAL`. Velox closes a successful handle immediately.

**Side effects**

Opens and closes the file on success. It does not modify file content, but the temporary share mode can briefly affect competing opens.

**Performance and concurrency**

One synchronous open/close probe. Network paths can block. The result is a momentary observation, not a durable concurrency primitive.

**Remarks**

Interpret the result as “not openable with this exact mode.” Handle the real open/write operation's result even after `False`.

**Related entries**

- [`WaitForFileLockRelease`](WaitForFileLockRelease.md) repeats this same ambiguous probe.
- [`FileIsReadOnly`](FileIsReadOnly.md) checks only the enumerated attribute.
- [`FileExists`](FileExists.md) does not prove this access mode is available.

**External references**

- [Embarcadero `System.SysUtils.FileOpen`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FileOpen)
- [Microsoft `CreateFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew) - exact Windows access/share terminal used by installed Delphi.
- [Free Pascal `FileOpen`](https://www.freepascal.org/docs-html/rtl/sysutils/fileopen.html) - compatible API context; sharing behavior here is the Windows Delphi terminal above.

<small>Created 2026-07-15</small>
