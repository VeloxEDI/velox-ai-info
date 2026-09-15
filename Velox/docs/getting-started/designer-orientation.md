---
title: "Velox Designer orientation"
description: "Find modules, menus, managers and operational tools in Velox Designer"
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [designer, navigation, menus]
---

Velox Designer is the Windows application for configuring and testing integrations. Open the intended system connection and confirm whether it is using test or production configuration before making changes.

## Main areas

- The module tree groups reusable Connections, Definitions, Maps, Reports, Transports, Variables, Scriptlets, APIs and Flows. Context menus create, open, check usage, archive or manage relevant items.
- Setup editors hold a module's properties. Saving a shared module can affect multiple callers.
- Flow setup combines data, ordered steps, triggers and execution policy.
- Managers and logs expose Flow execution and Transport queue/delivery history.
- **Help > Code Library** opens the installed scripting reference.
- Service controls manage Windows services and Velox processing; stopping processing and stopping a service are distinct actions.

## Safe orientation exercise

1. Select the test context and read the connection name shown by Designer.
2. Expand each top-level module group without editing it.
3. Open an existing test Flow read-only and identify its Data, Flow Configuration and Execution settings.
4. Find its usage and execution-log actions, then close without saving.

Menu availability depends on the selected node, permissions, installed components and current configuration. The text workflow is sufficient for orientation; screenshots can become stale across releases and are not required.

- [Create your first Flow](first-flow.md)
- [General Setup](../administer-velox/general-setup/index.md)
