---
title: "API module properties"
description: "Configure API document identity, server URLs, groups, contact/licence metadata, linked REST Flows and generated OpenAPI schema."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [API module, OpenAPI metadata, server URL, groups, linked REST Flow]
---

An API module groups REST-enabled Flows and generates an OpenAPI document. It documents and exports an API surface; it does not itself enforce authentication, TLS, rate limiting or Flow runtime method checks.

## Properties

| Setting | New-API default | Effect/validation |
| --- | --- | --- |
| **API name** | New API | Module identity and base of the generated safe schema filename. |
| **Version** | `v1.0` | Required for schema generation and included in document/file identity. Use a governed API version, not a build timestamp. |
| **API description** | Empty | OpenAPI `info.description`. |
| **Production URL / description** | Empty / Production URL | Production `servers` entry. At least production or test URL is required to create a schema. |
| **Test URL / description** | Empty / Development URL | Non-production `servers` entry. Do not publish an internal address unintentionally. |
| **Groups** | Empty | Semicolon-separated OpenAPI tags. |
| **Group descriptions** | Empty | Descriptions split using `~`; keep order aligned with Groups. |
| **Terms of service** | Empty | OpenAPI terms URL/text as supported by the document library. |
| **Contact name / URL / email** | Empty | OpenAPI contact metadata. Publish only approved organisational details. |
| **Licence name / URL** | Empty | OpenAPI licence metadata. |
| **Documentation URL** | Empty | External documentation reference. |
| **API actions** | None | Child links to REST Flows included in the document. Each stores the Flow FID/name, active flag and created/updated dates. |
| **OpenAPI schema** | Empty | Generated JSON stored on the module; regenerate after API/Flow metadata changes. |

The schema filename is derived from a safe module name plus version and exported beneath the configured web install path's `wwwroot/openapi` folder or a user-selected JSON file. Runtime service endpoints are loaded separately; exporting JSON does not deploy/restart them.

## Linked API actions

Each API action links an API module to a Flow. The link records the Flow identity/name, whether the action is active, and created/updated dates. Keep the relationship governed with the Flow: changing a linked Flow endpoint, method metadata, Definitions or status codes changes the published contract when the schema is regenerated.

Group names are split on semicolons and group descriptions on `~`. Because those lists are positional, review the generated tags after adding, removing or reordering a group. An empty or misaligned description does not provide useful client guidance.

## Safe change procedure

1. Configure accurate metadata and approved server URLs.
2. Add only active, reviewed REST Flows and verify unique endpoints/method metadata.
3. Generate the document and resolve validation errors.
4. Review the JSON for unintended routes, internal addresses, data schemas and misleading security declarations.
5. Export/deploy through the governed API front-end process and run contract/security tests.

After a change, regenerate the schema and resynchronise or restart route-loading components as required. Neither saving the module nor exporting JSON proves that the running gateway and Velox API Service now use the new contract.

See [REST Flows](rest-flows.md), [OpenAPI generation](openapi.md) and [API deployment](api-deployment.md).
