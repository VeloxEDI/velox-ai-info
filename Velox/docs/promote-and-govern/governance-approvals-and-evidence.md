---
title: "Govern configuration changes"
description: "Record the minimum approvals, scope, evidence and recovery information for a Velox change."
sidebar_position: 90
classification: public
status: approved
owner: Cam Hart
keywords: [change governance, approval, evidence, audit]
---

Apply your organisation's change policy. Velox does not create approval merely because Designer exposes an export, import or production-update command.

## Minimum change record

| Area | Record |
| --- | --- |
| Identity | Change/release identifier, owner, implementer, approver and window. |
| Source/target | Velox version, source and target contexts, affected services and external systems. |
| Scope | Root module names/FIDs, complete dependency list and target-owned items deliberately retained. |
| Artefact | `.CFG` filename, size, checksum, storage location/classification and source test evidence. |
| Import choices | Every non-**Same** action, including reasons for **Update**, **Add Duplicate** or **Ignore**. |
| Validation | Structural comparison, target-specific settings, runtime test, Flow/Transport/API result and monitoring period. |
| Recovery | Backup/prior package, disable/stop point, rollback steps and external-effect reconciliation owner. |

Sanitise evidence. Do not place passwords, tokens, private keys, raw customer payloads or an entire `.CFG` file into a general ticket. Prefer identifiers, timestamps, redacted excerpts and governed artefact references.

Approval must cover the real blast radius: shared modules and Connections, runtime refresh, schedules/file monitors, gateway routes, downstream capacity and non-transactional output. Update the change record when the implemented action differs from the approved plan.
