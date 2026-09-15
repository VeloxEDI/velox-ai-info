---
title: "AppDataCookiePath"
description: "Returns the shared Velox Cookies directory, creating its directory tree when required."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - cookies
  - security
---

```Delphi
Function AppDataCookiePath : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AppDataCookiePath + 'PartnerPortal.cookies';
end;
```

### Usage

`AppDataCookiePath` returns the shared Velox Cookies directory, creating its directory tree when required.

### Additional Technical Info
`AppDataCookiePath` returns the shared Velox directory intended for persisted HTTP cookie data.

With the default root it normally returns `C:\ProgramData\Velox\Cookies\`, including the final backslash.

**Implementation and security boundary**

The imported function calls `GetAppDataPath('Cookies\')`. That helper appends the folder name to the cached [`AppDataPath`](AppDataPath.md), tests for the directory and calls `ForceDirectories` while holding Velox's process-wide path lock when it is missing.

The returned directory is machine-wide, not isolated per Windows user, flow, partner or execution. Cookie files may contain authenticated session state. A script must choose unambiguous filenames, avoid cross-partner reuse, protect the directory with appropriate ACLs and avoid exposing cookie content in logs or errors. The function itself provides no encryption, tenant partitioning, expiry processing or filename sanitization.

Reading the value may create directories. The `ForceDirectories` result is ignored, so receiving a path does not establish that the directory exists or that the current account may read or write it. Concurrent Velox processes have separate locks and can still act on the same directory; ordinary filesystem semantics decide the result.

**Related entries and official references**

- [`AppDataPath`](AppDataPath.md) defines the shared root.
- [Embarcadero: ForceDirectories](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal: ForceDirectories](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) (compatibility reference)

<small>Created 2026-07-19</small>
<small>Created 2026-07-15</small>
