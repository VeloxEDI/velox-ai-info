---
title: "AppDataLogPath"
description: "Returns the shared Velox Log directory and attempts to create the directory tree on demand."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - log
  - path
---

```Delphi
Function AppDataLogPath : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AppDataLogPath + 'CustomIntegration.log';
end;
```

### Usage

`AppDataLogPath` returns the shared Velox Log directory and attempts to create the directory tree on demand.

### Additional Technical Info
`AppDataLogPath` returns the shared directory used for Velox log and diagnostic files.

Under the default installation it normally returns `C:\ProgramData\Velox\Log\`, with a trailing backslash.

**Implementation and operational guidance**

The registered function calls `GetAppDataPath('Log\')`. If the directory does not exist, that helper calls `ForceDirectories` while holding the process-wide path critical section. The return value from `ForceDirectories` is not checked, so the returned string is a location convention rather than an availability guarantee.

Multiple Designer/service processes may write beneath the same root. A script that creates its own log must choose a collision-safe name, define encoding and rotation, avoid logging credentials or payload secrets, and release file handles promptly. This accessor does not use Velox's structured logging services and does not itself create, append, rotate or secure a log file.

Directory checks can block on the filesystem, and exceptions propagate. The in-process lock only protects Velox path-helper activity; it does not serialize arbitrary script file writes or other processes.

**Related entries and official references**

- [`AppDataPath`](AppDataPath.md) documents shared-root initialization.
- [`AppDataTempPath`](AppDataTempPath.md) is for temporary rather than diagnostic data.
- [Embarcadero: ForceDirectories](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal: ForceDirectories](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) (compatibility reference)

<small>Created 2026-07-19</small>
<small>Created 2026-07-15</small>
