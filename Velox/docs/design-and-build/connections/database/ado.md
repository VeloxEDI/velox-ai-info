---
title: "ADO Connection"
description: "Configure an ADO provider and SQL compatibility controls in a Velox DB Connection."
sidebar_position: 70
classification: public
status: approved
owner: Cam Hart
keywords: [ADO, provider, DB Connection, SQL compatibility, Use CCE]
---

Select **ADO** when Velox must connect through an installed ADO/OLE DB provider. Unlike an engine-specific method, ADO delegates important behaviour to the selected provider, so the exact provider, architecture and connection contract are deployment dependencies.

## ADO fields

| Setting | Default | Effect |
| --- | --- | --- |
| **Provider** | Empty | ADO provider name used to establish the connection. **Search ADO** assists selection from providers visible to the current machine/process. |
| **Server Name** / **Database Name** | Empty | Endpoint values passed through the selected provider where applicable. |
| **User Name** / **Password** | Empty | Explicit provider credentials where required. The Velox DB Connection password is encrypted but sensitive. |
| **SQL type** | SQL2 | Shared SQL compatibility selection used by generic methods. Validate generated/accepted SQL with the actual provider. |
| **Use AS alias** | Cleared | Allows `AS` in relevant aliases when supported. |
| **Force alias** | Cleared | Forces alias use in generated statements where the database component applies it. |
| **Use single backquote** | Cleared | Enables backquote-style identifier quoting. Do not enable unless the target dialect requires it. |
| **Use CCE** | Selected | Enables the component's CCE behaviour for ADO. Preserve the default unless source/provider testing establishes a reason to change it. |
| **Other parameters** | Empty | Additional provider parameters. Do not include secrets in documentation or diagnostic output. |

The SQL Server-specific driver, authentication and trust controls, MySQL version selector, and ODBC alias search are hidden.

## Configure safely

1. Confirm the provider product, bitness and installation on every Designer/service host.
2. Create a DB Connection, select **ADO**, then use **Search ADO** or enter the reviewed provider.
3. Enter the endpoint and credentials required by that provider.
4. Leave SQL compatibility/quoting controls at their defaults unless a representative query proves a change is needed.
5. Save, run **Test**, and then test a [DB Definition](../../data-definitions/database-definitions.md) under the runtime identity.

Provider discovery is machine-specific. A provider found in Designer may be absent from a service host or registered only for a different architecture. A connection test also does not validate SQL dialect, parameter binding, transaction semantics or writes. Record the full provider dependency outside the password and include it in deployment validation.
