---
title: "AppDataDataPath"
description: "Returns the shared Velox Data directory and attempts to create it when absent."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - data
  - path
---

```Delphi
Function AppDataDataPath : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AppDataDataPath + 'ReferenceData.json';
end;
```

### Usage

`AppDataDataPath` returns the shared Velox Data directory and attempts to create it when absent.

### Additional Technical Info
`AppDataDataPath` returns the `Data\` subdirectory of Velox's shared application-data root.

The default installation normally produces `C:\ProgramData\Velox\Data\`. The string ends in a backslash so it can be concatenated with a filename.

**Implementation and behaviour**

The PascalScript binding calls `vxConfigPath.AppDataDataPath`, which is a one-line call to `GetAppDataPath('Data\')`. The helper checks the composed directory and invokes `ForceDirectories` when necessary under a process-local critical section.

This path is application file storage and is unrelated to the VxData database or the script's `DATA_*` datasets. The function does not connect to a database, choose a transaction, create a file or validate a filename. Designer, VeloxService and VeloxAPIService can share the directory when configured to use the same application-data root.

The lookup can perform filesystem I/O and directory creation. Since Velox ignores `ForceDirectories`' return value, the path can be returned even after a non-exceptional creation failure. File operations must handle missing-directory, permission, sharing and disk errors themselves.

**Related entries and official references**

- [`AppDataFilePath`](AppDataFilePath.md) is the separate general file area.
- [`AppDataPath`](AppDataPath.md) explains how the root is resolved.
- [Embarcadero: ForceDirectories](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal: ForceDirectories](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) (compatibility reference)

<small>Created 2026-07-19</small>
<small>Created 2026-07-15</small>
