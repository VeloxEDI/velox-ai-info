---
title: "Network and proxy settings"
description: "Configure the shared proxy values used by Velox HTTP and related network consumers."
sidebar_position: 50
classification: public
status: approved
owner: Cam Hart
keywords: [proxy, network, Windows authentication, General Setup]
---

The shared proxy configuration is read by HTTP/email consumers that opt into it. A saved proxy is not proof that every Transport uses it; verify the concrete module and runtime path.

| Property | Type/default | Effect and conditions |
| --- | --- | --- |
| `ProxyEnabled` | Boolean / `false` field default | Enables proxy use for consumers that read General Setup |
| `ProxyHost` | string / empty | Proxy hostname |
| `ProxyPort` | integer / `0` | Proxy port; must be valid when enabled |
| `ProxyAuthType` | enum / none | Reviewed selection handles none, basic and Windows authentication |
| `ProxyUsername` | string / empty | User for authenticated proxy |
| `ProxyPassword` | encrypted persisted string / empty | Proxy secret |
| `ProxyDomain` | string / empty | Domain for Windows/NTLM-style authentication |
| `ProxyAddress` | derived `host:port` | Convenience value derived from host/port |

## Validation

1. Confirm whether the target concrete Transport/consumer reads the shared proxy.
2. Test DNS, TCP and proxy authentication under the runtime service identity.
3. Use a controlled endpoint and inspect the HTTP/Transport log without enabling sensitive body/header logging unnecessarily.
4. Verify bypass/direct-connect expectations outside Velox; no universal bypass list is documented in the reviewed setup fields.

Do not copy a user's interactive proxy credentials into a service configuration. Use a purpose-approved identity and protect the encrypted configuration and logs.
