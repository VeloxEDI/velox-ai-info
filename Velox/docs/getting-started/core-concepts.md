---
title: "Core Velox concepts"
description: "Understand modules, Flows, Flow steps and test/production configuration"
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords:
  - "modules"
  - "flows"
  - "environments"
---

Velox integrations are assembled from reusable modules and executed as Flows. Understanding these terms makes it easier to navigate Designer, choose the right configuration object and interpret operational results.

## Modules

A **module** is a saved, reusable configuration object. Modules have an identity and name, can be related to other modules, and can be active or archived. The main user-facing types include Connections, Definitions, Maps, Reports, Transports, Variable Groups, Scriptlets, SQL Scripts, APIs and Flows.

Modules are stored in the selected Velox configuration database. Reuse avoids repeating settings, but a change can affect every configuration that refers to that module. Check usage before changing, archiving or deleting shared configuration.

## Connections and Definitions

A **Connection** describes access to a resource. A DB Connection contains database access configuration; a File Connection contains folder, filename and file-lifecycle configuration.

A **Definition** describes structured data. A DB Definition uses a DB Connection and defines database-backed fields, queries, criteria or parameters. A File Definition uses a File Connection and describes data such as delimited text, XML, JSON, EDI or Excel.

Keeping access and structure separate allows several Definitions to reuse one Connection and allows Maps, Reports, scripts and Flows to work with definition-backed data.

## Flows and Flow steps

A **Flow** is the saved orchestration configuration that Velox executes. A Flow brings together its data, trigger, ordered steps, completion policy and logging settings.

A **Flow step** is one operation within a Flow. Supported steps include operations that use Maps, Reports, scripts, Transports, files, SQL, commands or another Flow. Steps run in their configured order, subject to their active state and the Flow's error or cancellation policy.

Some older interfaces and database fields use **Action** for a Flow. Use **Flow** in normal documentation. Treat **Action** as a compatibility term when it appears in an existing field, export or diagnostic record.

## Maps, Reports and Transports

A **Map** transforms data from a source view to a destination view. A **Report** uses configured data to produce output. A **Transport** exchanges data with an external system and has an inbound or outbound direction.

Outbound Transport work is queued separately from the Flow that creates it. A successful Flow step can therefore create work that is sent later by Velox Service. Review both Flow execution logs and Transport Logs when tracing an exchange.

## Triggers and execution hosts

| Trigger | Execution host | Typical use |
| --- | --- | --- |
| Manual run or Test Run | Velox Designer | Interactive testing and controlled execution |
| Schedule | Velox Service | Time-based background processing |
| File monitor | Velox Service | Processing files as they arrive |
| Inbound Transport | Velox Service | Receiving external messages or files |
| REST request | Velox API Service | Request-driven integration |
| Sub-Flow or linked Flow | Current Flow host | Reusing or sequencing Flow logic |

The host matters because its Windows account needs access to every required database, folder and external system.

## Test and production configuration

Velox can associate a connection key with separate **test configuration** and **production configuration** database references. These are operating contexts, not different product builds.

Switching context changes the configuration Designer loads and can also change the log and data databases referenced by that connection. Confirm the selected context before editing, importing, running or comparing configuration. Moving configuration between contexts is a controlled promotion activity, not an automatic deployment.

## Logs and status

Flow execution produces a status and can persist an execution log according to the Flow's logging policy. Transport queues and outcomes are recorded separately in Transport Logs. Logs may include messages and selected file, SQL, HTTP or Transport details when configured.

Use logs as operational evidence, but sanitise identifiers and data before sharing them. Never share passwords, access tokens, connection strings or unredacted business content.

## Next concepts

- [Work with test and production configuration](../administer-velox/environments/index.md)
- [Connection concepts](../design-and-build/connections/connection-concepts.md)
- [Data Definition concepts](../design-and-build/data-definitions/definition-concepts.md)
- [Flow concepts](../design-and-build/flows/flow-concepts.md)
- [Transport concepts](../design-and-build/transports/transport-concepts.md)
