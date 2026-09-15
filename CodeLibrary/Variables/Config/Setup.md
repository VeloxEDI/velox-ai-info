---
title: "Setup"
description: "Exposes the live host-owned General Setup module and its script-registered property subset."
sidebar_position: 28
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - config
  - general-setup
  - module
---

```Delphi
Setup: TvxSetup
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Setup.VeloxWebUrl;
end;
```

### Usage

`Setup` provides the currently loaded General Setup values that Velox exposes to scripts.

**Changing values**

Changing a property changes the shared value immediately but does **not** save General Setup. The change can affect other flows in the same Velox process and can be lost when configuration is reloaded. Treat these properties as read-only in normal scripts and make durable changes through the governed General Setup process.

`EmailBody` is a live list. Changing its lines changes the value seen by other work using the same setup. Avoid editing it while other actions can be using it; assign a complete intended value through a governed configuration change instead.

Additional available members are documented under [`TvxSetup`](../../Classes/Modules/TvxSetup.md). Some can query, save, log or change configuration; use only the member needed for the documented flow.

### Additional Technical Info
`Setup` is the current process-global `TvxSetup` General Setup module.

Velox always declares the variable, then binds it to `gSetup` only when that global is assigned. Normal successful compilation already assumes `gSetup` is available because constant registration unconditionally locks it; the conditional runtime binding mainly protects abnormal lifecycle/reference contexts. The instance is host-owned; never replace or free it.

**Properties registered for scripts**

| Property | Script access | Meaning |
|---|---|---|
| `FromEmail`, `FromDisplayName`, `AdminEmail`, `NotifyEmail` | read/write | email identity/recipients |
| `EmailBody` | read/write `TStringList` | shared email body list |
| `SMTPServer` | read/write | SMTP host text |
| `VeloxAPIDomain`, `VeloxAPIPort` | read/write | API endpoint parts |
| `VeloxAPIUrl` | read-only | computed `http`/`https` URL from Setup SSL/domain/port |
| `VeloxWebDomain`, `VeloxWebPort` | read/write | Web endpoint parts |
| `VeloxWebUrl` | read-only | computed HTTPS URL with trailing slash |
| `VeloxWebInstallPath` | **unusable** | product property is string, compile import incorrectly declares `integer`, and runtime import registers no property helper |
| `EnableLogUserReporting` | read/write | live reporting flag |
| `DefaultFilePath` | read/write | shared default path; non-empty assignments gain a trailing delimiter |

Do not access `VeloxWebInstallPath` from PascalScript until both the compile-time type and missing runtime registration are corrected in the product.

<small>Created 2026-07-19</small>
