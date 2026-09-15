---
title: "CheckFolder"
description: "Ensures the directory portion of a file path exists, creating missing parents when required."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - directory
  - create
---

```Delphi
Function CheckFolder(aFilePath : string): boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := CheckFolder('C:\Fictional\Inbound\order.xml');
end;
```

### Usage

`CheckFolder` ensures the directory portion of a file path exists, creating missing parents when required.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFilePath` | `string` | File path whose containing directory is required. This is not interpreted as a directory path unless it ends in a delimiter. |

**Returns**

`True` when the extracted directory already exists or [`ForceDirectories`](ForceDirectories.md) reports successful creation; `False` when creation returns false. Exceptions can replace the Boolean result.

**Behaviour**

- `'C:\Root\file.txt'` checks/creates `C:\Root\`.
- `'C:\Root\Child\'` keeps the final delimiter and checks/creates the full `Child` path.
- `'C:\Root\Child'` is treated as a file path and checks only `C:\Root\`; `Child` is not created.
- Existing directories cause no creation call.

**Important usage notes**

- A bare filename or empty string produces an empty extracted path. Current Velox `ForceDirectories('')` raises `EInOutError` rather than returning false.
- Parent directories are created first. A later failure can leave some new directories behind; there is no rollback.
- Relative paths depend on the Velox process current directory.
- Existing directories are not checked for later write permission.
- No filename, traversal, root-containment or allowed-location validation is performed.

**Usage notes**

Pass a complete file path, or include a trailing delimiter when the input itself is the directory to create. Validate and canonicalise untrusted paths under an approved root before calling.

### Additional Technical Info
`CheckFolder` extracts the directory portion of a file path, returns `True` when that directory already exists, or attempts to create the complete missing directory chain.

The example uses a fictional path and was not executed by the documentation workflow. A real call can create directories.

**Implementation**

The function first calls [`ExtractFilePath`](ExtractFilePath.md). If [`DirectoryExists`](DirectoryExists.md) is false for that extracted text, it assigns the result of installed Delphi `ForceDirectories`; otherwise it retains its initial `True` result.

**Side effects**

Can create one or more directories.

**Errors**

Empty paths, invalid syntax, permissions, unavailable storage and creation races can raise or cause `False`. Exceptions are not caught by this wrapper.

**Performance and concurrency**

Performs directory metadata queries and potentially one creation per missing level. Remote paths can block. Concurrent creators are tolerated only to the extent supported by `ForceDirectories`; the return is not a later access guarantee.

**Related entries**

- [`ForceDirectories`](ForceDirectories.md) accepts the directory path directly.
- [`DirectoryExists`](DirectoryExists.md) performs only the existence query.
- [`ExtractFilePath`](ExtractFilePath.md) defines which portion is retained.

**External references**

- [Embarcadero `System.SysUtils.ForceDirectories`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal `ForceDirectories`](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) - compatible recursive-creation context; installed Delphi and the Velox extraction wrapper define current behavior.

<small>Created 2026-07-15</small>
