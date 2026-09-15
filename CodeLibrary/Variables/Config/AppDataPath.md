---
title: "AppDataPath"
description: "Returns the process-cached machine-wide Velox application-data root selected during startup."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - programdata
  - path
---

```Delphi
Function AppDataPath : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AppDataPath;
end;
```

### Usage

`AppDataPath` returns the process-cached machine-wide Velox application-data root selected during startup.

**Startup resolution**

During `vxConfigPath` initialization, Velox determines the executable directory and looks for `AppDataFolder.cfg` beside that executable. If the file is absent, the configured folder text is `Velox\`. If present, Velox reads the complete file using a detected BOM or ASCII fallback and applies `IncludeTrailingPathDelimiter`; it does not trim whitespace, expand environment variables, canonicalize the value or reject relative/traversal text.

Velox then calls the legacy Windows `SHGetFolderPath` API with `CSIDL_COMMON_APPDATA or CSIDL_FLAG_CREATE`, appends the configured folder text and attempts `ForceDirectories`. If the Windows lookup fails, Velox returns the fixed fallback `C:\ProgramData\Velox\`, regardless of custom folder text. `ForceDirectories`' Boolean result is ignored.

The public function subsequently returns the cached `gAppDataPath` under a process-wide critical section. It performs no new folder lookup on each call. Editing `AppDataFolder.cfg` while a process is running has no effect until restart.

**Quirks and safety**

- The configuration file is treated as folder text appended to the common-app-data path; it is not a general validated absolute-path setting.
- A returned path does not prove that the directory exists or is writable.
- Different executables/installations can read different adjacent configuration files and therefore resolve different roots.
- Windows ACLs and the actual Designer/service account govern access. The value itself contains no credentials and grants no permissions.

### Additional Technical Info
`AppDataPath` returns the machine-wide root from which most Velox data, configuration, schema, script, certificate and log paths are derived.

The normal default is `C:\ProgramData\Velox\`. The result includes a trailing backslash and is cached for the lifetime of the current process.

**Official references**

- [Microsoft: SHGetFolderPath](https://learn.microsoft.com/en-us/windows/win32/api/shlobj_core/nf-shlobj_core-shgetfolderpatha)
- [Microsoft: CSIDL_COMMON_APPDATA](https://learn.microsoft.com/en-us/windows/win32/shell/csidl)
- [Embarcadero: IncludeTrailingPathDelimiter](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IncludeTrailingPathDelimiter)
- [Free Pascal: IncludeTrailingPathDelimiter](https://www.freepascal.org/docs-html/rtl/sysutils/includetrailingpathdelimiter.html) (compatibility reference)

<small>Created 2026-07-19</small>
<small>Created 2026-07-15</small>
