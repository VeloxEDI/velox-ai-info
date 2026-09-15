---
title: "FolderExists"
description: "Alias for DirectoryExists that reports whether a path resolves to an existing directory."
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - folders
  - existence
---

```Delphi
Function FolderExists( const aFolder : string) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := FolderExists('C:\Fictional\Inbound');
end;
```

### Usage

`FolderExists` alias for DirectoryExists that reports whether a path resolves to an existing directory.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFolder` | `string`, `const` | Absolute or relative directory path to query. |

**Behaviour**

Its observable behaviour is the same as the one-argument [`DirectoryExists`](DirectoryExists.md): normal directories and links to existing directories can return `True`; files, missing paths and broken followed links return `False`.

**Important usage notes**

- The alternative name does not imply a Velox configuration-folder lookup or a recursive search.
- Relative paths use the process current directory.
- `False` combines missing, wrong-kind, inaccessible, invalid and link-resolution cases.
- The result is a non-atomic snapshot and provides no guarantee for a later operation.
- Scripts cannot request the RTL `FollowLink=False` option.

**Errors**

Normal query failures return `False`; conversion and unexpected runtime failures can propagate.

**Usage notes**

Prefer `DirectoryExists` in new scripts so the name matches Velox API. Retain `FolderExists` where it makes an existing configuration clearer or preserves compatibility.

### Additional Technical Info
`FolderExists` is a Velox naming alias for [`DirectoryExists`](DirectoryExists.md). It returns whether `aFolder` resolves to an existing directory using Delphi's default link-following behaviour.

The example uses a fictional path. It is source-reviewed and was not executed by the documentation workflow.

**Returns**

Exactly the result of `System.SysUtils.DirectoryExists(aFolder)` with default `FollowLink=True`.

**Implementation**

`uPSI_SysUtilsImport` registers the script name against `SysUtilsImport.FolderExists`. That wrapper contains only `Result := SysUtils.DirectoryExists(aFolder)`. It does not call a distinct Delphi `FolderExists` routine and adds no logging, normalisation, retries or policy checks.

**Side effects**

No persistent change. The terminal Windows routine can briefly open a reparse target.

**Performance and concurrency**

The same storage and concurrency considerations as `DirectoryExists` apply, including remote-path latency and time-of-check/time-of-use races.

**Related entries**

- [`DirectoryExists`](DirectoryExists.md) is the canonical equivalent and contains the full terminal behaviour.
- [`ForceFolders`](ForceFolders.md) is the naming alias for recursive directory creation.
- [`CheckFolder`](CheckFolder.md) is a separate Velox-owned function.

**External references**

There is no separate Delphi or Free Pascal `FolderExists` terminal in this path. The alias terminates in:

- [Embarcadero `System.SysUtils.DirectoryExists`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.DirectoryExists)
- [Free Pascal `DirectoryExists`](https://www.freepascal.org/docs-html/rtl/sysutils/directoryexists.html) - compatibility context only; Velox uses installed Delphi source.

<small>Created 2026-07-15</small>
