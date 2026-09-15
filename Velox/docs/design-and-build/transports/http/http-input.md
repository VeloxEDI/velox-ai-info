---
title: "Configure HTTP input"
description: "Configure HTTP download method, URL, headers, redirects, protocol, TLS and post-receive behaviour."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [HTTP input, GET, headers, redirect, TLS]
---

HTTP input retrieves content into the Transport/file runtime context.

| Setting | Default | Effect/quirk |
| --- | --- | --- |
| Host/URL | Empty | Tag-processed endpoint. Constrain dynamic host/path values to approved destinations. |
| Receive method | GET | HTTP method used for retrieval. Test the exact server contract. |
| Headers | Empty | Custom names/values, tag-processed at runtime. Never log or document live authorisation tokens. |
| Protocol version | HTTP/1.1 | HTTP/1.0 or HTTP/1.1 in the current component. |
| Handle redirects | Selected | Controls supported redirect handling. Validate final host, method/body behaviour and credential forwarding. |
| Follow location | Selected | Persisted but its assignment is commented out in the reviewed initialisation path; do not rely on it without a test. |
| After receiving | Nothing | The current enum exposes only no post-receive action. |
| Connect / read timeout | `15` / `0` | Connect seconds are converted to milliseconds in the HTTP wrapper; verify read-timeout zero semantics. |

Configure authentication/TLS on the [shared settings page](../authentication-tls-proxy-timeout-and-retry.md). Test success, 4xx/5xx, redirects to an unapproved host, invalid/untrusted/wrong-host certificates, timeout after server processing, large/invalid content and retry correlation. Peer-verification checkboxes alone are not sufficient evidence because reviewed generic verification callbacks can accept the library result unconditionally.
