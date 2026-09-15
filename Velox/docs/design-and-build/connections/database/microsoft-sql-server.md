---
title: "Microsoft SQL Server Connection"
description: "Configure SQL Server drivers, authentication, certificate trust, pooling and transaction behaviour in a Velox DB Connection."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [Microsoft SQL Server, DB Connection, MSOLEDBSQL, Entra authentication, Trust Server Certificate]
---

Select **Microsoft SQL Server** when a DB Connection must use Velox's SQL Server-specific driver and authentication controls. The module starts with this method selected, but it is not usable until its endpoint and authentication are configured.

## Required decisions

| Setting | Default | How Velox uses it |
| --- | --- | --- |
| **Server Name** | Empty | Host name or SQL Server endpoint passed to the database provider. Use the reviewed DNS name; include an instance or port only in the form required by the deployed provider. |
| **Database Name** | Empty | Initial database/catalog selected for the connection. |
| **Driver** | Not set | Provider family used to open SQL Server. Select **MSOLEDBSQL** for current deployments; it is required for SQL Server 2022 or later. Legacy choices are SNAC 11, SNAC 10 and SQLOLEDB. The required provider must be installed for the process architecture on every runtime host. |
| **Authentication** | Windows | Identity mechanism. See the supported values below. |
| **User Name** / **Password** | Empty | Used only by authentication methods that require explicit credentials. The saved Velox password is encrypted, but configuration and export access must still be restricted. |
| **Trust Server Certificate** | Cleared | When selected, permits a connection without normal certificate-chain trust. Leave cleared unless a deployment owner has accepted the resulting TLS risk. |

Supported authentication values are **Windows**, **SQL Server**, **Entra MFA**, **Entra Password**, **Entra Integrated**, **Entra Service Principal** and **Entra Managed Identity**. Their presence in the list does not install provider support or grant an identity access. Interactive MFA is generally unsuitable for unattended services; choose a non-interactive, least-privilege identity for scheduled execution.

## Shared advanced settings

SQL Server also uses the [shared database settings](index.md#advanced-settings): disconnect-after-use, extra provider parameters, persistent/pool limits, transaction disabling, transactions-per-update and read/write isolation. Defaults are connected reuse, no additional parameters, no explicit pool limits, transactions enabled and **Read Committed** for reads and writes.

Change an isolation level only after reviewing blocking, consistency and retry implications with the database owner. **Disable Transactions** removes Velox's normal transaction boundary; it is not a performance switch.

## Configure and verify

1. Create a DB Connection and select **Microsoft SQL Server**.
2. Select the installed driver and enter the server and database.
3. Select the authentication mechanism and supply only the fields it requires.
4. Keep certificate trust verification enabled unless an exception is approved.
5. Save, select **Test**, then reopen and test again.
6. Use a controlled [DB Definition](../../data-definitions/database-definitions.md) to verify object and query permissions under the actual service identity.

The Designer test first updates the in-memory module, then attempts the connection. It proves only that the current Designer process can connect. A service can still fail because its account, machine, installed provider, certificate store, firewall path or Entra context differs.

## Common failures

| Symptom | Check |
| --- | --- |
| Provider is not registered | Install the selected provider with the correct process architecture on Designer and service hosts. |
| Integrated authentication works in Designer only | Verify the Velox service account, delegation requirements and database grants. |
| TLS or certificate-chain error | Correct the server certificate/name/trust chain; do not select **Trust Server Certificate** as an undocumented workaround. |
| Login succeeds but query fails | Test the exact database, schema, object and write permissions through the consuming Definition or Flow. |
| SQL Server 2022 connection fails with a legacy driver | Install and select MSOLEDBSQL. |

Use [Check Usage](../../../administer-velox/modules-and-folders/index.md) before changing a shared SQL Server Connection.
