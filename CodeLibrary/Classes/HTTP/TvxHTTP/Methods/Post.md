---
title: Post
description: Sends a synchronous POST with the nonempty pending body, while the bundled Indy overload temporarily forces HTTP/1.0 for this request.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, post, request-body, http-1-0, quirk]
---

```Delphi
procedure Post(const aURL: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.ContentAsUTF8 := '{"event":"example"}';
  Http.Header['Content-Type'] := 'application/json';
  Http.Post('https://api.example.invalid/events');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

Sends a synchronous POST with the nonempty pending body, while the bundled Velox overload temporarily forces HTTP/1.0 for this request.

### Additional Technical Info
`Post` selects `hmPost`, stores `aURL`, and synchronously invokes Indy's stream POST overload. A nonempty pending [`Content`](../Properties/Content.md) is sent in full from position zero; an empty stream is passed as no source.

The bundled Indy implementation has a material protocol quirk: unless its unexposed `hoKeepOrigProtocol` option is set, the stream POST overload temporarily changes the client to HTTP/1.0, performs the request, then restores the prior [`ProtocolVersion`](../Properties/ProtocolVersion.md). `TvxHTTP` never enables that option. Therefore this method uses HTTP/1.0 even when the property reads `pv1_1`; other verb wrappers do not share this automatic downgrade.

Velox does not infer `Content-Type`, schema, form encoding or idempotency. Set headers explicitly. The server decides POST semantics and status. Avoid blind retries after timeouts/disconnects because the origin may have processed the request before the client observed failure; use a service-defined idempotency key where supported.

The response body is captured and rewound. HTTP error statuses normally remain inspectable rather than raising. Operational failures raise after the normal finaliser, which clears the request body, disconnects and flushes the intercept. An earlier authentication preflight exit can preserve the body and return without sending.

The call blocks and retains headers, cookies and authentication configuration across calls. URLs are unrestricted, raw traffic can enter HTTP communication logs, and the local SSL path does not enable peer-certificate verification.

**External references**

- [RFC 9110 section 9.3.3: POST](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.3)
- [RFC 9112 section 2.3: HTTP Version](https://www.rfc-editor.org/rfc/rfc9112#section-2.3)
- [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525)

<small>Created 2026-07-15</small>
