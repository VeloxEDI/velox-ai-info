---
title: "Oracle Connection"
description: "Configure and verify an Oracle database endpoint using Velox's shared DB Connection controls."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [Oracle, DB Connection, database endpoint, service account]
---

Select **Oracle** for an Oracle endpoint. The current setup form exposes the common server, database, user name, password and advanced database controls; it does not add an Oracle-only option panel.

## Configuration contract

| Setting | Default | Guidance |
| --- | --- | --- |
| **Server Name** | Empty | Enter the Oracle host or endpoint in the format required by the installed provider. |
| **Database Name** | Empty | Enter the reviewed database/service identifier used by the provider. |
| **User Name** / **Password** | Empty | Supply a least-privilege Oracle identity. Velox encrypts the saved DB Connection password, but it remains sensitive configuration. |
| **Other parameters** | Empty | Provider-specific name/value text. Add only reviewed parameters and record why they are required. |
| **Disconnect after use** | Cleared | Controls whether Velox closes the connection after use instead of retaining it for reuse. |
| **Persistent connection** | Cleared | Enables persistent/pool behaviour. Minimum and maximum connection values default to `0` and require workload-specific testing. |
| **Disable transactions** | Cleared | Disables the normal transaction boundary. Use only where the data-owner-approved design requires it. |
| **Read / write isolation** | Read Committed | Shared isolation selection. Supported UI values are Read Committed, Repeatable Read and Read Uncommitted; actual provider support must be verified. |

The SQL Server driver, authentication and certificate-trust controls, MySQL version selector, and ADO/ODBC provider or alias controls are hidden for Oracle. Do not infer Oracle behaviour from those other method pages.

## Configure and test

1. Confirm the Oracle client/provider and process architecture required by the deployment.
2. Create a DB Connection, select **Oracle**, and enter the reviewed endpoint and identity.
3. Add provider parameters only when required by the approved client configuration.
4. Save and select **Test** in Designer.
5. Retest with a [DB Definition](../../data-definitions/database-definitions.md) under the account and host that run Velox services.

A successful connection test does not prove schema resolution, session settings, query compatibility or write permission. Validate representative reads and any intended writes in a non-production environment. If Designer succeeds but the service fails, compare installed clients, environment configuration, network naming and identities on the two hosts.

Use [common Connection properties](../common-connection-properties.md) and [Check Usage](../../../administer-velox/modules-and-folders/index.md) when modifying a shared endpoint.
