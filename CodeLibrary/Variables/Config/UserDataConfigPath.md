---
title: "UserDataConfigPath"
description: "Returns and attempts to create the Config directory beneath the process-cached current-user Velox data root."
sidebar_position: 31
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - localappdata
  - user-settings
---

```Delphi
Function UserDataConfigPath : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := UserDataConfigPath + 'MyDesignerState.ini';
end;
```

### Usage

`UserDataConfigPath` returns and attempts to create the Config directory beneath the process-cached current-user Velox data root.

### Additional Technical Info
`UserDataConfigPath` returns the `Config\` directory under the user-specific Velox root cached during process startup.

The cached root initially comes from [`GetUserAppDataFolder`](GetUserAppDataFolder.md), normally beneath the executing account's local AppData. The function calls `GetUserDataPath('Config\')`, checks the directory and invokes `ForceDirectories` if absent. The result includes a trailing backslash.

Directory work occurs under the process path critical section, but the Boolean `ForceDirectories` result is ignored. A string can therefore be returned even when the folder was not created or writable; actual file operations must handle failures. If startup's Windows folder lookup failed, the cached user root is empty, so concatenation can yield the relative `Config\` path and attempt creation relative to the process current directory.

The identity is the account running the process. Designer and service executions normally resolve different profiles. Use this for genuinely per-account state, not for configuration that every Velox service/administrator must share. Validate appended filenames and avoid storing credentials in lightly protected user files.

**Official references**

- [Embarcadero: ForceDirectories](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal: ForceDirectories](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) (compatibility reference)

<small>Created 2026-07-19</small>
