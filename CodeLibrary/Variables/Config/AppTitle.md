---
title: "AppTitle"
description: "Returns the current Velox host executable filename with its final extension removed."
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - executable
  - title
---

```Delphi
Function AppTitle : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AppTitle;
end;
```

### Usage

`AppTitle` returns the current Velox host executable filename with its final extension removed.

### Additional Technical Info
`AppTitle` returns the current host executable filename without its final file extension—for example, `VeloxService` for `VeloxService.exe`.

**Implementation and limits**

During product unit initialization Velox first obtains [`AppName`](AppName.md) from `ExtractFileName(ParamStr(0))`, then calls `ChangeFileExt(gAppName, '')` and caches the result. `ChangeFileExt` changes the string only; it does not rename a file. Every script call returns the cached value under the path critical section.

The name is host- and deployment-dependent. It is not a human-readable window caption, licensed edition, environment name or trustworthy security identity. A renamed executable changes the value after the next process start. Avoid using it as a persistent key unless that dependency is explicitly part of the configuration contract.

The call has constant-time cached behaviour and no normal filesystem I/O. Use [`AppName`](AppName.md) when the extension is required and [`AppPath`](AppPath.md) for the containing directory.

**Official references**

- [Embarcadero: ChangeFileExt](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ChangeFileExt)
- [Free Pascal: ChangeFileExt](https://www.freepascal.org/docs-html/rtl/sysutils/changefileext.html) (compatibility reference; Velox executes Delphi RTL)

<small>Created 2026-07-19</small>
<small>Created 2026-07-15</small>
