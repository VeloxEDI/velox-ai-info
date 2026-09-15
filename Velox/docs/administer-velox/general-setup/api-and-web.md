---
title: "API and web settings"
description: "Configure shared Velox API URL, listener port and web/OpenAPI export values with their verified security limits."
sidebar_position: 60
classification: public
status: approved
owner: Cam Hart
keywords: [Velox API Service, API port, web path, TLS]
---

These values derive URLs and guide API/web integration. They do not by themselves deploy a gateway, configure authentication or prove TLS binding.

| UI purpose / property | Type/default | Verified use and limitation |
| --- | --- | --- |
| API domain / `VeloxAPIDomain` | host / `localhost` | Used to derive `VeloxAPIUrl` |
| API port / `VeloxAPIPort` | integer / `8359` | API Service listener port; service also falls back to `8359` when stored value is `0` |
| Enable API SSL / `VeloxAPIEnableSSL` | Boolean / `true` | Changes derived URL scheme. Reviewed API listener startup did not bind this flag to TLS. |
| API certificate / `VeloxAPICertificate` | path / empty | Stored certificate reference; reviewed listener startup did not load/bind it |
| API URL / `VeloxAPIUrl` | derived read-only | `https://localhost:8359` with defaults |
| Web domain / `VeloxWebDomain` | host / local FQDN | Used to derive web URL |
| Web port / `VeloxWebPort` | integer / `443` | Derived web URL port |
| Web install path / `VeloxWebInstallPath` | folder / test `c:\inetpub\Velox_Test\`, production `c:\inetpub\Velox\` | Used by API/OpenAPI export to `wwwroot\openapi\`; not the current Aspire deployment contract |
| Web URL / `VeloxWebUrl` | derived read-only HTTPS URL | Display/persisted address |

:::warning Do not rely on the SSL checkbox as the security boundary
Use an approved TLS termination and authentication/authorisation architecture. Validate the externally reachable route, certificate and identity controls independently.
:::

Restart Velox API Service after listener or endpoint changes. Test the intended REST Flow through the deployed gateway and verify request/response plus Flow logs. See [API deployment](../../design-and-build/apis-and-openapi/api-deployment.md).
