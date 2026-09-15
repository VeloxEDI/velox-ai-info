---
title: hmPatch
description: Selects an outbound HTTP PATCH request using the staged Velox content stream for a partial modification document.
sidebar_position: 151
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, http, patch, partial-update, concurrency]
---

```Delphi
hmPatch = 4
```

### Example

```Delphi
procedure ApplyPatch(Client: TvxHTTP; const URL, PatchJSON: String);
begin
  Client.Header['Content-Type'] := 'application/merge-patch+json';
  Client.ContentAsUTF8 := PatchJSON;
  Client.Patch(URL);
end;
```

### Usage

`hmPatch` selects an outbound HTTP PATCH request using the staged Velox content stream for a partial modification document.

### Additional Technical Info
`hmPatch` is ordinal 4 of [`TvxHTTPMethod`](../../Types/Enumerations/TvxHTTPMethod.md). [`TvxHTTP.Patch`](../../Classes/HTTP/TvxHTTP/Methods/Patch.md) selects it and passes the staged `Content` stream to Indy's PATCH method when its size is nonzero; an empty stream becomes no request content.

Clear `Client.Content` before replacing a payload more than once prior to sending. The `ContentAs*` setters overwrite from position zero but do not truncate an existing longer stream; `LoadFromStream` copies at the current destination position without clearing. Stale trailing or appended bytes otherwise become part of the final request because Indy transmits the whole stream size.

The body is a patch document, not automatically a complete replacement. Set the exact media type required by the API (for example JSON Patch or JSON Merge Patch), use the API's expected character encoding and validate generated operations. Velox does not create or validate patch syntax.

PATCH is neither safe nor inherently idempotent. A specific patch format/operation can be idempotent, but repeated increments, appends or position-sensitive edits are not. Use ETag/`If-Match`, idempotency keys or API-specific version controls where available, and do not blindly retry after an ambiguous transport failure.

After any attempt, Velox clears staged request content and disconnects. It returns HTTP error status/content in `Response`; inspect both. Generated OpenAPI maps this enum to PATCH, but the current inbound Velox API runtime has no PATCH execution branch and does not enforce stored `RESTMethod`.

The example is source-reviewed only; no PATCH, API, concurrency, network, runtime or image test ran.

**Related Code Library entries**

- [`hmPut`](hmPut.md) - complete create/replace semantics.
- [`hmPost`](hmPost.md) - general resource-specific processing.
- [`TvxHTTP.Patch`](../../Classes/HTTP/TvxHTTP/Methods/Patch.md) - outbound call.

**External references**

- [RFC 5789 PATCH](https://www.rfc-editor.org/rfc/rfc5789#section-2).

<small>Created 2026-07-15</small>
