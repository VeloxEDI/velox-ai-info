---
title: "AppDataTempPath"
description: "Returns Velox's shared persistent Temp directory rather than the operating-system user temp folder."
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - temp
  - path
---

```Delphi
Function AppDataTempPath : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AppDataTempPath + 'job-' + GetComputerNameExHostName + '.tmp';
end;
```

### Usage

`AppDataTempPath` returns Velox's shared persistent Temp directory rather than the operating-system user temp folder.

### Additional Technical Info
`AppDataTempPath` returns the shared `Temp\` directory under the Velox application-data root.

The default is normally `C:\ProgramData\Velox\Temp\`, including the final backslash.

**Implementation and lifecycle**

The function delegates to `GetAppDataPath('Temp\')`, which checks the directory and calls `ForceDirectories` when absent. This is not a call to Windows `GetTempPath`, and the result is not unique to a user, process, thread, flow or invocation. Content is not automatically deleted by this accessor.

Scripts must generate collision-resistant names, close/delete temporary artifacts in `finally` logic, and avoid assuming secrecy. Multiple Designer and service processes can use this directory concurrently. Do not expose credentials or decrypted payloads there without suitable file permissions and cleanup. For handoff to another process, use an atomic publication convention rather than writing directly to a final observable filename.

Reading the path may create directories. Because `ForceDirectories`' Boolean result is ignored, actual opens/writes remain the authoritative success test. Disk, ACL, sharing and cleanup failures are the caller's responsibility.

**Related entries and official references**

- [`AppDataFilePath`](AppDataFilePath.md) is intended for shared files with a longer lifecycle.
- [Embarcadero: ForceDirectories](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal: ForceDirectories](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) (compatibility reference)

<small>Created 2026-07-19</small>
<small>Created 2026-07-15</small>
