---
title: "Maintain and recover Velox configuration"
description: "Plan coordinated backups, retention, maintenance and recovery"
sidebar_position: 60
slug: /administration/maintenance-and-recovery
classification: public
status: approved
owner: Cam Hart
keywords: [maintenance, backup, recovery]
---

Velox recovery can require configuration/log databases, VxData or other business databases, ProgramData assets, certificates, schemas, scripts and external-system reconciliation. A filesystem copy alone is not a complete backup.

1. Inventory the configuration context, databases, runtime folders, service identities and external dependencies.
2. Disable new processing and allow or deliberately stop active work.
3. Create coordinated backups using database- and filesystem-approved tools; record versions and timestamps.
4. Test restoration in an isolated environment at the frequency required by policy.
5. Perform retention, certificate, log or configuration maintenance only after confirming ownership and current activity.
6. Restart or refresh, run a controlled Flow and verify logs before re-enabling work.

For recovery, preserve incident evidence, choose a consistent recovery point, restore all coordinated components, then reconcile files, messages and transactions created after that point. Do not improvise schema edits or delete queues/logs because they appear old.

- [Collect diagnostics](../operate-and-troubleshoot/diagnostics.md)
- [Upgrade Velox](../install-and-upgrade/upgrade/index.md)
