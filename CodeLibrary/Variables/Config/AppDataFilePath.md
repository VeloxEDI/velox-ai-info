---
title: "AppDataFilePath"
description: "Returns the shared Velox Files directory, attempting recursive directory creation when needed."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - files
  - path
---

```Delphi
Function AppDataFilePath : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AppDataFilePath + 'Outbound\payload.xml';
end;
```

### Usage

`AppDataFilePath` returns the shared Velox Files directory, attempting recursive directory creation when needed.

### Additional Technical Info
`AppDataFilePath` returns Velox's machine-wide `Files\` directory.

The usual default is `C:\ProgramData\Velox\Files\`, including the trailing backslash.

**Implementation and file handling**

The script call reaches `vxConfigPath.AppDataFilePath` and then `GetAppDataPath('Files\')`. The helper creates the `Files\` directory tree if the composed directory is not present. It does not create additional subdirectories from a filename later appended by the script; the example's `Outbound\` folder must already exist or be created separately.

The result is shared process configuration, not a unique working directory. Scripts must avoid filename collisions, incomplete-file pickup and unsafe construction from external input. Prefer a write-to-temporary-then-rename pattern where another monitor can observe the directory, and validate any partner-supplied path components before concatenation.

Reading the value can perform I/O. Velox ignores the Boolean result from `ForceDirectories`, so a caller must still handle failures on the actual open/write. The process-local critical section does not coordinate file naming or contents across different processes.

**Related entries and official references**

- [`AppDataTempPath`](AppDataTempPath.md) identifies Velox's shared temporary directory.
- [`AppDataDataPath`](AppDataDataPath.md) is the separate application-data area.
- [Embarcadero: ForceDirectories](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal: ForceDirectories](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) (compatibility reference)

<small>Created 2026-07-19</small>
<small>Created 2026-07-15</small>
