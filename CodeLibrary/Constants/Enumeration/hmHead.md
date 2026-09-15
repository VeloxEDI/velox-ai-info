---
title: hmHead
description: Selects an outbound HTTP HEAD request and leaves the normal Velox response-content stream empty.
sidebar_position: 149
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, http, head, headers, metadata]
---

```Delphi
hmHead = 7
```

### Example

```Delphi
procedure RetrieveHeaders(Client: TvxHTTP; const URL: String);
begin
  Client.Head(URL);
end;
```

### Usage

`hmHead` selects an outbound HTTP HEAD request and leaves the normal Velox response-content stream empty.

### Additional Technical Info
`hmHead` is ordinal 7 of [`TvxHTTPMethod`](../../Types/Enumerations/TvxHTTPMethod.md). [`TvxHTTP.Head`](../../Classes/HTTP/TvxHTTP/Methods/Head.md) selects it and calls Indy's HEAD method without passing the Velox response-content stream.

HEAD asks for the response metadata that a corresponding GET would produce, without response content. Inspect response status and headers rather than `Response.Content`; Velox clears the response before dispatch and the HEAD branch does not fill that stream. Staged request content is also ignored and then cleared.

HEAD is safe and idempotent. It is useful for validators, content length, modification dates or availability checks, but servers can implement it incorrectly or omit fields, and a successful HEAD does not prove a later GET will remain unchanged. Avoid high-frequency polling and observe endpoint rate limits.

Generated OpenAPI maps this enum to HEAD. The current Velox API runtime does not execute inbound HEAD, however, and stored `RESTMethod` does not add a handler branch. The request wrapper contains a host `mtHead` mapping, but scripts only receive requests that the manager actually dispatches; currently that manager dispatches GET and POST only.

The example is source-reviewed only; no HEAD, API, network, runtime or image test ran.

**Related Code Library entries**

- [`hmGet`](hmGet.md) - corresponding representation retrieval.
- [`TvxHTTP.Head`](../../Classes/HTTP/TvxHTTP/Methods/Head.md) - outbound call.

**External references**

- [RFC 9110 HEAD](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.2).

<small>Created 2026-07-15</small>
