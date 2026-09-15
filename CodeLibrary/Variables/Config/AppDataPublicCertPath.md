---
title: "AppDataPublicCertPath"
description: "Returns the Public child path below the shared Velox Certificate directory."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - public-certificate
  - path
---

```Delphi
Function AppDataPublicCertPath : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AppDataPublicCertPath + 'partner-public.pem';
end;
```

### Usage

`AppDataPublicCertPath` returns the Public child path below the shared Velox Certificate directory.

### Additional Technical Info
`AppDataPublicCertPath` returns the configured machine-wide path for public certificate material.

With the default root the value is normally `C:\ProgramData\Velox\Certificate\Public\`, including its trailing backslash.

**Implementation and behaviour**

The implementation calls [`AppDataCertificatePath`](AppDataCertificatePath.md) and appends the literal `Public\`. The parent call checks and may create `Certificate\`; the resulting `Public\` child is **not** checked or created by this function. A returned path can therefore name a directory that is currently absent.

The accessor does not load a certificate, determine trust, verify a chain, select a format or validate an appended filename. Public certificates are less sensitive than private keys, but their replacement can still change encryption or trust behaviour. Apply appropriate write controls and deploy updates deliberately.

The parent lookup can perform filesystem I/O and its exceptions propagate. Velox's path lock is process-local and does not coordinate certificate replacement across services or machines.

**Related entries and official references**

- [`AppDataPrivateCertPath`](AppDataPrivateCertPath.md) is the private-key location and requires stricter access controls.
- [Embarcadero: ForceDirectories](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal: ForceDirectories](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) (compatibility reference)

<small>Created 2026-07-19</small>
<small>Created 2026-07-15</small>
