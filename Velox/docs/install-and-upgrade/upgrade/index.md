---
title: "Upgrade Velox"
description: "Plan, perform, verify and recover a controlled Velox upgrade"
sidebar_position: 10
slug: /installation/upgrade-velox
classification: public
status: approved
owner: Cam Hart
keywords: [upgrade, rollback, database]
---

Upgrade only with a release-specific runbook that identifies compatible starting versions, binary and ProgramData changes, database scripts and rollback boundaries. Services do not establish that every required database upgrade has run.

## Plan and prepare

1. Confirm the supported starting and target releases and review release notes.
2. Inventory executables, ProgramData assets, system connections, service identities, modules and external dependencies.
3. Take and test restorable database and required filesystem/configuration backups.
4. Obtain approved packages, checksums and ordered VxConfig/VxData scripts.
5. Define downtime, verification, rollback decision point and owners.

## Upgrade

1. Disable triggers and stop Velox services so processing cannot change state.
2. Apply database changes in the runbook's order and verify each reported version.
3. Deploy the target binaries and matching ProgramData assets without mixing releases.
4. Preserve environment configuration while reconciling deliberate template changes.
5. Start Designer first and verify connections and configuration loading.
6. Start services, then complete the [installation verification](../install/verify-installation.md) before re-enabling work gradually.

## Recovery

Do not copy old binaries over a database already upgraded unless the runbook explicitly supports it. If the recovery threshold is reached, stop services and restore the coordinated database, binary and filesystem/configuration set. Reconcile any external side effects produced after the backup point.

## Detailed upgrade path

1. [Prepare and back up](readiness-and-backup.md).
2. Follow the [controlled upgrade procedure](upgrade-procedure.md).
3. [Validate or recover](post-upgrade-validation-and-recovery.md).

## Related task

- [Promote configuration](../../promote-and-govern/promote-configuration.md)
