---
title: "Build APIs with Velox"
description: "Configure REST-enabled Flows, OpenAPI and an approved deployment boundary"
sidebar_position: 10
slug: /apis/
classification: public
status: approved
owner: Cam Hart
keywords: [api, openapi, rest]
---

Velox API Service can execute REST-enabled Flows. Designer groups those Flows into API modules and generates OpenAPI descriptions. A separate, approved gateway or front end must provide the public TLS, authentication, authorisation and network boundary.

The API capability has three distinct layers:

| Layer | Responsibility | Important boundary |
| --- | --- | --- |
| REST-enabled Flow | Endpoint path, method metadata, request/response Definitions, execution and status mapping | The reviewed core dispatcher executes GET and POST only. Flow logic owns business validation and side effects. |
| API module | Groups REST Flows and creates the OpenAPI document | Document generation does not deploy routes or enforce security. |
| Gateway/front end | Public route, TLS, authentication, authorisation, limits and documentation UI | This must be designed and operated as the untrusted-network security boundary. |

## Implementation path

1. Define the document identity and server metadata in [API module properties](api-module-properties.md).
2. [Configure a REST-enabled Flow](rest-flows.md) and test it locally with fictional data.
3. [Generate and export OpenAPI](openapi.md), then validate the document against actual behaviour.
4. [Deploy the API safely](api-deployment.md) behind an approved boundary.
5. Where approved, [publish through the Velox API front end](api-front-end.md).
6. Use [API troubleshooting](../../operate-and-troubleshoot/api-troubleshooting.md) without exposing credentials or payloads.

Do not expose Velox API Service directly to an untrusted network. OpenAPI security declarations describe a contract; they do not create runtime enforcement by themselves.
