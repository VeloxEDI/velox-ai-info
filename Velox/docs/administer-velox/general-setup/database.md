---
title: "Database settings"
description: "Understand the database roles and shared configuration used by the selected Velox environment."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [General Setup, database settings, VxConfig, VxData, VxLog]
---

System database selection begins in `Connections.json`; General Setup is then loaded from the selected VxConfig as the `VX_SETUP` module. Do not confuse these system roles with reusable DB Connection modules used inside integrations.

| Role | Purpose | Important boundary |
| --- | --- | --- |
| Config / ConfigTest | VxConfig modules, relationships and setup for production/test | Determines the configuration context loaded by Designer and services |
| Log / LogTest | Logical log database mapping | Reviewed core `SQLL` resolves to the active configuration connection for `VX_LOG*`; verify the deployed schema before assuming a separate log server |
| Data / DataTest | VxData business transaction data | Separate from configuration; access and schema depend on the integration/portal deployment |

The `Connections.json` database profile controls engine type, host, database, authentication, username/password, driver and certificate trust. Change those values through the environment procedure, not as a speculative General Setup tuning action.

## Safe validation

1. Confirm the current connection key and test/production context.
2. Verify actual Config/Log/Data hosts and databases against the approved environment record.
3. Test under both the interactive and service identities.
4. Confirm schema updates are applied before service start; reviewed service startup does not run the upgrade check.
5. Run a controlled read/write Flow and inspect the actual output and log persistence.

See [environment properties](../environments/properties-and-paths.md) and the [DB Connection guide](../../design-and-build/connections/database/index.md) for integration databases.
