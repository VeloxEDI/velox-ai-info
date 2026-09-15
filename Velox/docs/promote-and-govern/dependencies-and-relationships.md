---
title: "Configuration dependencies and relationships"
description: "Find the complete module graph that must be evaluated for a Velox change."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [dependencies, relationships, Check Usage, FID]
---

Velox modules reference one another by identity and stored relations. A Flow can depend on Connections, Definitions, Maps, Reports, Transports, Scriptlets and Variable Groups; those modules can have further dependencies. A folder is organisational and does not prove the contained modules form a deployable package.

## Build the dependency scope

1. Start from the changed top-level module and use **Check Usage** to identify callers and shared consumers.
2. Review each configured field that selects another module, including Flow data, step modules, request/response Definitions, script includes and linked Flows.
3. Record infrastructure dependencies that are intentionally environment-owned: DB/File Connections, credentials, paths, proxy values, service settings and API server URLs.
4. Identify downstream assets outside ordinary module promotion: database objects/schema, runtime files, certificates/keys, binaries, external endpoints and gateway configuration.
5. Decide for each item whether to create, update, retain, duplicate or deploy separately in the target.

## Export behaviour

Configuration-template export recursively includes dependencies according to module type. For example, a Flow export can include source Definitions and referenced Map, Report and Transport modules; Map and Scriptlet export can include Scriptlets and Variable Groups. Default modules can be omitted and the exporter de-duplicates repeated FIDs.

Automatic inclusion is a useful starting inventory, not an approval decision. Inspect the resulting importer list and never assume a same-named target object has the same identity or settings.

After import, verify both directions: every required dependency resolves, and no shared target consumer was unintentionally changed. See [export and package](export-and-package.md) and [import and validate](import-and-validate.md).
