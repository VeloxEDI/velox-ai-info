---
title: "ForceFolders"
description: "Alias for ForceDirectories that creates every missing directory in a path."
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - folders
  - create
---

```Delphi
Function ForceFolders( const aFolder : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ForceFolders('C:\Fictional\Work\Archive');
end;
```

### Usage

`ForceFolders` alias for ForceDirectories that creates every missing directory in a path.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFolder` | `string`, `const` | Absolute or relative directory path to ensure. |

**Returns**

An empty string raises rather than returning `False`.

**Behaviour**

Behaviour is identical to [`ForceDirectories`](ForceDirectories.md): existing directories succeed; missing parent directories are created recursively; failure can return `False` after leaving earlier created directories in place.

**Important usage notes**

- The word “Folders” does not identify a different algorithm or a special Velox data location.
- Empty input raises Velox RTL `EInOutError`.
- Relative input uses the process current directory.
- Creation is non-transactional and subject to access, naming, storage, race and reparse-point behaviour.
- A successful return does not grant exclusive ownership or guarantee later access.

**Usage notes**

Prefer `ForceDirectories` in new scripts so the name matches the Velox API. Retain this alias for compatibility or established Velox terminology. Constrain the input to an approved root before invoking either name.

### Additional Technical Info
`ForceFolders` is a Velox naming alias for [`ForceDirectories`](ForceDirectories.md). It creates every missing component of `aFolder` and returns whether the complete directory exists.

The example uses a fictional path. It is source-reviewed and was not executed by the documentation workflow. Calling the function can create multiple directories.

**Implementation**

`uPSI_SysUtilsImport` registers `ForceFolders` against `SysUtilsImport.ForceFolders`, whose complete implementation is `Result := SysUtils.ForceDirectories(aFolder)`. It adds no Velox-specific checks, logging, retries, rollback or permissions.

**Side effects**

Zero or more directories can be created. Partial directory chains remain after later failure. No automatic rollback occurs.

**Errors**

The same Boolean failures and propagated exception cases as `ForceDirectories` apply.

**Performance and concurrency**

The alias adds only one wrapper call. Terminal cost is one existence query per level plus creation for each missing component, with no inter-process locking.

**Related entries**

- [`ForceDirectories`](ForceDirectories.md) is the canonical equivalent and contains the complete recursive behaviour.
- [`FolderExists`](FolderExists.md) is the corresponding query alias.
- [`CheckFolder`](CheckFolder.md) is a separate Velox-owned function.

**External references**

There is no separate Delphi or Free Pascal `ForceFolders` terminal in this path. The alias terminates in:

- [Embarcadero `System.SysUtils.ForceDirectories`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal `ForceDirectories`](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) - compatibility context only; Velox uses installed Delphi source.

<small>Created 2026-07-15</small>
