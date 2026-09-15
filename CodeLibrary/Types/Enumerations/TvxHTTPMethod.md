---
title: TvxHTTPMethod
description: Represents Velox HTTP request methods plus Any and Custom routing or dispatch sentinels.
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, http, method, request, routing]
---

```Delphi
TvxHTTPMethod = (hmAny, hmGet, hmPut, hmPost, hmPatch, hmDelete, hmOptions, hmHead, hmTrace, hmCustom)
```

### Example

```Delphi
procedure SendStatus(Client: TvxHTTP; const URL: String);
begin
  // Post sets the internal method to hmPost before sending.
  Client.Post(URL);
end;
```

### Usage

`TvxHTTPMethod` represents Velox HTTP request methods plus Any and Custom routing or dispatch sentinels.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| [`hmAny`](../../Constants/Enumeration/hmAny.md) | 0 | Sentinel with no outbound branch/current any-method matching; OpenAPI maps it to GET. |
| [`hmGet`](../../Constants/Enumeration/hmGet.md) | 1 | GET retrieval; outbound and inbound runtime. |
| [`hmPut`](../../Constants/Enumeration/hmPut.md) | 2 | PUT with staged content; outbound only. |
| [`hmPost`](../../Constants/Enumeration/hmPost.md) | 3 | POST with staged content; outbound and inbound runtime. |
| [`hmPatch`](../../Constants/Enumeration/hmPatch.md) | 4 | PATCH with staged content; outbound only. |
| [`hmDelete`](../../Constants/Enumeration/hmDelete.md) | 5 | DELETE without staged content; outbound only. |
| [`hmOptions`](../../Constants/Enumeration/hmOptions.md) | 6 | OPTIONS without staged content; outbound only. |
| [`hmHead`](../../Constants/Enumeration/hmHead.md) | 7 | HEAD without response content; outbound only. |
| [`hmTrace`](../../Constants/Enumeration/hmTrace.md) | 8 | TRACE reflection without staged content; outbound only and security-sensitive. |
| [`hmCustom`](../../Constants/Enumeration/hmCustom.md) | 9 | Separate caller-supplied method via Velox's generic outbound path; OpenAPI maps it to GET. |

#### Behavior and boundaries

- Outbound support covers all fixed verbs and Custom. Only PUT, POST, PATCH and Custom receive staged `Content`; every attempt clears it and disconnects. Before dispatch, `ContentAs*` does not truncate a longer existing stream and `LoadFromStream` does not clear the destination, so clear `Content` before replacing or reloading it. HTTP error statuses remain in `Response` instead of raising protocol-status exceptions.
- Current inbound runtime support is GET and POST only. `TvxRESTManager.WebActionHandler` dispatches those by the actual request and never compares stored `RESTMethod`; an endpoint can therefore execute for GET/POST even when its metadata names another member. Routes are keyed only by endpoint, so the service cannot keep distinct GET and POST actions for the same path; a later synchronization updates the existing route target.
- OpenAPI maps the eight fixed verbs normally but maps Any and Custom to GET. Admin display uses the enum labels. Schema/display values are not runtime enforcement.
- `TvxAPIRequest.GetHTTPMethod` maps Any, GET, PUT, POST, HEAD, DELETE and PATCH but has no OPTIONS, TRACE, Custom or default branch. In practice the current manager only hands GET/POST to action scripts.
- Method names do not make application operations safe. GET/HEAD/OPTIONS/TRACE are standard safe methods; PUT/DELETE are idempotent; POST/PATCH are not inherently idempotent. Retry only when both protocol and business semantics permit it.
- HEAD does not fill the normal response-content stream. TRACE can reflect configured authentication/sensitive headers. Custom text must be allowlisted.

### Additional Technical Info
`TvxHTTPMethod` is shared by three distinct surfaces: outbound `TvxHTTP` dispatch, stored REST action/OpenAPI metadata and inbound request classification. Those surfaces do not currently support the same members. Fixed client methods assign the matching enum before `SendRequest`; `CustomRequest` uses `hmCustom` plus a separate caller-supplied method string.

`hmAny` is a label/sentinel, but current source does not implement it as action-method matching. `TvxHTTP.SendRequest` has no `hmAny` branch, and the API runtime does not compare stored `RESTMethod` at all.

**Related Code Library entries**

- [TvxHTTP.Get](../../Classes/HTTP/TvxHTTP/Methods/Get.md) - GET dispatch.
- [TvxHTTP.Post](../../Classes/HTTP/TvxHTTP/Methods/Post.md) - POST dispatch.
- [TvxHTTP.CustomRequest](../../Classes/HTTP/TvxHTTP/Methods/CustomRequest.md) - custom method path.
- [TvxAPIRequest](../../Classes/HTTP/TvxAPIRequest.md) - inbound request method mapping.

**External references**

- [RFC 9110 methods](https://www.rfc-editor.org/rfc/rfc9110.html#name-methods) - HTTP method semantics, safety and idempotency.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration concepts.

<small>Created 2026-07-15</small>
