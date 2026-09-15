---
title: Head
description: Sends a synchronous HEAD request without a response-body destination while retaining status and header metadata on the response facade.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, head, headers, metadata]
---

```Delphi
procedure Head(const aURL: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Head('https://api.example.invalid/archive/current');
  Value := Http.Response.ContentLength;
end;
```

### Usage

Sends a synchronous HEAD request without a response-body destination while retaining status and header metadata on the response facade.

### Additional Technical Info
`Head` selects `hmHead`, stores `aURL`, and calls Indy's HEAD overload without a response-content stream. [`Response.Content`](../../TvxHTTPResponse/Properties/Content.md) is cleared before the request and remains empty; status and response headers are still read from the underlying Indy response.

The method also supplies no request body. Pending [`Content`](../Properties/Content.md) is ignored and then normally cleared during finalisation.

Servers are expected to return the same header fields they would have selected for GET, while omitting the content. A reported `Content-Length` describes the selected representation, not bytes stored in `Response.Content`. Velox does not issue a follow-up GET, validate metadata consistency or implement cache logic.

HTTP error statuses normally remain inspectable. Operational failures can raise; response metadata can be stale if no new response was received. Redirects, cookies, authentication, proxy and SSL settings follow the shared client lifecycle.

Use HEAD only when the origin supports it correctly. It is safe/idempotent by specification, but remote behavior is outside Velox's control. The call blocks, URLs are unrestricted by this method, and the reviewed local SSL path does not enable peer-certificate verification.

**External references**

- [RFC 9110 section 9.3.2: HEAD](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.2)
- [RFC 9110 section 8.6: Content-Length](https://www.rfc-editor.org/rfc/rfc9110#section-8.6)
- [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525)

<small>Created 2026-07-15</small>
