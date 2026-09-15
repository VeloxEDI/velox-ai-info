---
title: "Velox glossary"
description: "Definitions for Velox configuration, execution, logging, Transport and portal terms."
sidebar_position: 90
classification: public
status: approved
owner: Cam Hart
keywords: [Velox glossary, Action, Flow, Definition, Transport]
---

| Term | Meaning |
| --- | --- |
| Action | Legacy/source/UI term often referring to a Flow or a Flow step. In these docs, **Flow** means the persisted orchestration module and **step** means an ordered child action. |
| API module | Module that groups REST-enabled Flows and generates OpenAPI metadata/schema; not the runtime security boundary. |
| Code Library | Generated reference for PascalScript declarations available in Velox; the installed copy is release-specific. |
| Connection | Reusable DB or filesystem access configuration. |
| Definition | Structured description of database or file data used by Flows, Maps, Reports and APIs. |
| Designer | Windows application used to configure/test Velox and inspect logs/services. |
| Environment/context | Selected production or test configuration/data connection set. |
| FID | GUID identity used to link a Velox module independently from its display name. |
| File lifecycle | Read/write/download/audit/error/issue/temp/Transport/delete handling across configured File Connection folders. |
| Flow | Persisted integration orchestration containing data, ordered steps, triggers, policy and logging. |
| Flow data item | A database/file data object attached to a Flow and used by its steps. |
| General Setup | Shared configuration module read by Designer/services for runtime, email, network, API, logging and retry settings. |
| Issue | Business/data status distinct from Warning and fatal Error. |
| Linked Flow | Successor Flow configured to run sequentially after a parent succeeds. |
| Log number | Persisted Flow/system log identifier used for correlation. |
| Map | Module that transforms data from a source Definition/view to a destination Definition/view. |
| Module | Persisted configuration unit with FID/name/folder/lifecycle and type-specific settings. |
| OpenAPI | Generated description of API paths/operations/data/security contract; declarations do not create runtime enforcement. |
| PascalScript | Script language/runtime used in Velox scripts, Maps, Scriptlets and events. |
| PKB | Internal Product Knowledge Base derived from source; not the public user site. |
| Report | ReportBuilder-backed module for formatted output, file, print or email workflows. |
| REST Flow | Flow configured with REST endpoint/method/request/response metadata for Velox API Service. |
| Scriptlet | Reusable PascalScript module included by scripts/Maps/Transports where supported. |
| Sub Action | Flow step that executes another Flow within the current orchestration context; distinct from a linked successor. |
| Test context | Separate configured environment; it reduces production risk but Test Run can still cause real external side effects. |
| Transport | Protocol-specific inbound/outbound exchange configuration and runtime operation. |
| Transport Log | Persisted queue/send/receive evidence with status, attempts and next-attempt state, separate from Flow completion. |
| Variable Group | Reusable typed values made available to scripts/runtime contexts; ordinary values are not automatically a secret vault. |
| Velox API Service | Windows service that hosts core REST Flow endpoints. |
| Velox Service | Windows service that hosts schedules, file monitors and inbound/outbound Transport processing. |
| VxConfig | Configuration database/context containing Velox modules and, in the reviewed implementation, persisted Velox log tables. |
| VxData | User/business data platform used by integrations and the VxData portal. |

Use the [core concepts](../getting-started/core-concepts.md) page for relationships and the [module type catalogue](module-type-catalogue.md) for current active choices.
