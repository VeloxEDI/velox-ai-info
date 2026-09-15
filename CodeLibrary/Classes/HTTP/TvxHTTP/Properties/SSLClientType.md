---
title: SSLClientType
description: Selects the local Indy SSL/TLS protocol value while exposing misleading aliases and no server-certificate validation.
sidebar_position: 24
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, tls, ssl, certificate-validation]
---

```Delphi
property SSLClientType: TvxSSLClientType read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.SSLClientType := fstTLS12;
  Http.Get('https://api.example.invalid/v1/status');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

`SSLClientType` selects the local Velox SSL/TLS protocol value while exposing misleading aliases and no server-certificate validation.

### Additional Technical Info
`SSLClientType` controls whether Velox attaches its local OpenSSL handler and which single Indy `TIdSSLVersion` it assigns. A new client uses `fstAuto`. The exact script [`TvxSSLClientType`](../../../../Types/Enumerations/TvxSSLClientType.md) mapping is:

| Script value | Display label | Actual current Indy value |
|---|---|---|
| `fstNoSSL` | None | Removes the local SSL handler; the array's unused entry is TLS 1.2. |
| `fstAuto` | Auto | TLS 1.2 only; it is not automatic negotiation across the enum. |
| `fstTLS13` | TLS v1.3 | TLS 1.2; it does not enable TLS 1.3. |
| `fstTLS12` | TLS v1.2 | TLS 1.2. |
| `fstTLS11` | TLS v1.1 | TLS 1.1. |
| `fstTLS1` | TLS v1 | TLS 1.0. |
| `fstSSL3` | SSL v3 | SSL 3.0. |
| `fstTLS1_2` | old | TLS 1.2. |
| `fstTLS1_1` | old | TLS 1.2, despite the identifier. |

`fstTLS11`, `fstTLS1` and `fstSSL3` select obsolete protocol versions and may be refused by the OpenSSL library or server. `fstTLS13` is a misleading compatibility label. Use `fstTLS12` for an explicit statement of what the reviewed mapping actually selects.

This property does **not** establish server identity. The local handler leaves `VerifyMode` empty, configures no root certificate store, and therefore does not enable peer verification. Its assigned `OnVerifyPeer` callback also ignores the library result and always returns `True`, which would accept a failed check if verification were enabled elsewhere. HTTPS through this helper must not be represented as certificate-validated.

`fstNoSSL` sets `FHTTP.IOHandler` to `nil`. It is suitable only for an intentionally clear-text `http` endpoint; using it with `https` will not create a secure session through this local configuration. Conversely, non-`fstNoSSL` values cause proxy auto-detection to request HTTPS proxy settings even when the starting URL uses `http`. The URL test also searches for the text `HTTPS` anywhere rather than parsing only the scheme.

The property is read before every resource request, so protocol selection changes apply to the next call. It does not clear authentication or OAuth state. The nested HTTP clients used for OAuth client-credentials and password grants create their own default handler and inherit the same validation gap. If a host injects a transport and disables local SSL, `ConfigureSSL` returns without using this field; the host's handler/configuration is then authoritative.

**External references**

- [RFC 9325: Recommendations for Secure Use of TLS and DTLS](https://www.rfc-editor.org/rfc/rfc9325)
- [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525)

<small>Created 2026-07-15</small>
