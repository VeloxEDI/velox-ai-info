---
title: "ForceDirectories"
description: "Creates every missing directory in a path and reports whether the complete path exists afterward."
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - directories
  - create
---

```Delphi
Function ForceDirectories( const Directory : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ForceDirectories('C:\Fictional\Work\Archive');
end;
```

### Usage

`ForceDirectories` creates every missing directory in a path and reports whether the complete path exists afterward.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Directory` | `string`, `const` | Absolute or relative directory path to ensure. Every missing component can be created. |

**Returns**

`True` when the complete directory exists at return; `False` when one of the required creations fails. An empty path raises instead of returning `False`.

**Behaviour**

- An existing directory returns `True` without creating anything.
- Missing parent directories are created from the highest absent parent down to the requested leaf.
- A relative path is based on the Velox process current directory.
- A file occupying any required component prevents the complete directory chain and normally produces `False`.

**Errors**

An empty string explicitly raises. Many operating-system creation failures are represented by `False`, while argument-conversion, path/runtime and I/O exceptions can still propagate. Do not assume every failure is Boolean-only.

**Usage notes**

Use only with a path already constrained to an approved root. Check the Boolean result and handle exceptions. If later steps fail, explicitly decide whether empty directories should be retained or cleaned by a separately governed process.

### Additional Technical Info
`ForceDirectories` ensures that every directory component in `Directory` exists. It returns `True` when the requested directory already exists or the complete missing chain was created.

The example uses a fictional path. It is source-reviewed and was not executed by the documentation workflow. The routine has real file-system side effects and creates no rollback point.

**Implementation**

Velox's wrapper calls installed `System.SysUtils.ForceDirectories`. The RTL removes one ordinary trailing delimiter while preserving a drive root, exits successfully when `DirectoryExists` already accepts the path, then recursively calls itself for `ExtractFilePath(Dir)` before calling `CreateDir(Dir)`. Boolean short-circuiting stops creation below a failed parent.

**Edge cases and quirks**

- `Directory=''` raises `EInOutError` with error code 3 (`path not found`/cannot create directory); it does not return `False`.
- The operation is not transactional. If a parent is created and a later child fails, the new parent remains.
- A concurrent process can create a component between the existence check and `CreateDir`. The final Boolean follows the exact recursive implementation and should not be treated as a lock.
- Permissions, invalid names, missing/unavailable shares, path length and a file in the chain can cause failure.
- Relative, drive-relative, UNC and extended paths retain their Windows semantics. No environment expansion, path-policy check or `.`/`..` canonicalisation is added by Velox.
- Existing reparse/link targets are evaluated through the underlying default `DirectoryExists` behaviour.

**Side effects**

Creates zero or more directories. Partial changes remain after a later failure or exception. The function does not delete, secure, assign permissions to or log the created directories by itself.

**Performance and concurrency**

The routine performs an existence query for each recursive level and up to one create request per missing level. Network storage can block. It offers no cross-thread/process serialisation; callers must tolerate another actor changing the path concurrently.

**Related entries**

- [`ForceFolders`](ForceFolders.md) is an exact Velox alias.
- [`DirectoryExists`](DirectoryExists.md) performs the underlying existence query without creation.
- [`CheckFolder`](CheckFolder.md) is a Velox-owned folder helper with a separate implementation and contract.

**External references**

- [Embarcadero `System.SysUtils.ForceDirectories`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal `ForceDirectories`](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) - compatible recursive-creation context; installed Delphi source defines Velox's empty-path exception and exact recursion.

<small>Created 2026-07-15</small>
