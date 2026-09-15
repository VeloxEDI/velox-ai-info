---
title: "System and runtime settings"
description: "Configure shared Velox service state, runtime folders, users and diagnostic behaviour."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [General Setup, runtime settings, service users, DefaultFilePath]
---

These General Setup values are shared by Designer and runtime services for the selected configuration. Record the current context and restart/revalidate consumers when live refresh is not explicitly verified.

## Runtime and service fields

| UI purpose / property | Type and default | Runtime effect and cautions |
| --- | --- | --- |
| Default file path / `DefaultFilePath` | folder / empty | Resolves `<DEFAULTDIR>` for File Connections and LAN Transports. Non-empty values gain a trailing delimiter. Service identities require access. |
| Maximum wait before termination / `MaxWaitBeforeTermination` | seconds / `3600` | Upper wait used by shutdown-related behaviour. Do not shorten without understanding long-running Flow effects. |
| Service users / `ServiceUsers` | username list / empty | Used when deciding whether a user is allowed service controls; matching considers exact, domain-stripped and `.\user` forms. It does not replace Windows service rights. |
| Service state / `ServiceState` | Enabled/disabled / enabled | Controls Velox processing state separately from Windows service start/stop. |
| Background colour / `BackgroundColour` | colour / silver | Designer display setting; no integration runtime effect. |

## Behaviour and diagnostics

| Property | Boolean default | Verified effect / qualification |
| --- | --- | --- |
| `DetailedSystemAudit` | `true` | Enables detailed system audit output. More detail can increase stored/logged data. |
| `ReloadModuleOnError` | `true` | Runtime reload behaviour flag; exact reload points vary, so verify the affected Flow/module. |
| `CacheManualActions` | `false` | Controls manual-Flow caching behaviour. Retest manual runs after changing it. |
| `EnableDiffMergeEdit` | `false` | Enables Designer diff/merge editing where supported. |
| `SQL2014Support` | `false` | Affects SQL/log persistence compatibility behaviour. Change only for a verified database requirement. |
| `EnableDebug` | `false` | Enables global audit debug output; use temporarily and protect logs. |
| `EnableMemCheck` | `false` | Enables FastMM diagnostic mode; intended for controlled diagnosis. |
| `ShutdownMemDump` | `false` | Persisted flag; complete runtime effect is not verified, so do not use without product guidance. |
| `AllModulesUpdated`, `Initialised` | `false` | Internal state flags; not routine tuning controls. |

Save, restart/reload the affected process, run a controlled Flow and inspect logs/memory/process behaviour. See [logging and reporting settings](logging-and-reporting.md) for related options.
