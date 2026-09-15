---
title: ProtocolVersion
description: Selects HTTP/1.0 or HTTP/1.1 for the next Indy request line, with version-specific method and connection rules.
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, protocol, http-1-0, http-1-1]
---

```Delphi
property ProtocolVersion: TIdHTTPProtocolVersion read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.ProtocolVersion := pv1_1;
  Http.Get('https://api.example.invalid/v1/status');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

`ProtocolVersion` selects HTTP/1.0 or HTTP/1.1 for the next Velox request line, with version-specific method and connection rules.

### Additional Technical Info
`ProtocolVersion` maps directly to Indy's two-value [`TIdHTTPProtocolVersion`](../../../../Types/Enumerations/TIdHTTPProtocolVersion.md): `pv1_0` writes `HTTP/1.0` and `pv1_1` writes `HTTP/1.1`. A new `TvxHTTP` explicitly uses `pv1_1`.

The wrapper getter and setter map directly to the underlying Indy field. Request construction writes the selected enum through the exact string table `('1.0', '1.1')`.

The compiled Velox Indy copy does **not** temporarily force [`pv1_0`](../../../../Constants/Enumeration/pv1_0.md) for [`Post`](../Methods/Post.md). That legacy save/change/restore block is fully commented out with a Velox instruction to preserve the user's setting. POST therefore uses the current property value. This differs from some upstream/older Indy behavior and corrects the previous version of this page.

Indy does refuse TRACE, PUT, OPTIONS, DELETE and PATCH when `pv1_0` is configured, raising an exception before sending. A matching custom method or method override is subject to the same check. GET, HEAD and the Velox-modified POST path accept either value.

The property affects the request version, connection/header behavior and method compatibility; it does not negotiate HTTP/2 or HTTP/3, and those versions are not script values. The server's response version is parsed separately and can differ from the request.

For HTTP/1.0, Indy supplies a keep-alive request header when none is present and retains the socket only if the response explicitly confirms keep-alive. For HTTP/1.1, it assumes persistence unless a close header or the socket state says otherwise. The decision currently uses this configured request value rather than the parsed response value.

Changing the value between requests is immediate and does not clear authentication, headers, cookies or content. `TvxHTTP.SendRequest` disconnects in `finally` after every request that reaches method dispatch, including dispatch failure, so it never preserves an open connection for the next wrapper call even when HTTP/1.1 keep-alive would permit one.

Use [`pv1_1`](../../../../Constants/Enumeration/pv1_1.md) unless a known endpoint requires legacy HTTP/1.0. Do not change this property as a TLS workaround: TLS selection, certificate validation, redirects, authentication, proxy routing, timeouts and request content are independent controls. Inspect actual wire logs only in a controlled environment because they may contain credentials and bodies.

**External references**

- [RFC 9112: HTTP/1.1](https://www.rfc-editor.org/rfc/rfc9112)
- [RFC 1945: HTTP/1.0](https://www.rfc-editor.org/rfc/rfc1945)

<small>Created 2026-07-15</small>
