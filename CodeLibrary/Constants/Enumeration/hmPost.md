---
title: hmPost
description: Selects HTTP POST with the staged content stream and identifies requests executed by the current inbound Velox API runtime.
sidebar_position: 152
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, http, post, request-body, api]
---

```Delphi
hmPost = 3
```

### Example

```Delphi
procedure PostJSON(Client: TvxHTTP; const URL, JSON: String);
begin
  Client.Header['Content-Type'] := 'application/json';
  Client.ContentAsUTF8 := JSON;
  Client.Post(URL);
end;
```

### Usage

`hmPost` selects HTTP POST with the staged content stream and identifies requests executed by the current inbound Velox API runtime.

### Additional Technical Info
`hmPost` is ordinal 3 of [`TvxHTTPMethod`](../../Types/Enumerations/TvxHTTPMethod.md). [`TvxHTTP.Post`](../../Classes/HTTP/TvxHTTP/Methods/Post.md) selects it and supplies the staged `Content` stream when nonempty; otherwise Indy receives no content stream.

Clear `Client.Content` before replacing a payload more than once prior to sending. The `ContentAs*` setters overwrite from position zero but do not truncate a longer existing stream, and `LoadFromStream` copies at the current destination position without clearing. Stale trailing or appended bytes otherwise become part of the request because Indy transmits the whole stream size.

POST asks the target resource to process the enclosed representation according to resource-specific semantics. Set `Content-Type`, encoding, authorization and any idempotency/correlation headers before the call. Velox does not infer the media type from `ContentAsUTF8` or validate JSON/XML. It clears the content stream and disconnects after every attempt, so reload the body before a deliberate retry.

POST is not inherently safe or idempotent. An ambiguous connection failure may occur after the server committed a create/payment/message. Use endpoint-supported idempotency keys, stable business identifiers or status lookup rather than blind retry. HTTP error statuses and bodies remain in `Response`; they are not raised as protocol-status exceptions.

The current Velox API Service executes inbound POST at a matched endpoint and `TvxAPIRequest.HTTPMethod` reports `hmPost`. It does so regardless of the action's stored `RESTMethod`, so an endpoint labelled GET or another verb can still run when called with POST. Routes are keyed only by endpoint text, not endpoint plus method, so configuring a second GET/POST action on the same path updates the existing route target rather than creating method-specific dispatch. Generated OpenAPI maps `hmPost` correctly, but that schema metadata is not runtime enforcement.

The example is source-reviewed only; no POST, API, duplicate-prevention, network, runtime or image test ran.

**Related Code Library entries**

- [`hmGet`](hmGet.md) - the other method executed by the current inbound handler.
- [`hmPut`](hmPut.md) and [`hmPatch`](hmPatch.md) - update-oriented body methods.
- [`TvxHTTP.Post`](../../Classes/HTTP/TvxHTTP/Methods/Post.md) - outbound call.

**External references**

- [RFC 9110 POST](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.3).

<small>Created 2026-07-15</small>
