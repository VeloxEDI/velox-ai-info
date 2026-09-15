---
title: "FileExists"
description: "Reports whether a path resolves to an existing non-directory file using Delphi's default link-following behaviour."
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - existence
  - filesystem
---

```Delphi
Function FileExists( const FileName : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := FileExists('C:\Fictional\Inbound\order.csv');
end;
```

### Usage

Use `FileExists` to make a simple decision based on whether a path currently identifies a file, such as choosing whether to process an optional inbound file. Prefer an absolute path; relative paths depend on the Velox process working directory. Use `DirectoryExists` when the expected path is a folder.

The result is only a point-in-time check and does not reserve, lock or open the file. For important processing, attempt the real read, move or open operation and handle its failure because the file can change immediately after `FileExists` returns.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `FileName` | `string`, `const` | Absolute or relative file path to query. Wildcards are not interpreted. |

**Returns**

`True` when the path resolves to an existing non-directory file; otherwise `False`.

### Additional Technical Info

`FileExists` reports whether `FileName` currently resolves to an existing file that is not a directory. The one-argument script signature does not expose Delphi's `FollowLink` option, so link following always uses the default `True`.

The example uses a fictional path. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox's wrapper calls installed `System.SysUtils.FileExists(FileName)` with default `FollowLink=True`. On Windows, the RTL first inspects attributes. It rejects directory attributes, follows reparse/symbolic-link targets with an opened handle, and uses `FindFirstFile` as a fallback for selected access, sharing or lock failures so some locked files are still recognised.

**Behaviour**

- An accessible ordinary file returns `True`.
- A directory, missing path, invalid path or broken followed link returns `False`.
- The complete string is a single file path; `*` and `?` are not search patterns.
- Relative input is resolved from the Velox process current directory.

**Edge cases and quirks**

- Scripts cannot request `FollowLink=False`. A link itself is not treated as the result object; its target is followed, and a directory target returns `False`.
- The lock/share fallback means a file can return `True` even when the next requested access mode cannot open it.
- Conversely, access, security, remote-share and reparse-point conditions can produce `False` without proving absence.
- The result is vulnerable to a time-of-check/time-of-use race. Another actor can replace, remove or lock the path immediately afterward.
- A relative path depends on process-global state and can be affected by legacy routines such as [`ProcessPath`](ProcessPath.md).

**Side effects**

No persistent file-system change. The implementation can briefly open or enumerate the path while resolving links and lock/share cases.

**Errors**

Normal missing, inaccessible, invalid and directory cases return `False`. Argument conversion and unexpected platform/runtime failures can propagate.

**Performance and concurrency**

This is normally a metadata query but can perform handle or directory-search fallback operations. Remote paths can block. The function is safe to call concurrently but does not lock the file or make a later operation atomic.

**Remarks**

Where possible, attempt the real open/read/move operation and handle its result instead of using existence as a precondition. Never use `FileExists` alone as a security boundary.

**Related entries**

- [`DirectoryExists`](DirectoryExists.md) accepts directories rather than files.
- [`FileAge`](FileAge.md) retrieves a successful file's last-write timestamp.
- [`FileLocked`](FileLocked.md) tests a specific access/lock condition through Velox code.
- [`MatchesMask`](MatchesMask.md) performs lexical wildcard matching; it does not query storage.

**External references**

- [Embarcadero `System.SysUtils.FileExists`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FileExists)
- [Free Pascal `FileExists`](https://www.freepascal.org/docs-html/rtl/sysutils/fileexists.html) - compatible API context; installed Delphi/Windows link and fallback logic defines Velox behaviour.

<small>Created 2026-07-15</small>
