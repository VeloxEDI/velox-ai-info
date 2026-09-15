---
title: TvxTLSType
description: Controls whether a transport uses no TLS, implicit TLS or an optional or required explicit TLS upgrade.
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, tls, starttls, implicit, transport, security]
---

```Delphi
TvxTLSType = (fttNoTLSSupport, fttImplicitTLS, fttUseRequireTLS, fttUseExplicitTLS)
```

### Example

```Delphi
procedure RequireExplicitTLS(var Mode: TvxTLSType);
begin
  Mode := fttUseRequireTLS;
end;
```

### Usage

`TvxTLSType` controls whether a transport uses no TLS, implicit TLS or an optional or required explicit TLS upgrade.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| `fttNoTLSSupport` | 0 | Do not use or request TLS. |
| `fttImplicitTLS` | 1 | Start TLS immediately on the implicit-TLS service/port. |
| `fttUseRequireTLS` | 2 | Use an explicit TLS upgrade and fail if the server cannot provide it. |
| `fttUseExplicitTLS` | 3 | Attempt an explicit TLS upgrade when available; the Velox policy can continue without it when unavailable. |

#### Behavior and boundaries

- `fttUseExplicitTLS` is opportunistic and can permit a plaintext connection if the upgrade is not offered. Use `fttUseRequireTLS` when confidentiality/authentication is mandatory.
- Implicit and explicit TLS normally use different service ports and server configurations. Selecting the wrong mode commonly causes handshake or protocol errors.
- `fttNoTLSSupport` and opportunistic fallback must never carry credentials or sensitive payloads over an untrusted network.
- TLS policy does not select the protocol version, validate certificates or configure authentication. Combine it with a secure SSL client mapping and certificate/hostname verification.
- STARTTLS-style upgrades can be stripped by an active attacker unless the client requires the upgrade. Log and fail closed on a required-mode negotiation failure.
- The same enum is reused by different Velox protocols; exact command sequencing and defaults come from the transport.

### Additional Technical Info
`TvxTLSType` maps directly to Indy's `TIdUseTLS` policy for mail and other TLS-upgradable protocols. It answers *when and whether TLS is required*; `TvxSSLClientType` separately selects the SSL/TLS protocol mapping.

Implicit TLS starts encryption as soon as the connection opens. Explicit modes connect in plaintext and request a protocol-specific upgrade such as STARTTLS.

**Related Code Library entries**

- [TvxSSLClientType](TvxSSLClientType.md) - protocol-version mapping used after TLS is selected.

**External references**

- [RFC 3207 SMTP STARTTLS](https://www.rfc-editor.org/rfc/rfc3207) - explicit TLS upgrade semantics for SMTP.
- [RFC 8314 email TLS](https://www.rfc-editor.org/rfc/rfc8314) - current guidance for cleartext, STARTTLS and implicit TLS.
- [RFC 8996 TLS deprecation](https://www.rfc-editor.org/rfc/rfc8996) - deprecated older TLS protocol versions.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration concepts.

<small>Created 2026-07-15</small>
