---
title: "Transport authentication, TLS, proxy, timeout and retry"
description: "Configure shared Transport endpoint, authentication, OAuth, certificate, TLS, timeout, proxy, logging and retry controls."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [Transport authentication, TLS, OAuth, proxy, timeout, retry]
---

Concrete Transports inherit a shared endpoint/security contract, then expose only the controls applicable to their protocol. A setting being saved is not proof that its protocol implementation consumes it; follow the concrete page.

## Endpoint and authentication

| Property | Base default | Effect |
| --- | --- | --- |
| Host | Empty | Tag-processed host, URL or server value. Validate the evaluated value and prevent untrusted host substitution. |
| Port | `0` | Concrete protocols normally override it. Use the approved server port, not only the conventional default. |
| Authentication type | None | Protocol-dependent authentication mode. |
| In-process authentication | Cleared | Selects an in-process path where the concrete implementation uses it. |
| User name | Empty | Tag-processed login. |
| Password | Empty | Encrypted persisted value, decrypted and tag-processed at runtime. Encryption uses application-held reversible key material; restrict configuration/export/log access. |
| Client ID, tenant, scope, authorisation URL, token URL | Empty | OAuth metadata used only by supporting implementations. Do not assume that selecting OAuth provides token storage/rotation or gateway enforcement. |

Use dedicated credential/key-vault integration where the deployment provides it. Never put secrets in headers, scripts, ordinary variables or screenshots.

## TLS and keys

| Property | Default | Effect/quirk |
| --- | --- | --- |
| SSL client type | Auto; FTP overrides to No SSL | TLS preference. The reviewed `TLS 1.3` enum mapping selects TLS 1.2, so its label does not prove TLS 1.3. Test negotiated protocol externally. |
| TLS mode | Implicit TLS | Protocol-specific implicit/explicit mode. |
| Root certificate, client certificate, client key | Empty | File/reference paths required on each runtime host. |
| Client-key password | Empty | Encrypted persisted secret. |
| Verify peer / fail without peer / verify once | Selected / selected / selected | Intended certificate checks. Reviewed generic HTTP/email verification callbacks can return success regardless of the library's incoming result; never treat checkboxes alone as proof of peer validation. Test with valid, wrong-host and untrusted certificates. |
| Certificate depth | `3` | Verification chain depth where used. |
| Private key | Empty | Key content/reference for SFTP/OAuth/key paths. Generated key algorithm/size/curve fields are runtime controls rather than normal persisted Transport properties. |

## Timeouts, proxy, retry and logs

Connect timeout defaults to `15`; HTTP passes it as seconds converted to milliseconds. Read timeout defaults to `0` except MSMQ input (`1`); library-specific units/zero semantics must be tested. Protocols can add control/transfer timeouts.

Proxy behaviour also depends on General Setup and the concrete client. Test from the service host/account and document bypass/DNS/TLS interception. Transport retry uses General Setup maximum attempts/interval and is independent from Flow auto-retry. Before replay, reconcile queue/log/receiver state.

HTTP and Transport communication traces can contain credentials, tokens, headers or payloads because no general redaction layer was found. Keep high-detail logging approved, access-controlled and temporary. See [operate Transports](operate-transports.md) and [Flow retry](../flows/runtime/retry-failure-and-cancellation.md).
