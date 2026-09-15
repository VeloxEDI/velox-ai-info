---
title: "PostgreSQL Connection"
description: "Configure and verify a PostgreSQL database endpoint with Velox's common DB Connection settings."
sidebar_position: 50
classification: public
status: approved
owner: Cam Hart
keywords: [PostgreSQL, DB Connection, database endpoint, transaction isolation]
---

Select **PostgreSQL** for a PostgreSQL endpoint. The current setup form uses the common host, database, credential, provider-parameter, pooling and transaction fields; it has no PostgreSQL-only option panel.

| Setting | Default | Guidance |
| --- | --- | --- |
| **Server Name** | Empty | Reviewed PostgreSQL host or endpoint. |
| **Database Name** | Empty | Database selected for the connection. |
| **User Name** / **Password** | Empty | Least-privilege runtime identity. The saved DB password is encrypted but must still be protected. |
| **Other parameters** | Empty | Provider-specific values, including any approved port or TLS options required by the deployed component. Do not copy unreviewed connection strings. |
| **Disconnect after use** | Cleared | Closes after use when enabled. |
| **Persistent connection** | Cleared | Enables persistent/pool behaviour; minimum and maximum connections default to `0`. |
| **Maximum transactions per update** | `0` | Shared limit field. Leave at the default unless the Flow/database design provides a tested value. |
| **Disable transactions** | Cleared | Removes Velox's normal transaction handling when enabled. |
| **Read / write isolation** | Read Committed | UI choices are Read Committed, Repeatable Read and Read Uncommitted. PostgreSQL/provider interpretation must be verified rather than assumed from the label. |

The setup form hides SQL Server-specific authentication/driver/trust fields, the MySQL version field, and ADO/ODBC alias/provider fields.

After **Test** succeeds, verify the exact schemas, case-sensitive identifiers, query parameters, data types and writes through a [DB Definition](../../data-definitions/database-definitions.md). Run that test from the actual Velox service host and identity. Record any required provider parameters in operational configuration notes, then use [Check Usage](../../../administer-velox/modules-and-folders/index.md) before changing them.
