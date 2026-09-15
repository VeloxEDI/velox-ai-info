---
title: "Config"
description: "Configuration, environment, identity, path, setting, secret and mapping values available to Velox scripts."
sidebar_position: 2
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variables
  - configuration
  - secrets
---

The Config group exposes information about the Velox host and its configured environment. It contains three different kinds of entry, and their lifecycle matters:

- **compile-time constants** such as [`DefaultDir`](Config/DefaultDir.md), [`TestMode`](Config/TestMode.md), [`VeloxWebAdmin`](Config/VeloxWebAdmin.md) and [`AzureSecret`](Config/AzureSecret.md) are snapshots copied into the script compiler;
- **live host objects** such as [`Settings`](Config/Settings.md), [`Mappings`](Config/Mappings.md), [`AzureSecrets`](Config/AzureSecrets.md) and [`Setup`](Config/Setup.md) expose shared process state and may query or modify external systems; and
- **function-backed values** query cached product state, the filesystem or Windows when called.

Do not assume that an entry categorized as a variable is a cheap field read. Path functions can check/create directories, Windows identity functions can fail, Settings and Mappings can execute SQL, and AzureSecrets can make an authenticated network request. Follow the individual page's error, caching, ownership and security contract.

## Selection guide

- Use [`AppDataPath`](Config/AppDataPath.md) and its named `AppData*` children for machine-wide Velox storage.
- Use [`UserDataConfigPath`](Config/UserDataConfigPath.md) for configuration private to the Windows account executing the process.
- Use [`AppPath`](Config/AppPath.md), [`AppName`](Config/AppName.md) and [`AppTitle`](Config/AppTitle.md) only when actual host-executable identity is relevant.
- Use the three `GetComputerNameEx*` functions for DNS host/domain diagnostics and [`GetUserNameExString`](Config/GetUserNameExString.md) for the current SAM-compatible execution identity. These values are context, not authentication or authorization.
- Use Settings for governed typed values from the Velox `[Setting]` table and Mappings for named database-backed translations. Use fixed Code Library constants/functions when the product contract is fixed rather than configurable.
- Use AzureSecrets for named Key Vault values. Avoid the broad AzureSecret client credential unless legacy code specifically requires it.

## Safety and lifecycle

The four live objects are host-owned; never call `Free` on them. Their child caches are shared across scripts in the same process. Cache-clear/remove methods can invalidate references held elsewhere, while edits to returned child objects generally change only cached/in-memory state unless the called method explicitly performs a database write.

Compile-time constants do not automatically refresh. A General Setup or test/production mode change affects scripts compiled afterward; do not treat an old compiled constant as a fresh environment check. Secret constants and fetched Key Vault values can remain in process/script memory, so never log, return or persist them unnecessarily.

The generated child navigation below is the authoritative complete list of Config entries.

<small>Created 2026-07-19</small>
