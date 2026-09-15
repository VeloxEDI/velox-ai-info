---
title: hmAny
description: Labels an unspecified HTTP method, but does not currently implement outbound dispatch or inbound any-method matching in Velox.
sidebar_position: 145
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, http, any, routing, openapi]
---

```Delphi
hmAny = 0
```

### Example

```Delphi
function HasSpecificMethod(Method: TvxHTTPMethod): Boolean;
begin
  Result := Method <> hmAny;
end;
```

### Usage

`hmAny` labels an unspecified HTTP method, but does not currently implement outbound dispatch or inbound any-method matching in Velox.

### Additional Technical Info
`hmAny` is ordinal 0 of [`TvxHTTPMethod`](../../Types/Enumerations/TvxHTTPMethod.md), with display text `ANY`. It is a Velox sentinel, not an HTTP wire method.

#### Outbound client behavior

`TvxHTTP.SendRequest` has no `hmAny` case, and no public `TvxHTTP` request method selects it. Use a fixed method such as [`hmGet`](hmGet.md) or call [`TvxHTTP.CustomRequest`](../../Classes/HTTP/TvxHTTP/Methods/CustomRequest.md) with a reviewed method token. An attempt to reach `SendRequest` with `FMethod = hmAny` would perform setup and cleanup but no HTTP dispatch.

#### Inbound API and OpenAPI behavior

The name does not currently mean “match any method” in the Velox API Service. Stored action `RESTMethod` is not compared by `TvxRESTManager` at runtime; its handler executes GET and POST only, based on the incoming request. A configured `hmAny` endpoint therefore does not add PUT, PATCH, DELETE, OPTIONS, HEAD, TRACE or custom handling.

The request wrapper can return `hmAny` if WebBroker supplies `mtAny`, but that is classification of the host request value, not action matching. OpenAPI generation maps `hmAny` to a GET operation, while the admin endpoint list displays `ANY`. Treat that mismatch as documentation/configuration metadata, not proof of runtime method coverage.

The example only checks the sentinel and was source-reviewed; no HTTP, API, network, runtime or image test ran.

**Related Code Library entries**

- [`hmGet`](hmGet.md) and [`hmPost`](hmPost.md) - the two methods executed by the current inbound API handler.
- [`hmCustom`](hmCustom.md) - outbound caller-supplied method dispatch.
- [`TvxAPIRequest.HTTPMethod`](../../Classes/HTTP/TvxAPIRequest/Properties/HTTPMethod.md) - inbound request classification.

**External references**

- [RFC 9110 HTTP method overview](https://www.rfc-editor.org/rfc/rfc9110#section-9.1).

<small>Created 2026-07-15</small>
