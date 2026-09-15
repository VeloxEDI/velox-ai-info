---
title: "IBM DB2 Connection"
description: "Configure and verify the IBM DB2 connection method exposed by Velox Designer."
sidebar_position: 60
classification: public
status: approved
owner: Cam Hart
keywords: [IBM DB2, Db2, DB Connection, database provider]
---

Velox Designer labels this method **IBM DB2**. Select it for an IBM Db2 endpoint that has a compatible provider installed and configured on the Designer and service hosts.

## Exposed settings

The current setup form exposes the common **Server Name**, **Database Name**, **User Name**, **Password**, **Other parameters**, connection-lifetime, pool and transaction fields. It does not expose a Db2-specific option panel. Defaults are empty endpoint/credentials/parameters, disconnect-after-use cleared, persistent connection cleared, pool limits `0`, transactions enabled, and **Read Committed** for read and write isolation.

SQL Server driver/authentication/trust settings, the MySQL version selector, and ADO/ODBC provider or alias settings are hidden. Their documented behaviour does not apply to IBM DB2.

## Deployment checks

1. Establish the supported Db2 server and client/provider combination for the environment.
2. Install the provider with the architecture required by each Velox process.
3. Create the DB Connection, select **IBM DB2**, and enter the reviewed endpoint and least-privilege identity.
4. Add only required, reviewed provider parameters.
5. Save and select **Test**.
6. Verify actual object access, query parameters, data types and writes through a [DB Definition](../../data-definitions/database-definitions.md) under the service identity.

The method appearing in Designer is not a version compatibility statement. Retest after a provider, Db2 server, service account or host change. Use [Check Usage](../../../administer-velox/modules-and-folders/index.md) before changing a shared Connection.
