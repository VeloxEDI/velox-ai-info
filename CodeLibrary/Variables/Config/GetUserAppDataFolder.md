---
title: "GetUserAppDataFolder"
description: "Re-resolves and attempts to create the current Windows account's Velox local application-data root."
sidebar_position: 24
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - localappdata
  - user
---

```Delphi
Function GetUserAppDataFolder : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetUserAppDataFolder;
end;
```

### Usage

`GetUserAppDataFolder` re-resolves and attempts to create the current Windows account's Velox local application-data root.

### Additional Technical Info
`GetUserAppDataFolder` asks Windows for `CSIDL_LOCAL_APPDATA`, appends Velox's startup-configured folder text and attempts to create the resulting account-specific root.

For an interactive account the default is typically beneath `C:\Users\<account>\AppData\Local\Velox\`. A service resolves the profile of its service identity, not the Designer user's profile. Do not hard-code or compare the example path.

The Windows lookup and directory test occur on each call under Velox's process-local path lock. On success, the helper calls `ForceDirectories` if needed but ignores its Boolean result. On `SHGetFolderPath` failure it returns `''`, with no fixed fallback and no raised error. Filesystem exceptions can still propagate.

The folder text comes from the process's cached `AppDataFolder.cfg` setting and is not re-read here. A returned string does not prove the folder exists or is writable. Avoid using per-user storage for files that Velox services must share unless the account and deployment contract explicitly match.

**Official references**

- [Microsoft: SHGetFolderPath](https://learn.microsoft.com/en-us/windows/win32/api/shlobj_core/nf-shlobj_core-shgetfolderpatha)
- [Microsoft: CSIDL_LOCAL_APPDATA](https://learn.microsoft.com/en-us/windows/win32/shell/csidl)
- [Embarcadero: ForceDirectories](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal: ForceDirectories](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) (compatibility reference)

<small>Created 2026-07-19</small>
