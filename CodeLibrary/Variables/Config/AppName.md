---
title: "AppName"
description: "Returns the filename, including extension, of the Velox host executable running the script."
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - executable
  - process
---

```Delphi
Function AppName : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AppName;
end;
```

### Usage

`AppName` returns the filename, including extension, of the Velox host executable running the script.

### Additional Technical Info
`AppName` returns the filename of the executable hosting the current Velox process, including its extension—for example, `Velox.exe`, `VeloxService.exe` or `VeloxAPIService.exe`.

**Implementation**

During `vxConfigPath` unit initialization, Velox evaluates `ExtractFileName(ParamStr(0))` and stores the result in `gAppName`. Every script call returns that cached string under the process-wide path critical section. The value cannot change during the process lifetime and does not inspect the filesystem on each call.

This is a process identity hint, not a stable product-edition identifier or security assertion. The filename may be renamed by deployment, can differ between Designer and services, and should not be used to authorize work. Use it for diagnostics or carefully defined host-specific branching only; configuration is generally preferable to executable-name tests.

The value contains no directory. Use [`AppPath`](AppPath.md) for the executable directory or [`AppTitle`](AppTitle.md) for the cached name without its final extension.

**Official references**

- [Embarcadero: ParamStr](https://docwiki.embarcadero.com/Libraries/Athens/en/System.ParamStr)
- [Embarcadero: ExtractFileName](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.ExtractFileName)
- [Free Pascal: ParamStr](https://www.freepascal.org/docs-html/rtl/system/paramstr.html)
- [Free Pascal: ExtractFileName](https://www.freepascal.org/docs-html/rtl/sysutils/extractfilename.html) (compatibility references)

<small>Created 2026-07-19</small>
<small>Created 2026-07-15</small>
