---
title: "Configure Velox databases"
description: "Commission approved VxConfig, logging and VxData database connections"
sidebar_position: 20
slug: /installation/configure-databases
classification: public
status: approved
owner: Cam Hart
keywords: [database, vxconfig, vxdata]
---

Velox uses system connection roles for configuration, logging and data. Current deployments can share some roles, but do not assume that a selectable separation is fully implemented or required. Use the release-specific database runbook.

## Before you begin

Obtain approved, version-matched VxConfig and VxData creation or upgrade scripts, database names, authentication method, encryption requirements and separate least-privilege runtime credentials. Take restorable backups before changing an existing database.

## Configure

1. Have a database administrator create or upgrade each database with the approved scripts in their documented order.
2. Review every script target before execution; never run a fresh-build master against an existing database.
3. Verify the resulting schema/version using the release runbook.
4. Create runtime logins and grant only the required database rights.
5. In the Velox system connection configuration, define named database entries and assign the required `Config`, `Log` and `Data` roles for production and test contexts.
6. Test each connection from Designer, then repeat under the service identity where Windows authentication is used.
7. Record database versions and validation results without recording passwords.

## Recovery

If a schema step or connection test fails, stop services and do not continue with later scripts. Preserve the error and executed-script list. Restore the pre-change database or follow the database runbook's forward-fix procedure; do not improvise manual schema edits.

## Next steps

- [Configure service accounts](../plan/service-accounts.md)
- [Verify the installation](verify-installation.md)
