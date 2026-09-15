---
title: "Work with test and production configuration"
description: "Select, compare and manage Velox configuration contexts"
sidebar_position: 10
slug: /administration/environments
classification: public
status: approved
owner: Cam Hart
keywords:
  - "test"
  - "production"
  - "environment"
---

Velox can maintain separate test and production configuration contexts for a named system connection. Use the test context to design and verify changes, then promote reviewed configuration deliberately instead of editing production first.

## What an environment controls

The selected context determines which configured database references Velox uses for module and General Setup configuration, execution logs and the configured data database.

The references are defined for a connection key in the installed `Connections.json` configuration. Each deployment supplies its own names and database settings. Do not copy example machine names, credentials or connection values from another environment.

## Configuration contexts, not product builds

Test and production are not different Velox executables or editions. They are two sets of database references associated with one system connection.

Switching context causes Designer to use the selected configuration and reload relevant runtime state such as variables. Open editors, connection pools and cached modules can also be affected. Save or close incomplete work before switching, and verify the displayed context immediately afterwards.

## Safe working model

1. Confirm that the test and production references are correctly configured for the selected connection key.
2. Select the test context before creating or changing modules.
3. Test the changed Flow and its dependencies with sanitised, non-production data.
4. Review module usage and compare the test configuration with production.
5. Promote only the reviewed modules and dependencies.
6. Verify the production context before performing the post-promotion test.

:::caution Production changes
Changing context does not copy configuration. Editing while production is selected changes production configuration directly. Always confirm the current context before saving, importing, archiving or deleting a module.
:::

## Relationships and dependencies

A Flow usually depends on several modules. Promoting only the Flow can leave production without a required Connection, Definition, Map, Report, variable or Transport. Review dependencies and usage as part of the promotion scope.

Database references can point test and production to different systems, folders and credentials. A successful test confirms configuration logic but does not prove that production accounts, network paths, drivers or external endpoints are ready.

Background services load configuration using their assigned connection and Windows account. After promotion, follow the approved service refresh or restart procedure and verify that the intended runtime host has loaded the change.

## Limitations

- Velox does not replace organisational change approval, backup or rollback controls.
- A comparison identifies configuration differences; it does not prove that connected systems contain equivalent data or permissions.
- Never use customer or production credentials in a test context unless that access has been explicitly approved.
- Upgrade and database-schema changes require a separate tested runbook; they are not ordinary module promotion.

## Related tasks

- [Environment properties and paths](properties-and-paths.md)
- [Credentials and environment-specific values](credentials-and-variables.md)
- [Validate an environment](validation.md)
- [Manage Velox modules](../modules-and-folders/lifecycle-actions.md)
- [Compare and promote Velox configuration](../../promote-and-govern/promote-configuration.md)
- [Control Velox services](../service-control/index.md)
