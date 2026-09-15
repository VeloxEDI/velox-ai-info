---
title: "ODBC Connection"
description: "Configure an ODBC alias and generic SQL controls for a Velox DB Connection."
sidebar_position: 80
classification: public
status: approved
owner: Cam Hart
keywords: [ODBC, DSN, ODBC alias, DB Connection, SQL dialect]
---

Select **ODBC** when Velox must use an ODBC data source. The setup form replaces the ordinary host/database presentation with an **ODBC Alias** and **Search ODBC** control. The alias must be available to the account and process architecture used by both Designer and runtime services.

## ODBC fields

| Setting | Default | Effect |
| --- | --- | --- |
| **ODBC Alias** | Empty | DSN/alias used to locate the ODBC configuration. **Search ODBC** lists aliases visible to the current process. |
| **User Name** / **Password** | Empty | Explicit credentials when the DSN/driver requires them. Velox encrypts the saved DB password, but it remains sensitive. |
| **SQL type** | SQL2 | Generic SQL compatibility mode used by the database component. |
| **Use AS alias** | Cleared | Allows `AS` alias syntax where supported. |
| **Force alias** | Cleared | Forces aliases where the component applies them. |
| **Use single backquote** | Cleared | Uses backquotes for identifiers when enabled. Confirm the target driver/dialect before changing it. |
| **SQL dialect** | `1` | Persisted generic dialect value. Change only with provider-specific evidence and regression tests. |
| **Single-quote dates** | Selected | Applies the generic database component's single-quoted date behaviour. Verify date parameters and locale-sensitive values. |
| **Other parameters** | Empty | Extra driver/provider parameters. Keep secrets out of support evidence. |

The SQL Server driver/authentication/trust controls, MySQL version selector, ADO provider search and ADO-only **Use CCE** control are hidden.

## Verify the runtime environment

1. Create the DSN using the approved driver and architecture on all applicable hosts. Prefer a system-wide data source where services require it, subject to local security policy.
2. Create the DB Connection, select **ODBC**, and select or enter its alias.
3. Enter credentials only if required; leave SQL compatibility controls at defaults initially.
4. Save and select **Test**.
5. Run representative reads, parameters, dates, nulls and any writes through a [DB Definition](../../data-definitions/database-definitions.md) as the service identity.

**Search ODBC** reports what the interactive Designer process can see; it is not proof that a Windows service sees the same DSN. If Designer succeeds and runtime fails, compare user/system DSN scope, 32/64-bit registration, driver version and service-account permissions. Use [Check Usage](../../../administer-velox/modules-and-folders/index.md) before modifying a shared alias or dialect control.
