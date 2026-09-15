---
title: hmPut
description: Selects an outbound HTTP PUT request using staged content to create or replace the target representation.
sidebar_position: 153
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, http, put, idempotent, replacement]
---

```Delphi
hmPut = 2
```

### Example

```Delphi
procedure PutJSON(Client: TvxHTTP; const URL, JSON: String);
begin
  Client.Header['Content-Type'] := 'application/json';
  Client.ContentAsUTF8 := JSON;
  Client.Put(URL);
end;
```

### Usage

`hmPut` selects an outbound HTTP PUT request using staged content to create or replace the target representation.

### Additional Technical Info
`hmPut` is ordinal 2 of [`TvxHTTPMethod`](../../Types/Enumerations/TvxHTTPMethod.md). [`TvxHTTP.Put`](../../Classes/HTTP/TvxHTTP/Methods/Put.md) selects it and passes the staged `Content` stream to Indy when nonempty; an empty stream becomes no content stream.

Clear `Client.Content` before replacing a payload more than once prior to sending. The `ContentAs*` setters overwrite from position zero but do not truncate a longer existing stream, and `LoadFromStream` copies at the current destination position without clearing. Stale trailing or appended bytes otherwise become part of the request because Indy transmits the whole stream size.

PUT requests creation or replacement of the target resource state with the supplied representation. It is not automatically a partial update; use [`hmPatch`](hmPatch.md) where the endpoint defines patch semantics. Set the correct content type/encoding and include all fields required by the API. Velox does not serialize or validate the representation.

PUT is idempotent under HTTP semantics, but repeated requests can still produce different timestamps, audit entries, notifications or responses in a non-conforming/application-specific server. Use resource versions, `If-Match` or equivalent concurrency controls to avoid overwriting intervening changes. Idempotency makes retry more plausible than POST, not universally safe.

Velox clears staged request content and disconnects after every attempt, and exposes HTTP error status/content through `Response`. Generated OpenAPI maps this enum to PUT. The current inbound Velox API runtime has no PUT execution branch and does not compare stored `RESTMethod` when GET/POST arrive.

The example is source-reviewed only; no PUT, API, concurrency, network, runtime or image test ran.

**Related Code Library entries**

- [`hmPatch`](hmPatch.md) - partial modification.
- [`hmPost`](hmPost.md) - resource-specific processing/create.
- [`TvxHTTP.Put`](../../Classes/HTTP/TvxHTTP/Methods/Put.md) - outbound call.

**External references**

- [RFC 9110 PUT](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.4).
- [RFC 9110 idempotent methods](https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2).

<small>Created 2026-07-15</small>
