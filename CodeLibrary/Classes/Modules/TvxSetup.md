---
title: TvxSetup
description: Represents the host-owned process-global Velox setup used by scripts, email, files and API/web integrations.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, setup, global-configuration, email, api]
---

```Delphi
TvxSetup = class(TvxModule)
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Setup <> nil then
    Value := Setup.VeloxAPIUrl
  else
    Value := Null;
end;
```

### Usage

`TvxSetup` represents the Velox-provided shared across the Velox process Velox setup used by scripts, email, files and API/web integrations.

**Acquisition and ownership**

Scripts do not construct this class. Use the global [`Setup`](../../Variables/Config/Setup.md) reference and check it for nil. Velox binds the Velox-provided singleton when General Setup has been created and loaded.

Do not free, replace or retain the object beyond the current script execution. It is shared by unrelated actions and services in the same process, so a property assignment is a global configuration mutation rather than action-local state.

### Additional Technical Info
`TvxSetup` is Velox's shared General Setup module. It supplies process-wide defaults for email, filesystem paths, reporting and Velox API/web addresses.

**Script-visible members**

- Email defaults: [`AdminEmail`](TvxSetup/Properties/AdminEmail.md), [`NotifyEmail`](TvxSetup/Properties/NotifyEmail.md), [`FromEmail`](TvxSetup/Properties/FromEmail.md), [`FromDisplayName`](TvxSetup/Properties/FromDisplayName.md), [`EmailBody`](TvxSetup/Properties/EmailBody.md) and [`SMTPServer`](TvxSetup/Properties/SMTPServer.md).
- File default: [`DefaultFilePath`](TvxSetup/Properties/DefaultFilePath.md).
- Logging flag: [`EnableLogUserReporting`](TvxSetup/Properties/EnableLogUserReporting.md).
- API address: [`VeloxAPIDomain`](TvxSetup/Properties/VeloxAPIDomain.md), [`VeloxAPIPort`](TvxSetup/Properties/VeloxAPIPort.md) and computed [`VeloxAPIUrl`](TvxSetup/Properties/VeloxAPIUrl.md).
- Web address: [`VeloxWebDomain`](TvxSetup/Properties/VeloxWebDomain.md), [`VeloxWebPort`](TvxSetup/Properties/VeloxWebPort.md) and computed [`VeloxWebUrl`](TvxSetup/Properties/VeloxWebUrl.md).
- [`VeloxWebInstallPath`](TvxSetup/Properties/VeloxWebInstallPath.md) is generated from a compiler declaration but is not usable because its compile-time type and runtime registration do not match the native property.

There is no script-visible constructor, reload or save method on this class. Inherited members remain documented at their declaring classes.

**Locking, mutation and durability**

Each visible scalar getter/setter locks the setup object around one field operation. A computed URL locks while reading all its contributing fields. This does not make a sequence of separate script reads/writes transactional, and it does not protect consumers after they have copied a value.

`EmailBody` is the exception: its getter returns the owned live list after releasing the lock, so later list edits are unsynchronised. Its property setter copies items under the lock.

A setter changes the in-memory singleton immediately but does not call the setup SaveModule operation. The value can be lost or replaced by reload/restart, or included if host code later explicitly saves the setup. Use the General Setup workflow for governed durable changes.

**When consumers see changes**

| Setting group | Typical consumption |
|---|---|
| Email sender/server/body/admin defaults | Copied when a new email helper is constructed; an existing helper keeps its snapshot. |
| Admin/notification action recipients | Read and tag-processed when action recipient defaults are resolved. |
| DefaultFilePath | Copied into several file/action/transport objects and compile-time constants; existing instances can retain their older value. |
| API/web URLs | Computed on each property read; service/REST objects can separately snapshot fields and listeners are not restarted by a setter. |
| EnableLogUserReporting | Stored and transferred, but the current product source has no operational consumer beyond setup/script access. |

**Security and operational boundaries**

Changing this object can redirect notification email, change sender identity, alter future file paths or redirect API calls for other executions. Validate and authorise values before assignment, avoid secrets in domains/paths/body text, and never treat a successful setter as proof that a directory, mail server, URL, certificate or listener works.

Concurrent scripts can observe mixed configurations between separate property calls. Prefer read-only access during execution and perform persistent global changes through controlled administration and change management.

<small>Created 2026-07-15</small>
