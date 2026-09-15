---
title: VeloxWebInstallPath
description: Documents an unusable generated property whose Integer compiler declaration has no runtime binding to the native String setting.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, setup, web-install-path, registration-mismatch]
---

```Delphi
property VeloxWebInstallPath: Integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  // Do not access Setup.VeloxWebInstallPath in scripts:
  // its compile-time declaration and runtime registration are broken.
  Value := Null;
end;
```

### Usage

Do not read or assign `VeloxWebInstallPath` from a current Velox script. The exposed property is unusable: its declared type and executable access do not agree.

Manage the Velox Web installation directory through governed host setup instead. Do not substitute [`VeloxWebUrl`](VeloxWebUrl.md), which is a web address rather than the server filesystem path.

### Additional Technical Info
`VeloxWebInstallPath` is present in generated Code Library structure but is **not a usable script property in the current product**.

**Registration mismatch**

The script compiler declares:

The runtime importer registers no getter or setter for that name. The native setup class actually defines a read/write **String**. Code can therefore appear to compile against the wrong type but cannot be reliably bound/executed at runtime. Do not use, test or feature-detect it from a production script.

This documentation records the current defect for diagnosis; it does not promote the native property into the public scripting contract. A future product fix must make the compiler type and runtime helper agree before script access is supported.

**Native setting behaviour (host code only)**

The host's native String setting stores the Velox web installation base. New setup defaults to a test/production IIS path according to mode. Its setter always calls Delphi `IncludeTrailingPathDelimiter`; unlike `DefaultFilePath`, an empty input is not special-cased and becomes a platform separator.

Host code appends `wwwroot\openapi\` to locate generated OpenAPI files and stores a derived copy during setup save. The setter does not validate containment, create the directory, check service identity access or deploy the website.

Do not confuse this server filesystem path with [`VeloxWebUrl`](VeloxWebUrl.md). Exposing or changing it can disclose/redirect web-root file access and requires governed host configuration.

**Delphi/Free Pascal references**

- [Embarcadero `System.SysUtils.IncludeTrailingPathDelimiter`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IncludeTrailingPathDelimiter) — native host setter terminal.
- [Free Pascal `IncludeTrailingPathDelimiter`](https://www.freepascal.org/docs-html/rtl/sysutils/includetrailingpathdelimiter.html) — compatible behaviour, including empty-input delimiter output.

<small>Created 2026-07-15</small>
