---
title: Delete
description: Sends a synchronous bodyless DELETE request and captures the response body and metadata through the shared Velox HTTP client pipeline.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, delete, request, response]
---

```Delphi
procedure Delete(const aURL: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Header['Accept'] := 'application/json';
  Http.Delete('https://api.example.invalid/resources/example-123');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

Sends a synchronous bodyless DELETE request and captures the response body and metadata through the shared Velox HTTP client pipeline.

### Additional Technical Info
`Delete` selects `hmDelete`, stores `aURL`, and synchronously sends Indy's DELETE request. It supplies no request-body stream even if [`Content`](../Properties/Content.md) is pending. The pending body is nevertheless normally cleared during finalisation, so loading content before DELETE discards it without transmission.

The response body is captured in [`Response.Content`](../../TvxHTTPResponse/Properties/Content.md), rewound to zero after a completed call, and accompanied by live Indy response metadata. HTTP 4xx/5xx statuses normally do not raise; inspect `Response.Success`, `Response.ResponseCode` and the representation. DNS, socket, TLS, proxy and stream failures can raise.

DELETE asks the origin server to apply its defined semantics to the target resource; Velox does not confirm deletion, implement retries, add preconditions or make the operation idempotent. Use `If-Match` or another service-defined concurrency control through [`Header`](../Properties/Header.md) when required. Do not automatically retry an ambiguous failed call unless the endpoint contract makes that safe.

The URL is not allowlisted or normalised by this method. Avoid building it from untrusted input, and remember that redirects are enabled by default. The local SSL configuration does not enable peer-certificate verification.

The call blocks the script thread. Stored headers, cookies and authentication configuration remain on the client; request content is normally one-shot.

**External references**

- [RFC 9110 section 9.3.5: DELETE](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.5)
- [RFC 9110 section 13.1.1: If-Match](https://www.rfc-editor.org/rfc/rfc9110#section-13.1.1)
- [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525)

<small>Created 2026-07-15</small>
