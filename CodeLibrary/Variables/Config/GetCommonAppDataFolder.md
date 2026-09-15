---
title: "GetCommonAppDataFolder"
description: "Re-resolves and attempts to create the configured machine-wide Velox application-data root."
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - programdata
  - windows
---

```Delphi
Function GetCommonAppDataFolder : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetCommonAppDataFolder;
end;
```

### Usage

`GetCommonAppDataFolder` re-resolves and attempts to create the configured machine-wide Velox application-data root.

### Additional Technical Info
`GetCommonAppDataFolder` asks Windows for the current common application-data directory, appends Velox's startup-configured folder text and attempts to create the result.

Unlike [`AppDataPath`](AppDataPath.md), which returns a startup-cached complete root, this function calls `SHGetFolderPath(CSIDL_COMMON_APPDATA or CSIDL_FLAG_CREATE)` each time. The appended folder text was still cached during startup from executable-adjacent `AppDataFolder.cfg` or default `Velox\`.

On successful Windows lookup, Velox adds a trailing delimiter to the returned common path, appends the configured text, and calls `ForceDirectories` if the result is absent. The Boolean creation result is ignored, so the string can be returned even when the directory was not created. Exceptions propagate. If `SHGetFolderPath` fails, the function silently returns fixed `C:\ProgramData\Velox\` and does not apply custom text in that branch.

The operation is serialized only within the current process by `gPathCritSect`. Other processes can concurrently create/delete the same directory. Windows redirection and ACLs can make the actual common folder differ from a literal `C:\ProgramData` assumption.

**Official references**

- [Microsoft: SHGetFolderPath](https://learn.microsoft.com/en-us/windows/win32/api/shlobj_core/nf-shlobj_core-shgetfolderpatha)
- [Microsoft: CSIDL_COMMON_APPDATA](https://learn.microsoft.com/en-us/windows/win32/shell/csidl)
- [Embarcadero: ForceDirectories](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal: ForceDirectories](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) (compatibility reference)

<small>Created 2026-07-19</small>
