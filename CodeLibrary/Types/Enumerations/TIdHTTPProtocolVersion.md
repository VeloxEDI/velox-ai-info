---
title: TIdHTTPProtocolVersion
description: Selects the HTTP/1.0 or HTTP/1.1 request version exposed by a TvxHTTP client.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, http, protocol, indy]
---

```Delphi
TIdHTTPProtocolVersion = (pv1_0, pv1_1)
```

### Example

```Delphi
procedure ConfigureHTTP(Client: TvxHTTP);
begin
  Client.ProtocolVersion := pv1_1;
end;
```

### Usage

`TIdHTTPProtocolVersion` selects the HTTP/1.0 or HTTP/1.1 request version exposed by a TvxHTTP client.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| [`pv1_0`](../../Constants/Enumeration/pv1_0.md) | 0 | Write `HTTP/1.0`; restrict five methods and use explicit keep-alive compatibility rules. |
| [`pv1_1`](../../Constants/Enumeration/pv1_1.md) | 1 | Write `HTTP/1.1`; this is the Velox default. |

#### Behavior and boundaries

- The selected member controls the exact HTTP version written in the outbound request. Velox does not negotiate the highest supported version before sending.
- POST preserves the selected member; it is not forced to HTTP/1.0.
- TRACE, PUT, OPTIONS, DELETE and PATCH require `pv1_1` in this Velox. GET, HEAD and the modified POST path accept either member.
- For `pv1_0`, Velox adds a keep-alive request header when none is present and requires an explicit keep-alive response header. For `pv1_1`, it assumes persistence unless a close header or socket state says otherwise.
- Keep-alive behaviour uses the configured request version rather than the response version. `TvxHTTP` disconnects after each completed script request and does not reuse the socket across calls.
- A server can answer using a different HTTP/1.x version. Velox reports an unrecognised response version as `pv1_0`.
- Do not downgrade as a TLS workaround; HTTP and TLS versions are separate. This enum also cannot select HTTP/2 or HTTP/3.
- Changing the property affects subsequent request construction. It does not renegotiate a completed request or reset headers, authentication, redirects, proxy settings, cookies or content.

### Additional Technical Info
`TIdHTTPProtocolVersion` is the two-value Indy request-version selector exposed by `TvxHTTP.ProtocolVersion`. A new `TvxHTTP` instance, a new Velox HTTP transport and the underlying Indy client all default to `pv1_1`.

This selector covers only HTTP/1.0 and HTTP/1.1. It does not enable HTTP/2 or HTTP/3, and it does not by itself define redirect, proxy, authentication, timeout or TLS behavior.

**Related Code Library entries**

- [TvxHTTP.ProtocolVersion](../../Classes/HTTP/TvxHTTP/Properties/ProtocolVersion.md) - direct property wrapper and default.
- [TvxHTTP](../../Classes/HTTP/TvxHTTP.md) - request lifecycle, authentication and response state.

**External references**

- [RFC 1945 HTTP/1.0](https://www.rfc-editor.org/rfc/rfc1945) - HTTP/1.0 protocol definition.
- [RFC 9112 HTTP/1.1](https://www.rfc-editor.org/rfc/rfc9112) - current HTTP/1.1 message syntax and connection management.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal and enumeration semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration and ordinal concepts.

<small>Created 2026-07-15</small>
