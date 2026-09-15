---
title: "Upgrade the Velox platform"
description: "Apply an approved Velox upgrade while preserving configuration, data and recovery options."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [Velox upgrade procedure, services, database upgrade]
---

Use this control sequence with the release-specific package instructions. It does not assert compatibility between arbitrary source and target versions.

## Before you begin

- Complete [readiness and backup](readiness-and-backup.md).
- Obtain the exact database and ProgramData update steps for the release.
- Confirm the current and target bitness and all required runtime libraries/drivers.
- Work in the approved maintenance window with rollback access.

## Upgrade sequence

1. Disable or pause new triggers using the environment's approved method, then let in-flight work reach the recorded safe state.
2. Stop Velox API Service and Velox Service gracefully. Confirm the processes have exited before replacing files.
3. Apply the approved VxConfig, VxLog and VxData database update scripts in the required order. Record script/version results; do not rely on service startup to upgrade schemas.
4. Replace the installed binaries and required runtime dependencies with the approved package. Preserve environment-owned configuration rather than overwriting it with sample defaults.
5. Apply reviewed ProgramData assets selectively. Compare `Connections.json`, schemas, scripts, certificates, templates and custom assets before replacement.
6. Confirm service image paths, bitness, accounts and `-c`/`-n`/test parameters still match the intended environment.
7. Start Velox Service and review startup/synchronisation evidence. Start Velox API Service only after the core configuration is healthy.
8. Keep normal schedules, monitors or external traffic controlled until post-upgrade validation passes.

:::caution Do not copy sample configuration over an environment
Installed defaults illustrate structure; they are not a replacement for environment-owned `Connections.json`, credentials, certificates or configuration modules.
:::

If any database update, binary load or service synchronisation check fails, stop the sequence. Do not continue into routine processing to “see if it works”. Use the recorded rollback decision and [post-upgrade recovery](post-upgrade-validation-and-recovery.md).
