---
title: "MySQL Connection"
description: "Configure a MySQL endpoint and choose the client-library or direct connection mode in Velox."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [MySQL, DB Connection, client library, direct connection]
---

Select **MySQL** when the target DB Connection uses Velox's MySQL method. MySQL adds a **Version** selector to the common endpoint, credential and transaction settings.

## Settings

| Setting | Default | Runtime effect |
| --- | --- | --- |
| **Server Name** | Empty | MySQL host or endpoint supplied to the provider. |
| **Database Name** | Empty | Initial database selected when connecting. |
| **User Name** / **Password** | Empty | Credentials for a least-privilege database identity. The saved DB Connection password is encrypted but remains sensitive. |
| **Version** | Client Library | Selects the provider mode. The current setup form offers the modes from **Client Library** through **Direct**, according to the deployed database component. Confirm the chosen mode and required native library on every host. |
| **Other parameters** | Empty | Additional provider parameters. Treat these as code-like configuration: review, record and test each value. |
| **Disconnect after use** | Cleared | Closes the connection after use when enabled. |
| **Persistent connection** | Cleared | Enables persistent/pool behaviour; minimum and maximum connections default to `0`. |
| **Transactions disabled** | Cleared | When enabled, prevents normal transactional execution. |
| **Read / write isolation** | Read Committed | Shared isolation selection; confirm support and semantics in the deployed provider/server version. |

SQL Server authentication/driver/trust controls and ADO/ODBC provider/alias controls are hidden for this method.

## Verification sequence

1. Verify whether the deployment uses the client library or direct mode and install any required client component with the correct architecture.
2. Create the DB Connection, select **MySQL**, then enter endpoint, database and credentials.
3. Save and run **Test**.
4. Build the smallest representative [DB Definition](../../data-definitions/database-definitions.md) and test it under the Velox runtime service identity.
5. Exercise nulls, dates, character encoding, parameter binding and any writes used by the real integration.

Do not treat a successful connection as proof that MySQL-specific SQL, identifier quoting or transaction semantics are portable. If a shared Connection changes, use [Check Usage](../../../administer-velox/modules-and-folders/index.md) and retest all consumers.
