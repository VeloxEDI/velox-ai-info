---
title: "DirectoryExists"
description: "Reports whether a path resolves to an existing directory using Delphi's default link-following behaviour."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - directories
  - existence
---

```Delphi
Function DirectoryExists( const Directory : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DirectoryExists('C:\Fictional\Inbound');
end;
```

### Usage

`DirectoryExists` reports whether a path resolves to an existing directory using Velox's default link-following behaviour.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Directory` | `string`, `const` | Absolute or relative directory path to query. No environment-variable expansion or path normalisation is performed. |

**Returns**

`True` when the path exists and object is a directory; otherwise `False`.

**Behaviour**

- A normal accessible directory returns `True`.
- A regular file, nonexistent path or broken followed link returns `False`.
- A relative value is resolved against the Velox process current directory, not the location of the current configuration or source file.
- The function observes only the state at the time of the call; it does not reserve, open or lock the directory.

**Errors**

Normal missing, inaccessible and wrong-kind cases return `False`. Values that cannot convert to `string` and unexpected runtime failures can still raise before or during the call.

**Usage notes**

Prefer approved absolute paths in service configurations. When the next operation must create the directory, call [`ForceDirectories`](ForceDirectories.md) and check its result rather than relying on a separate existence check.

### Additional Technical Info
`DirectoryExists` returns whether `Directory` currently resolves to an existing directory. The script exposes only one argument, so the underlying Delphi routine's `FollowLink` option always uses its default value of `True`.

The example uses a fictional path. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The PascalScript registration calls `SysUtilsImport.DirectoryExists`, which delegates to installed `System.SysUtils.DirectoryExists(Directory)`. The omitted `FollowLink` parameter defaults to `True`. On Windows, the current RTL reads file attributes and, for a reparse/symbolic-link path, opens it with directory backup semantics to verify the followed target before accepting the directory attribute.

**Edge cases and quirks**

- Scripts cannot request `FollowLink=False`. A link to an existing directory is therefore tested through its target, and a broken link returns `False`.
- `False` can mean missing, not a directory, inaccessible, invalid or unable to open the reparse target. The signature exposes no reason.
- Access and sharing rules can make a path appear unavailable even when another security context can use it.
- The process current directory is shared state. Relative checks can be unreliable if another component changes it; [`ProcessPath`](ProcessPath.md) temporarily does exactly that.
- Existence can change immediately after the return. Use the result for branching and diagnostics, not as an authorisation or concurrency guarantee.

**Side effects**

No persistent file-system change is made. The Windows implementation can briefly open a handle while following a reparse point.

**Performance and concurrency**

This is an operating-system metadata query and can block on remote or unavailable storage. It is safe to call concurrently, but its answer is a non-atomic snapshot and does not synchronise later operations.

**Related entries**

- [`FolderExists`](FolderExists.md) is an exact Velox alias for this one-argument behaviour.
- [`FileExists`](FileExists.md) accepts non-directory files instead.
- [`ForceDirectories`](ForceDirectories.md) creates missing path components.
- [`CheckFolder`](CheckFolder.md) is a Velox-owned folder check with a separate implementation.

**External references**

- [Embarcadero `System.SysUtils.DirectoryExists`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.DirectoryExists)
- [Free Pascal `DirectoryExists`](https://www.freepascal.org/docs-html/rtl/sysutils/directoryexists.html) - compatible API context; Delphi's current Windows link and handle logic defines Velox behaviour.

<small>Created 2026-07-15</small>
