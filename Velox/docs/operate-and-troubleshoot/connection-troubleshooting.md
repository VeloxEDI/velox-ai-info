---
title: "Troubleshoot data connections"
description: "Diagnose database, driver, folder and file-access failures"
sidebar_position: 90
slug: /operations/connection-troubleshooting
classification: public
status: approved
owner: Cam Hart
keywords:
  - "connection"
  - "driver"
  - "file-access"
---

Separate configuration, provider/driver, authentication, network and resource-access failures. Designer and Velox services may run under different identities, bitness, environment and network policy; a successful Designer test is necessary but not sufficient runtime evidence.

## Database Connections

Check in order:

1. Exact Connection module/FID and test/production values, including unresolved tags/Variables.
2. Selected method (SQL Server, Oracle, MySQL, PostgreSQL, IBM DB2, ADO or ODBC) and only that method's required provider/client/DSN options.
3. DNS/host/instance/port, database/service name and TLS/certificate policy.
4. Authentication mode, runtime account/credential access and least-privilege database permissions.
5. Matching client/provider architecture and installation on the Designer and service host.
6. Pool bounds, disconnect-after-use, transaction/isolation settings and exhaustion/long-query evidence.
7. A minimal approved read and, where required, transaction-safe write under the runtime identity.

Do not enable trust-certificate, disable transactions or expand permissions as an unreviewed diagnostic shortcut.

## File Connections

Resolve tags and confirm the effective main/input/output/audit/error/issue/duplicate/temp paths, pattern, filename and lifecycle settings. Under the runtime account, verify traverse/list/read/create/write/rename/delete only as required. Check path existence, share/DNS availability, disk space, file locks, long/safe naming, counter/unique naming and wait-for-completion behaviour.

Use a controlled test file and preserve timestamps/hash. A successful path browse from Designer does not prove a service on another host/account can access the same UNC or mapped-drive location.

## Escalation evidence

Provide method/provider version/bitness, sanitised effective endpoint/path, runtime account/host, exact exception/code, pool/resource state and the result of the minimal operation. Never include credentials or connection strings containing secrets.

## Recovery boundary

See [database Connections](../design-and-build/connections/database/index.md), [file Connections](../design-and-build/connections/file/index.md) and [service troubleshooting](service-troubleshooting.md).
