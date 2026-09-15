---
title: hmCustom
description: Dispatches a separate caller-supplied HTTP method string through Indy's generic request path.
sidebar_position: 146
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, http, custom-method, dispatch, security]
---

```Delphi
hmCustom = 9
```

### Example

```Delphi
procedure SendReviewedCustomMethod(Client: TvxHTTP; const URL: String);
begin
  Client.CustomRequest('PROPFIND', URL);
end;
```

### Usage

`hmCustom` dispatches a separate caller-supplied HTTP method string through Velox's generic request path.

### Additional Technical Info
`hmCustom` is ordinal 9 of [`TvxHTTPMethod`](../../Types/Enumerations/TvxHTTPMethod.md). Calling [`TvxHTTP.CustomRequest`](../../Classes/HTTP/TvxHTTP/Methods/CustomRequest.md) stores this enum value but sends the separate `aCustomMethod` string through Indy's generic `DoRequest`; the literal display label `CUSTOM` is not sent automatically.

The normal Velox proxy, intercept, SSL, authentication and header setup runs before dispatch. If the staged `TvxHTTP.Content` stream has a nonzero size, it is supplied as the request body; otherwise Indy receives no content stream. Response content is captured and rewound. In all cases, Velox clears staged request content and disconnects in `finally`, including when the request raises.

Clear `Client.Content` before replacing a payload more than once prior to sending. The `ContentAs*` setters rewind and overwrite but do not truncate an existing longer stream, while `LoadFromStream` copies at the current destination position without clearing. A shorter replacement can retain trailing bytes and repeated stream loads can append or overwrite unexpectedly. Indy rewinds the final stream for transmission, so its entire resulting size is sent.

Velox does not validate or normalize the supplied method string. Use a constant allowlist of protocol methods required by the integration, prefer uppercase conventional tokens, and never derive the value directly from untrusted data. Prefer the fixed `Get`, `Put`, `Post`, `Patch`, `Delete`, `Options`, `Head` or `Trace` methods when they apply because those select known Indy paths.

`hmCustom` is not implemented by the current inbound API handler. Stored REST action metadata with this value is rendered as GET in generated OpenAPI and does not create custom-method routing. The API request wrapper also has no explicit Custom result branch.

The example uses a fixed WebDAV method for illustration and was source-reviewed; it was not sent. No HTTP, WebDAV, API, network, runtime or image test ran.

**Related Code Library entries**

- [`hmAny`](hmAny.md) - non-dispatching sentinel.
- [`TvxHTTP.CustomRequest`](../../Classes/HTTP/TvxHTTP/Methods/CustomRequest.md) - the method that sets this value and custom text.

**External references**

- [RFC 9110 method extensibility](https://www.rfc-editor.org/rfc/rfc9110#section-9.1).

<small>Created 2026-07-15</small>
