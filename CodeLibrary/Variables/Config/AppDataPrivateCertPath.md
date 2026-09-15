---
title: "AppDataPrivateCertPath"
description: "Returns the Private child path below the shared Velox Certificate directory."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - private-key
  - certificate
---

```Delphi
Function AppDataPrivateCertPath : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AppDataPrivateCertPath + 'partner-private.pem';
end;
```

### Usage

`AppDataPrivateCertPath` returns the Private child path below the shared Velox Certificate directory.

### Additional Technical Info
`AppDataPrivateCertPath` returns the designated location for private certificate/key files.

The default result is normally `C:\ProgramData\Velox\Certificate\Private\`, including the trailing backslash.

**Implementation quirk**

The function evaluates [`AppDataCertificatePath`](AppDataCertificatePath.md) and concatenates the literal `Private\`. Evaluating the parent accessor checks and may create the `Certificate\` directory, but this function does **not** check or create the `Private\` child itself. Code that writes a private-key file must therefore be prepared for the child directory to be absent.

No file existence, extension, certificate format, encryption, ACL or key-permission validation is performed. The path is shared at machine scope. Restrict access to the service identities and administrators that require it; never place key material into documentation, logs, script source or exception messages. Do not derive a filename directly from untrusted partner data without validation.

The string operation is cheap after the parent check, but the parent call may perform filesystem I/O. Any resulting filesystem exception propagates, while a non-exceptional failed `ForceDirectories` call on the parent is ignored.

**Related entries and official references**

- [`AppDataPublicCertPath`](AppDataPublicCertPath.md) is the parallel public-certificate location.
- [Embarcadero: ForceDirectories](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ForceDirectories)
- [Free Pascal: ForceDirectories](https://www.freepascal.org/docs-html/rtl/sysutils/forcedirectories.html) (compatibility reference)

<small>Created 2026-07-19</small>
<small>Created 2026-07-15</small>
