---
title: TvxSSLClientType
description: Selects the current Velox-to-Indy SSL/TLS client mapping, including several misleading or obsolete labels.
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, tls, ssl, http, security, indy]
---

```Delphi
TvxSSLClientType = (fstNoSSL, fstAuto, fstTLS13, fstTLS12, fstTLS11, fstTLS1, fstSSL3, fstTLS1_2, fstTLS1_1)
```

### Example

```Delphi
procedure ConfigureTLS(Client: TvxHTTP);
begin
  // Current source maps fstTLS12 to Indy's TLS 1.2 method.
  Client.SSLClientType := fstTLS12;
end;
```

### Usage

`TvxSSLClientType` selects the current Velox-to-Velox SSL/TLS client mapping, including several misleading or obsolete labels.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| `fstNoSSL` | 0 | Label `None`; mapped table value is TLS 1.2 but the HTTP IO handler is detached, so the client uses no TLS. |
| `fstAuto` | 1 | Label `Auto`; currently maps to TLS 1.2 only, not broad automatic negotiation. |
| `fstTLS13` | 2 | Label `TLS v1.3`; currently maps to TLS 1.2, so it does **not** enable TLS 1.3. |
| `fstTLS12` | 3 | Label `TLS v1.2`; maps to TLS 1.2. |
| `fstTLS11` | 4 | Label `TLS v1.1`; maps to TLS 1.1 (deprecated). |
| `fstTLS1` | 5 | Label `TLS v1`; maps to TLS 1.0 (deprecated). |
| `fstSSL3` | 6 | Label `SSL v3`; maps to SSL 3.0 (obsolete/insecure). |
| `fstTLS1_2` | 7 | Legacy label `old`; maps to TLS 1.2. |
| `fstTLS1_1` | 8 | Legacy label `old`; unexpectedly maps to TLS 1.2, not TLS 1.1. |

#### Behavior and boundaries

- `fstTLS13` is a name that does not match the behaviour. Do not claim TLS 1.3 compliance from this property or UI label.
- `fstAuto` is not an adaptive range in the current array; it is another TLS 1.2 selection.
- Never use `fstSSL3`, `fstTLS1` or `fstTLS11` for a new connection. Those protocol versions are obsolete/deprecated and expose known security weaknesses.
- `fstNoSSL` permits plaintext transport. Authentication credentials and bearer tokens must not be used with it.
- Actual security also depends on certificate validation, trust store, server name verification, cipher support and the OpenSSL/Velox runtime. This enum alone proves none of those.
- The enum is not a standards contract. Verify wire protocol independently when compliance matters.

### Additional Technical Info
`TvxSSLClientType` is a product configuration enum mapped through `IndySSLTypeArray` into one `TIdSSLVersion`. The display labels do not reliably describe negotiation or the selected protocol.

`TvxHTTP.ConfigureSSL` assigns the mapped Indy method and removes the IO handler only for `fstNoSSL`. All other members attach the SSL handler.

**Related Code Library entries**

- [TvxHTTP.SSLClientType](../../Classes/HTTP/TvxHTTP/Properties/SSLClientType.md) - direct client property and handler effect.
- [TvxHTTP.Certificate](../../Classes/HTTP/TvxHTTP/Properties/Certificate.md) - separate certificate configuration input.
- [TvxHTTP.AuthType](../../Classes/HTTP/TvxHTTP/Properties/AuthType.md) - credentials that require protected transport.

**External references**

- [RFC 8446 TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446) - TLS 1.3 protocol specification.
- [RFC 8996 TLS deprecation](https://www.rfc-editor.org/rfc/rfc8996) - deprecates TLS 1.0 and TLS 1.1.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration concepts.

<small>Created 2026-07-15</small>
