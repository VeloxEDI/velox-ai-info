---
title: "Configure HTTP output"
description: "Configure HTTP upload method, headers, redirects, body/form encoding, multipart field name, TLS and retry."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [HTTP output, POST, multipart, ContentFieldName, headers]
---

| Setting | Default | Effect/quirk |
| --- | --- | --- |
| Host/URL | Empty | Tag-processed destination. Prevent untrusted data from choosing the host. |
| Send method | POST | HTTP method used to upload/send. |
| Form encoding | None | Body/form encoding mode. Match content type and receiver contract. |
| Content field name | `file` | Multipart file field; runtime falls back to `file` if blank. |
| Headers | Empty | Tag-processed custom headers. Avoid secrets in traces and ordinary configuration where dedicated auth exists. |
| Protocol version | HTTP/1.1 | HTTP/1.0 or HTTP/1.1. |
| Handle redirects / Follow location | Selected / selected | Redirect handling is active through **Handle redirects**; **Follow location** appears persisted but unused in reviewed initialisation. Test final host and whether authentication/body is replayed. |
| Connect / read timeout | `15` / `0` | Network waits; a timeout does not prove the server rejected the request. |

Test every configured method/encoding, exact headers/content type, empty/large/binary payloads, 2xx/4xx/5xx, redirect, TLS failures, proxy and ambiguous timeout. Use a request/business idempotency key where the receiver supports it and reconcile before retrying. A successful Flow registration is separate from this HTTP result and a successful HTTP result may still require business response validation. See [Transport operations](../operate-transports.md).
