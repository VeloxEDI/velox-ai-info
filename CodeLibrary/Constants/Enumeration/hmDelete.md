---
title: hmDelete
description: Selects an outbound HTTP DELETE request while the current Velox API runtime does not execute inbound DELETE.
sidebar_position: 147
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, http, delete, idempotent, api]
---

```Delphi
hmDelete = 5
```

### Example

```Delphi
procedure DeleteResource(Client: TvxHTTP; const URL: String);
begin
  Client.Delete(URL);
end;
```

### Usage

`hmDelete` selects an outbound HTTP DELETE request while the current Velox API runtime does not execute inbound DELETE.

### Additional Technical Info
`hmDelete` is ordinal 5 of [`TvxHTTPMethod`](../../Types/Enumerations/TvxHTTPMethod.md). [`TvxHTTP.Delete`](../../Classes/HTTP/TvxHTTP/Methods/Delete.md) selects it and calls Indy's DELETE overload that captures response content.

Velox does not pass its staged `Content` stream to DELETE. Any previously loaded request content is ignored for dispatch and then cleared in `finally`. Put request selectors, identifiers or preconditions in the URL and headers according to the target API rather than assuming a DELETE body will be sent.

DELETE is idempotent in standard HTTP semantics but is not safe: it requests removal of an association/resource. Idempotency does not guarantee that repeated responses, audit events or asynchronous side effects are identical. Retry only when the endpoint contract, identifiers and failure evidence make it safe; use conditional fields where the API supports them.

Velox returns HTTP error status/content through `Response` rather than raising protocol-status exceptions, so check the result explicitly. Transport/setup failures can still raise. Generated OpenAPI maps this enum to DELETE, but the current inbound `TvxRESTManager` has no DELETE execution branch and does not enforce stored `RESTMethod`.

The example is source-reviewed only; no DELETE, API, network, runtime or image test ran.

**Related Code Library entries**

- [`hmGet`](hmGet.md) - safe retrieval.
- [`hmPut`](hmPut.md) - idempotent representation update.
- [`TvxHTTP.Delete`](../../Classes/HTTP/TvxHTTP/Methods/Delete.md) - outbound call.

**External references**

- [RFC 9110 DELETE](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.5).
- [RFC 9110 idempotent methods](https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2).

<small>Created 2026-07-15</small>
