---
title: "AppDataCertificatePath"
description: "Returns the shared Velox Certificate directory, creating the directory tree when it is missing."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - certificate
  - path
---

```Delphi
Function AppDataCertificatePath : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AppDataCertificatePath + 'partner-ca.pem';
end;
```

### Usage

`AppDataCertificatePath` returns the shared Velox Certificate directory, creating the directory tree when it is missing.

### Additional Technical Info
`AppDataCertificatePath` returns the machine-wide directory in which Velox certificate material is stored.

For the default installation the result is normally `C:\ProgramData\Velox\Certificate\`. The result includes a trailing backslash.

**Implementation and side effects**

The PascalScript import calls `vxConfigPath.AppDataCertificatePath`, which calls `GetAppDataPath('Certificate\')`. `GetAppDataPath` appends that literal folder to the cached [`AppDataPath`](AppDataPath.md), checks whether the resulting directory exists, and calls Delphi's `ForceDirectories` when it does not.

Reading this value can therefore touch the filesystem and attempt to create directories. Velox serializes the path check and creation with its process-wide path critical section. It ignores the Boolean result from `ForceDirectories`, so a returned string does not prove the directory now exists or is writable. Any exception that is raised propagates to the script.

The directory is shared by Designer and service processes that resolve the same application-data root. Do not put private keys directly in this parent merely because its name mentions certificates; use [`AppDataPrivateCertPath`](AppDataPrivateCertPath.md) and apply operating-system permissions appropriate to secrets.

**Related entries and official references**

- [`AppDataPrivateCertPath`](AppDataPrivateCertPath.md) and [`AppDataPublicCertPath`](AppDataPublicCertPath.md) append the designated child folder names.
- [Embarcadero: ForceDirectories](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal: ForceDirectories](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) (compatibility reference; Velox executes Delphi RTL)

<small>Created 2026-07-19</small>
<small>Created 2026-07-15</small>
