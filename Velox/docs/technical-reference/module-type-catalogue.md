---
title: "Module type catalogue"
description: "Map every active user-configurable Velox object and concrete Transport type to its detailed reference."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [module types, concrete types, Flow steps, Transport types]
---

This catalogue lists current user-configurable types evidenced by Designer creation menus and active implementation. A class or enum value in source is not included when no current creation/configuration path was confirmed.

## Core modules

| Type | Purpose | Detailed authority |
| --- | --- | --- |
| General Setup | System-wide runtime, service, email, network/API, logging and retry values | [General Setup](../administer-velox/general-setup/index.md) |
| Folder | Organise permitted module families | [Folders and naming](../administer-velox/modules-and-folders/folders-naming-and-organisation.md) |
| DB Connection | Reusable DB access; method selects SQL Server, Oracle, MySQL, PostgreSQL, IBM DB2, ADO or ODBC fields | [DB Connections](../design-and-build/connections/database/index.md) |
| File Connection | Paths, patterns, naming and lifecycle folders | [File Connections](../design-and-build/connections/file/index.md) |
| DB Definition | Database data structure/query/update rules | [DB Definitions](../design-and-build/data-definitions/database-definitions.md) |
| Flat/XML/JSON/EDI/Excel File Definition | Typed file structure and parse/write rules | [File Definitions](../design-and-build/data-definitions/file/index.md) |
| Flow | Data, ordered steps, triggers, policy, logging and runtime | [Flows](../design-and-build/flows/index.md) |
| Map | Definition-to-Definition mapping and expressions | [Maps](../design-and-build/transformations-output/maps/index.md) |
| Report | ReportBuilder data/layout and output | [Reports](../design-and-build/transformations-output/reports/index.md) |
| SQL Script | Saved interactive SQL workspace/module | [SQL Scripts](../design-and-build/transformations-output/sql-scripts.md) |
| Scriptlet | Reusable PascalScript | [Scriptlets](../design-and-build/transformations-output/scriptlets.md) |
| Variable Group | Reusable typed/environment values | [Variable Groups](../design-and-build/transformations-output/variables.md) |
| API | REST Flow grouping and OpenAPI metadata/schema | [API module properties](../design-and-build/apis-and-openapi/api-module-properties.md) |

## Flow child types

Flow data items are [database](../design-and-build/flows/data/database-data-items.md) or [file](../design-and-build/flows/data/file-data-items.md). Active **Add Action...** step types are Map, Report, Custom Script, Outbound Transport, File Router, Command Line, Custom SQL and Sub Action; use the [Flow-step index](../design-and-build/flows/steps/index.md).

Current triggers are manual/Test Run, schedule, file monitor, REST, inbound Transport and successful linked successor. These are invocation settings/relationships, not standalone ordinary modules.

## Concrete Transport types

| Direction | Active types | Detailed authority |
| --- | --- | --- |
| Inbound | FTP, SFTP, LAN, HTTP, IMAP, POP3, MSMQ, IBM MQ | [Transport guide](../design-and-build/transports/index.md) and protocol child pages |
| Outbound | FTP, SFTP, LAN, HTTP, SMTP/email, MSMQ, IBM MQ | [Transport guide](../design-and-build/transports/index.md) and protocol child pages |

AS2 and uncreatable/incomplete Flow-step enum values such as Call Plugin, Transaction Commit, DB Disconnect, Wait for File and Inbound Transport are not documented as active current choices. Configuration Templates and Logs are internal/operational artefacts, not ordinary user-created design modules.
