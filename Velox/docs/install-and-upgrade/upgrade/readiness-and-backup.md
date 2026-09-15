---
title: "Prepare and back up before an upgrade"
description: "Assess readiness, stop processing safely and capture recoverable Velox state before an upgrade."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [Velox upgrade, backup, readiness, rollback]
---

An upgrade changes binaries and may require database or installed-data updates. Treat the release-specific upgrade instructions as authoritative; this page defines the minimum evidence and recoverability checks around them.

## Readiness checks

1. Identify the installed version, bitness, service names, connection key and test/production topology.
2. Obtain the approved release package, checksum and release-specific database/update instructions.
3. Review unresolved Flow, Transport and service work. Wait for safe completion or record the deliberate handling decision.
4. Confirm maintenance timing, service-account availability, database administrator support and a tested rollback owner.
5. Verify sufficient disk/database space and access to the previous working package.

## Back up recoverable state

| State | Minimum capture | Restore check |
| --- | --- | --- |
| VxConfig and active `VX_LOG*` persistence | Consistent database backup using the database platform's approved method | Restore to an isolated target and confirm schema/content can be opened |
| VxData | Consistent backup coordinated with the integration/portal workload | Validate representative transaction data and constraints |
| `C:\ProgramData\Velox\Config\` | Secure copy including `Connections.json`; protect encrypted/secret-bearing content | Confirm exact file names, timestamps and access controls |
| Certificates, schemas, scripts, templates and required runtime assets | Secure copy of environment-owned assets | Verify file count/hash and service-account readability |
| Service definitions | Service identity, startup type, image path and parameters without exposing the password | Confirm the previous command line and connection/environment selection can be restored |
| Current binaries | Approved previous release package or immutable installation snapshot | Confirm checksum and recovery location |

:::warning Database and file copies must represent one recoverable point
Do not assume a folder copy alone can roll back database schema or configuration changes. Coordinate application, database and runtime-file state and document the restoration order.
:::

## Go/no-go evidence

Proceed only when backups are complete and test-restorable, the release path is approved, current processing is controlled and the rollback decision point is recorded. Continue with the [upgrade procedure](upgrade-procedure.md).
