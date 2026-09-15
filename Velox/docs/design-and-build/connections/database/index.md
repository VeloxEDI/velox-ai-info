---
title: "Configure a DB Connection"
description: "Configure and test a supported database connection"
sidebar_position: 10
slug: /data/db-connections
classification: public
status: approved
owner: Cam Hart
keywords:
  - "db-connection"
  - "driver"
  - "authentication"
---

Create a reusable database endpoint in Velox Designer and test that its configured credentials can connect. This procedure does not certify a database product or driver version for your environment.

## Before you begin

- **Audience:** Velox implementers and database administrators.
- **Prerequisites:** An approved database endpoint, an installed provider or driver appropriate to that endpoint, and the connection values supplied by the database administrator.
- **Permissions:** Permission to create Velox configuration modules and a database identity with only the access required by the consuming workload.
- **Starting state:** Use a test environment and identify every Definition, Flow, Map, Report or script that will use the Connection.

:::warning Protect database credentials
Do not put production credentials in examples, screenshots, support messages or source control. Treat a saved password as sensitive configuration and restrict access to the configuration database and Designer.
:::

## Choose the connection method

| Method | Type-specific reference |
| --- | --- |
| Microsoft SQL Server | [Driver, authentication and certificate trust](microsoft-sql-server.md) |
| Oracle | [Oracle endpoint and shared settings](oracle.md) |
| MySQL | [Client-library or direct mode](mysql.md) |
| PostgreSQL | [PostgreSQL endpoint and shared settings](postgresql.md) |
| IBM DB2 | [IBM DB2 provider requirements](ibm-db2.md) |
| ADO | [ADO provider and SQL compatibility](ado.md) |
| ODBC | [ODBC alias and SQL compatibility](odbc.md) |

The list is a set of implementation methods, not a product/version support matrix. Confirm the exact provider, server version, process architecture and runtime host combination in the target environment.

## Steps

1. In the Designer configuration tree, open **Data Connections > DB Connections** and create a DB Connection.
2. Enter a unique, descriptive **DB Endpoint Name**. Use a name that distinguishes the system and environment without embedding a username or password.
3. Under **Database Server**, select the connection **Method** approved for the target database and installed driver. The available methods include Microsoft SQL Server, Oracle, MySQL, PostgreSQL, IBM DB2, ADO and ODBC, but their presence in the list does not prove compatibility with a particular server or driver version.
4. Enter the applicable **Server Name** and **Database Name**. For ADO or ODBC, select or enter the provider or alias agreed with the database administrator.
5. Select the **Authentication** method. Enter **User Name** and **Password** only when the selected method requires them.
6. Leave **Trust Server Certificate** cleared unless the deployment owner has explicitly approved bypassing normal certificate-chain validation.
7. On **Advanced**, change provider parameters, transaction behaviour or read/write isolation levels only when the database design requires it. Record the reason because the Connection can be shared by several modules.
8. Select **Test**. Resolve any provider, network, TLS, authentication or database-selection error before continuing.
9. Select **Save**.

## Advanced settings

| Setting | Default | Purpose and risk |
| --- | --- | --- |
| **Disconnect after use** | Cleared | Disconnects the assigned SQL connection when the DB Connection instance is released. This applies to temporary DB Connections used by Sub Actions and Flows called through `ExecuteFlow`, reducing retained sessions at the cost of reconnect overhead on the next use. |
| **Other parameters** | Empty | Extra provider parameters. Review every entry and keep secrets out of documentation. |
| **Persistent connection** | Cleared | Enables persistent/pooling behaviour. Minimum and maximum connections both default to `0`; tune only with measured concurrency tests. |
| **Maximum transactions per update** | `0` | Shared update limit. Use a non-default only when the integration's transaction design defines it. |
| **Disable transactions** | Cleared | Removes normal transaction handling and therefore rollback protection. |
| **Read / write isolation** | Read Committed | Both default to Read Committed. Other UI values are Repeatable Read and Read Uncommitted; provider semantics and support vary. |

## Verify the result

Reopen the DB Connection and select **Test** again. Then create or use a test [DB Definition](../../data-definitions/database-definitions.md) to perform the least invasive read required to confirm database permissions and schema visibility.

Execute a controlled test through the normal runtime host and identity that will run the workload. A Designer test under an interactive user does not prove that a service account has the same driver, network or integrated-authentication access.

When **Disconnect after use** is selected, also test a normal Flow, a Sub Action and any script path that calls another Flow. After each caller finishes, use your approved database monitoring method to confirm that its released connection is not retained unexpectedly.

## Recover or roll back

If you edited an existing shared Connection, restore its previous recorded values and retest its known consumers. Delete a new Connection only after confirming that no module refers to it. Do not delete or rename a shared Connection as a diagnostic shortcut.

## Troubleshoot

- **Test fails before authentication:** confirm DNS, port, firewall, TLS and that the required provider or driver is installed for the running process.
- **Authentication fails:** confirm the selected authentication method and ask the database administrator to verify the identity without sending the password in a ticket.
- **Designer succeeds but runtime fails:** compare the Designer user with the service identity, installed drivers and machine-level ODBC or provider configuration.
- **A non-SQL Server method is listed but does not work:** verify the exact deployed provider and server combination. The list of methods is not a support matrix.

## Next steps

Use the Connection in a [DB Definition](../../data-definitions/database-definitions.md). Read [Connection concepts](../connection-concepts.md) before sharing it across several modules.
