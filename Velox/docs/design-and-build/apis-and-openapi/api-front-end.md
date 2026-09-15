---
title: "Use the Velox API front end"
description: "Publish proxy routes and API documentation through an approved front end"
sidebar_position: 40
slug: /apis/api-front-end
classification: public
status: approved
owner: Cam Hart
keywords: [api-proxy, scalar, swagger]
---

The current `velox-web2` API gateway can read active API/Flow configuration, publish proxy routes to Velox API Service and serve Scalar or Swagger documentation. Treat it as a deployment component whose exact build, configuration and security controls must pass the [API deployment gate](api-deployment.md); repository scaffold or sample UI is not automatically a supported production feature.

## What the front end provides

| Capability | Source of configuration | Operator responsibility |
| --- | --- | --- |
| Proxy routes | Active API and REST Flow rows | Validate uniqueness, paths, methods and upstream target before accepting traffic. |
| OpenAPI/interactive reference | Exported OpenAPI JSON | Deploy the matching approved file and prevent unintended test/internal server details from being published. |
| Gateway boundary | Deployment configuration and middleware | Configure real TLS, authentication, authorisation, request limits, rate limits, header policy and logging. These are not supplied by an API module. |

## Publish an approved build

1. Configure protected VxConfig/VxData connections and the upstream Velox API Service address through the deployment's secret/configuration mechanism.
2. Deploy the validated OpenAPI JSON using the filename configured by the API module.
3. Validate every database-derived route for non-empty, unique, permitted paths and methods before startup.
4. Configure approved authentication, authorisation, TLS and header allowlists. Ensure the upstream rejects spoofed identity headers from all other sources.
5. Apply body-size, request-time, connection and rate limits appropriate to downstream capacity. Decide how retries and idempotency are handled before enabling mutating POST routes.
6. Start the front end and confirm its route/document inventory.
7. Test the gateway contract end to end, including authentication/authorisation failures, body forwarding, query encoding, content types, status mapping, correlation and restart-required configuration changes.

The repository also contains template/scaffold UI. Do not present sample pages as supported Velox product workflows. Missing OpenAPI files, invalid database rows or conflicting routes can prevent correct publication.

If validation fails, remove public routing and restore the prior approved build/configuration/document set. Preserve gateway and Velox correlation evidence without retaining secrets or sensitive payloads unnecessarily.

- [Generate OpenAPI](openapi.md)
- [Troubleshoot API requests](../../operate-and-troubleshoot/api-troubleshooting.md)
