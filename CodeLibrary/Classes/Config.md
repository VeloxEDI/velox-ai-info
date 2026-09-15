---
title: Config
description: Configuration-backed helper classes for shared variables, mappings and external secret lookup.
sidebar_position: 2
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, classes, configuration, variables, mappings]
---

Config classes expose shared configuration and cached lookup objects used across Velox script executions.

## Contents

- [`TvxAzureSecretList`](Config/TvxAzureSecretList.md) provides the process-global Azure Key Vault-backed secret cache.
- [`TvxMappingItem`](Config/TvxMappingItem.md) and [`TvxMappingList`](Config/TvxMappingList.md) provide reusable configured value mappings.
- [`TvxVariable`](Config/TvxVariable.md) represents a typed/mutable variable and its conversions.
- [`TvxVariableList`](Config/TvxVariableList.md) provides the shared lazy code-indexed list inherited by settings, globals, locals and Azure secrets.

## Ownership and lifetime

Most Config objects are host-owned globals, cached module children or values returned by another host-owned list. A script-visible type does not imply that its constructor is available. Follow each class/member's acquisition guidance, never free borrowed objects and do not retain references across configuration reload, mode changes or cache invalidation.

Some objects are process-global. Writing a variable or mapping can affect other actions/threads and does not necessarily persist configuration. Conversely, a saved configuration can cause the host to free/reload cached objects and invalidate references.

## Effects and security

A simple-looking index access can perform database or authenticated network I/O on a cache miss. Results—including failures—can be cached. Treat lookup calls as effectful until the member page says otherwise, keep them outside record loops when practical and distinguish a cached `Null` from an intentionally empty value.

Config values can contain credentials, personal data, routing values and SQL/URL fragments. Do not log or expose them without classification. Validate dynamic keys, coordinate shared mutation and use purpose-specific safe conversions rather than concatenating raw values into SQL, paths, URLs or message headers.

## Related documentation

- [`Variables > Config`](../Variables/Config.md) lists the global variables through which scripts normally acquire these objects.
- [`Modules`](Modules.md) covers configured/executing Velox module instances rather than shared helper caches.

<small>Created 2026-07-15</small>
