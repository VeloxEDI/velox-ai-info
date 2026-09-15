---
title: "Configuration-field index"
description: "Find the detailed page that owns each Velox configuration field group."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [configuration field index, settings, fields, option groups]
---

This is a discovery index. The linked page owns field names, defaults, conditions, persistence/runtime effect and verification; this page does not duplicate those tables.

| Object/group | Configuration areas | Owning reference |
| --- | --- | --- |
| Environment | Connections.json profiles; Config/Log/Data roles; production/test paths/credentials | [Environment properties](../administer-velox/environments/properties-and-paths.md) |
| General Setup | System/runtime; database; email/SMTP; network/proxy; API/web; retry/cache/performance; logging/reporting | [General Setup](../administer-velox/general-setup/index.md) |
| Common module | FID, folder, name/description, active/archive and inherited lifecycle | [Common module properties](../administer-velox/modules-and-folders/common-module-properties.md) |
| Folder | Parent/name/module mask/organisation | [Folders and naming](../administer-velox/modules-and-folders/folders-naming-and-organisation.md) |
| Common Connection | Identity, credential/environment ownership, lifecycle/testing | [Common Connection properties](../design-and-build/connections/common-connection-properties.md) |
| DB Connection | Method plus host/database/auth/provider/driver/DSN/other parameters/pool/transaction/TLS fields | [Database Connections](../design-and-build/connections/database/index.md) |
| File Connection | Folder/path, filename/pattern, naming/counter and audit/error/issue/duplicate/temp/Transport lifecycle | [File Connections](../design-and-build/connections/file/index.md) |
| Common Definition | Connection, name/structure, fields, validation and relationship rules | [Common Definition properties](../design-and-build/data-definitions/common-definition-properties.md) |
| DB Definition | SQL/table/query/field/key/update rules | [Database Definitions](../design-and-build/data-definitions/database-definitions.md) |
| File Definition | Format-independent file/MIME/encoding/error rules plus Flat/XML/JSON/EDI/Excel options | [File Definitions](../design-and-build/data-definitions/file/index.md) |
| Flow | Description/data/step links, execution type, concurrency/retry/status/logging/notification and trigger settings | [Flow properties and policy](../design-and-build/flows/flow-properties-and-execution-policy.md) |
| Flow data | Database/file item Definition, source/destination role and item-level settings | [Flow data](../design-and-build/flows/data/index.md) |
| Flow steps | Step type, selected module/Definition/Connection, script/SQL/output/route/command/Sub Action settings | [Flow steps](../design-and-build/flows/steps/index.md) |
| Schedule/file monitor/REST/links | Trigger timing, monitor Connection, endpoint/method/request/response, predecessor/successor | [Flow execution policy](../design-and-build/flows/flow-properties-and-execution-policy.md) and its trigger child pages |
| Map | Source/destination, mapping rows, formulas/scripts/events and runtime output | [Maps](../design-and-build/transformations-output/maps/index.md) |
| Report | Data source, ReportBuilder layout, output format/file/email/print and runtime | [Reports](../design-and-build/transformations-output/reports/index.md) |
| SQL Script | DB Connection and SQL workspace | [SQL Scripts](../design-and-build/transformations-output/sql-scripts.md) |
| Scriptlet/Variable Group | Includes/script body; variable name/type/value/encryption/environment/cache | [Reusable logic](../design-and-build/transformations-output/index.md) |
| Transport common | Direction, file/Definition, authentication/OAuth, TLS/certificate/key, proxy, timeout, retry and logging | [Shared Transport settings](../design-and-build/transports/authentication-tls-proxy-timeout-and-retry.md) |
| Transport concrete | Protocol/direction-specific server/path/mailbox/queue/request/output fields | [Transport guide](../design-and-build/transports/index.md) |
| API module | Name/version/description, prod/test servers, groups/descriptions, terms/contact/licence/docs/actions/schema | [API module properties](../design-and-build/apis-and-openapi/api-module-properties.md) |
| REST Flow | Endpoint/method/groups/description/parameters/status codes/anonymous flag/request-response Definitions | [REST Flow configuration](../design-and-build/apis-and-openapi/rest-flows.md) |
| VxData portal | User/role/party assignments, settings, Flow mappings and reference-data families | [Portal administration](../vxdata-portal/administration.md) |

If a current UI field has no owning row/page, record the exact Velox version, form/object and field label and raise a documentation gap; do not infer behaviour from its label alone.
