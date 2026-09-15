---
title: hmGet
description: Selects HTTP GET for outbound retrieval and identifies requests handled by the current inbound Velox API runtime.
sidebar_position: 148
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, http, get, safe, cache]
---

```Delphi
hmGet = 1
```

### Example

```Delphi
procedure RetrieveResource(Client: TvxHTTP; const URL: String);
begin
  Client.Get(URL);
end;
```

### Usage

`hmGet` selects HTTP GET for outbound retrieval and identifies requests handled by the current inbound Velox API runtime.

### Additional Technical Info
`hmGet` is ordinal 1 of [`TvxHTTPMethod`](../../Types/Enumerations/TvxHTTPMethod.md). [`TvxHTTP.Get`](../../Classes/HTTP/TvxHTTP/Methods/Get.md) selects it, performs the normal Velox proxy/SSL/authentication/header setup and asks Indy to write response content into `TvxHTTP.Response.Content`.

Staged request `Content` is not passed to GET and is cleared after the attempt. Encode selection parameters in the URL/query and headers as defined by the endpoint. After dispatch, Velox rewinds captured response content. Protocol error statuses are available through `Response` instead of being raised as Indy protocol exceptions; always inspect status and expected representation before using it.

GET is safe, idempotent and cacheable under HTTP semantics, but application code must still avoid unsafe server endpoints disguised as GET. Authentication headers, query secrets and personal data can appear in logs/caches, so use HTTPS and avoid sensitive query material.

The current Velox API Service executes inbound GET at a matched endpoint and `TvxAPIRequest.HTTPMethod` reports `hmGet`. It does this regardless of the action's stored `RESTMethod`; configuration metadata does not currently prevent GET from invoking an endpoint labelled for another method. Routes are keyed only by endpoint text, so separate GET and POST actions cannot coexist on the same path; synchronizing another action for that path updates the existing route target. OpenAPI correctly maps `hmGet` to GET.

The example is source-reviewed only; no GET, API, cache, network, runtime or image test ran.

**Related Code Library entries**

- [`hmHead`](hmHead.md) - GET metadata without response content.
- [`hmPost`](hmPost.md) - the other inbound method currently executed by Velox.
- [`TvxHTTP.Get`](../../Classes/HTTP/TvxHTTP/Methods/Get.md) - outbound call.

**External references**

- [RFC 9110 GET](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.1).
- [RFC 9110 safe methods](https://www.rfc-editor.org/rfc/rfc9110#section-9.2.1).

<small>Created 2026-07-15</small>
