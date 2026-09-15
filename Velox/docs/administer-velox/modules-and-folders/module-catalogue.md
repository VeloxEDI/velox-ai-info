---
title: "Velox module catalogue"
description: "Identify the active Velox module families, their purpose and their primary configuration references."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [module catalogue, Connections, Definitions, Flows, Transports]
---

Use this catalogue to select a persisted object. Flow data items and Flow steps are child configuration inside a Flow and are indexed separately under Flows.

| Module family | Use it for | Main dependency | Detailed guide |
| --- | --- | --- | --- |
| General Setup | Shared system, service, email, proxy, API/web and runtime behaviour | Selected configuration context | [General Setup](../general-setup/index.md) |
| Folder | Organising supported module types in Designer | Optional parent Folder | [Folders and naming](folders-naming-and-organisation.md) |
| DB Connection | Reusable database connectivity and transaction/pool settings | Driver/provider, endpoint and credentials | [Database Connections](../../design-and-build/connections/database/index.md) |
| File Connection | Reusable paths, masks, naming and file lifecycle | Filesystem/share rights | [File Connections](../../design-and-build/connections/file/index.md) |
| DB/File Definition | Structured database or file data | Connection and schema/format | [Data Definitions](../../design-and-build/data-definitions/index.md) |
| Map | Source-to-destination transformation | Source and destination Definitions | [Maps](../../design-and-build/transformations-output/maps/index.md) |
| Report | Report layout and output | Source Definition | [Reports](../../design-and-build/transformations-output/reports/index.md) |
| SQL Script | Reusable SQL text | DB Connection | [SQL Scripts](../../design-and-build/transformations-output/sql-scripts.md) |
| Scriptlet / Variable Group | Reusable PascalScript and typed values | Script/runtime context | [Scripting](../../design-and-build/scripting-code-library/index.md) |
| Transport | Inbound or outbound exchange with an external endpoint | File Connection and protocol credentials | [Transports](../../design-and-build/transports/index.md) |
| Flow | Data, ordered steps, triggers, logs and execution policy | Related modules/data items | [Flows](../../design-and-build/flows/index.md) |
| API | Group REST Flows and generate OpenAPI metadata | REST-enabled Flows | [APIs and OpenAPI](../../design-and-build/apis-and-openapi/index.md) |

For a one-to-one current type and Transport-direction inventory, use the [technical module type catalogue](../../technical-reference/module-type-catalogue.md).
