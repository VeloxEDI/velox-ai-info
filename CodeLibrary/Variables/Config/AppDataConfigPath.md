---
title: "AppDataConfigPath"
description: "Returns the shared Velox Config directory and attempts to create it when it is missing."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - path
  - machine-wide
---

```Delphi
Function AppDataConfigPath : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AppDataConfigPath + 'Integration.cfg';
end;
```

### Usage

`AppDataConfigPath` returns the shared Velox Config directory and attempts to create it when it is missing.

### Additional Technical Info
`AppDataConfigPath` returns the `Config\` directory under Velox's machine-wide application-data root.

The normal default is `C:\ProgramData\Velox\Config\`; the exact root can be changed by the process installation's `AppDataFolder.cfg`. The result includes a trailing backslash.

**Implementation and behaviour**

The script registration directly invokes `vxConfigPath.AppDataConfigPath`. It delegates to `GetAppDataPath('Config\')`, which concatenates the cached [`AppDataPath`](AppDataPath.md), checks the directory, and invokes `ForceDirectories` if it is absent. The path critical section serializes those operations within the current process.

This is shared configuration storage, not the signed-in user's configuration folder. Use [`UserDataConfigPath`](UserDataConfigPath.md) for per-user Designer state. A service normally runs under a different account but can resolve the same machine-wide path; actual access remains subject to Windows ACLs and service identity.

Reading the function can perform filesystem I/O. The implementation ignores `ForceDirectories`' Boolean result, so callers that intend to write should handle the write failure rather than treating this string as proof of availability. The function does not validate a filename appended by the script, prevent traversal, or open any file.

**Related entries and official references**

- [`AppDataPath`](AppDataPath.md) explains root selection and caching.
- [`UserDataConfigPath`](UserDataConfigPath.md) is the per-user alternative.
- [Embarcadero: ForceDirectories](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal: ForceDirectories](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) (compatibility reference)

<small>Created 2026-07-19</small>
<small>Created 2026-07-15</small>
