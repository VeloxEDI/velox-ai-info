---
title: "Roll back and recover configuration"
description: "Restore a known Velox configuration state and reconcile non-transactional side effects."
sidebar_position: 80
classification: public
status: approved
owner: Cam Hart
keywords: [rollback, recovery, configuration restore, reconciliation]
---

Configuration rollback restores module state; it does not automatically undo database commits, files, messages, email, API calls or other external effects produced while the changed configuration was active.

## Recovery decision

1. Stop new affected work at the safest boundary: disable the trigger/route, stop processing or apply an approved service stop.
2. Preserve Flow, Transport, service, gateway and target-system evidence with correlation identifiers.
3. Determine which configuration rows changed and which external effects completed, failed or remain ambiguous.
4. Choose the approved recovery source: database/configuration backup, prior controlled `.CFG` package or manually reviewed correction. Verify its identity and compatibility.
5. Restore in a controlled context, verify module relations and target-specific values, then refresh/restart consumers.
6. Run a non-destructive check followed by one controlled transaction.
7. Reconcile duplicate/missing external effects before re-enabling ordinary processing.

Do not blindly reverse-import the failed package or rerun timed-out work. If the importer partially saved a dependency graph, inspect every expected module rather than restoring only the visible root.

Record the failure, actual rollback scope, affected transactions, validation and follow-up action. See [reprocess and recover](../operate-and-troubleshoot/reprocess-and-recover.md) for workload recovery after configuration is stable.
