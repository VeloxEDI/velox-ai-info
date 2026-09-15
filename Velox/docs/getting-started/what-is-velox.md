---
title: "What Velox does"
description: "Understand the Velox integration platform and its main user-facing components"
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords:
  - "velox"
  - "platform"
  - "components"
---

Velox is a Windows-based integration platform. It connects systems, applies reusable transformation and processing rules, and records the result of each integration run.

Use Velox to design integrations that acquire data, validate or transform it, produce output, call approved external processes, and exchange data with other systems. Administrators and operators can then run those integrations interactively or through background services.

## Main components

### Velox Designer

Velox Designer is the Windows application used to create and maintain integration configuration. Its module tree provides access to reusable Connections, Definitions, Maps, Reports, Transports, scripts and Flows. Designer also provides tools for running Flows, reviewing logs and controlling Velox services.

### Velox Service

Velox Service runs background integration work. Depending on the saved configuration, it can start Flows on a schedule, monitor folders, receive inbound Transport work and process queued outbound Transport work.

Starting or stopping the Windows service controls the service process. Enabling or disabling Velox processing is a separate operational control. Treat these as different actions when planning maintenance.

### Velox API Service

Velox API Service hosts REST-enabled Flows. API publication requires both Flow configuration and an approved deployment boundary for network security, authentication and transport-layer security. Do not expose the service directly until that deployment has been reviewed and tested.

### VxData

VxData, also called the Velox Data Platform, is a separate database for standardised business transaction data. It is not the Velox configuration database. An integration may use VxData as one of its data sources or destinations.

The optional VxData portal provides browser-based workflows over VxData in deployments where it has been configured. It complements Designer; it does not replace the integration-design and administration functions in Designer.

## How an integration fits together

Most Velox integrations combine several reusable modules:

1. A **Connection** describes how Velox reaches a database or set of files.
2. A **Definition** gives that data a structure that Velox can read or write.
3. A **Flow** coordinates data and runs ordered **Flow steps**.
4. A Flow step may use a Map, Report, script, command or Transport.
5. A trigger starts the Flow manually, on a schedule, from a monitored file, through a REST request or from another Flow.
6. Logs record the execution result and, where configured, supporting detail.

Configuration can be maintained in separate test and production contexts. The selected context determines which configuration and associated database references Designer uses, so always confirm the current context before editing or running a Flow.

## Product boundaries

- Velox configuration and operational history are distinct from business data held in VxData or another connected system.
- Available database drivers, Transport capabilities and authentication methods depend on the installed distribution and approved deployment. A feature name in a setup screen is not, by itself, a compatibility commitment.
- Background execution depends on the applicable Windows service being installed, running and enabled, with access to required databases, folders and external systems.
- Generated scripting signatures belong in the Code Library. User documentation explains scripting workflows without duplicating that reference.

## Related concepts

- [Core Velox concepts](core-concepts.md)
- [Connection concepts](../design-and-build/connections/connection-concepts.md)
- [Data Definition concepts](../design-and-build/data-definitions/definition-concepts.md)
- [Flow concepts](../design-and-build/flows/flow-concepts.md)
- [Transport concepts](../design-and-build/transports/transport-concepts.md)
