---
title: "Generate and export OpenAPI"
description: "Configure API metadata and produce an OpenAPI 3.0 document"
sidebar_position: 50
slug: /apis/openapi
classification: public
status: approved
owner: Cam Hart
keywords: [openapi, schema, api]
---

An API module groups REST Flows and generates an OpenAPI 3.0.4 JSON document. It describes the intended contract; validate it against the deployed runtime before publication. Module name, version and at least one production or test server URL are required for generation.

## Generated content

The generator builds document information and servers from [API module properties](api-module-properties.md), then adds an operation for each linked REST Flow. The operation includes configured method/path metadata, groups, summary, description, parameters, request and response Definition schemas, MIME types and the configured success/client/server response codes.

It also declares:

- an API-key security scheme using the `X-ApiKey` request header; and
- a bearer scheme described as a JWT bearer token.

These declarations describe possible client contracts. They do not configure or enforce authentication in the reviewed Velox API Service dispatcher. Publish only schemes that the deployed gateway genuinely implements and tests.

## Generate the document

1. Create or open an API module in the test context.
2. Enter the API name, version, description and reviewed test and production base URLs. At least one URL is required.
3. Add only active, tested REST Flows. Review endpoint uniqueness, methods, request/response Definitions, parameters and status codes.
4. Enter contact, terms, licence, tags and external-documentation values only when approved.
5. Select **Create OpenAPI schema** and resolve every validation error.
6. Inspect the JSON, then export it to a selected `.json` file or the configured web installation path. The default safe filename is derived from API name and version; web export writes beneath `wwwroot/openapi`.
7. Validate the exported document with an approved OpenAPI validator and exercise every operation through the deployed gateway.

## Contract checks

Generated API-key and bearer schemes do not establish authentication in Velox API Service. Ensure the document matches the gateway's real credential, scope and error contract. Also compare each operation with observed runtime behaviour because the current dispatcher supports GET and POST only and does not visibly enforce the configured REST method.

Check that:

- every path is stable and unique, and no FID-based temporary path remains;
- request/response required fields, types, formats, MIME types and examples match the selected Definitions;
- response codes and `application/problem+json` errors match tested outcomes;
- server URLs do not expose internal hostnames or an unintended test environment;
- contact, licence and external-documentation values are approved for public disclosure; and
- security requirements match gateway enforcement, including anonymous endpoints and scopes.

Regenerate and redeploy the document whenever a linked Flow contract changes. Keep the prior approved file for rollback and verify that the front end serves the expected version.

- [Configure REST Flows](rest-flows.md)
- [Use the API front end](api-front-end.md)
