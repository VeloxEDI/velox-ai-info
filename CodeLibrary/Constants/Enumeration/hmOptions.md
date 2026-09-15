---
title: hmOptions
description: Selects an outbound HTTP OPTIONS capability request while inbound OPTIONS is not executed by the current Velox API runtime.
sidebar_position: 150
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, http, options, allow, cors]
---

```Delphi
hmOptions = 6
```

### Example

```Delphi
procedure QueryOptions(Client: TvxHTTP; const URL: String);
begin
  Client.Options(URL);
end;
```

### Usage

Use `hmOptions` for an outbound HTTP `OPTIONS` request when a script needs to inspect the methods or CORS capabilities advertised by a server. Configure any required `Origin` and access-control request headers before the call, then inspect response headers such as `Allow`; a successful response does not itself grant application authorisation.

Velox does not send staged request content with `OPTIONS` and clears the staged content after the attempt. This value does not enable inbound `OPTIONS` handling for a Velox API flow; configure CORS or preflight handling in the front-end or proxy when required.

### Additional Technical Info
`hmOptions` is ordinal 6 of [`TvxHTTPMethod`](../../Types/Enumerations/TvxHTTPMethod.md). [`TvxHTTP.Options`](../../Classes/HTTP/TvxHTTP/Methods/Options.md) selects it and captures response content through Indy's OPTIONS method.

OPTIONS requests communication choices for the target resource or server. Inspect response headers such as `Allow` and any API-specific CORS fields; a 2xx response does not itself grant application authorization. Velox applies caller headers before dispatch, so required `Origin` and access-control request fields must be configured explicitly for a preflight scenario.

Velox does not pass staged request `Content` to OPTIONS and clears it after the attempt. OPTIONS is safe and idempotent, but it can still reveal server capabilities and consume rate limits. Protocol-status failures remain available in `Response` rather than raising an Indy protocol exception.

Generated OpenAPI maps this enum to OPTIONS. The current Velox API runtime has no inbound OPTIONS branch and does not synthesize a CORS/preflight response from stored REST action metadata. Configure any required front-end/proxy CORS behavior independently.

The example is source-reviewed only; no OPTIONS, CORS, API, network, runtime or image test ran.

**Related Code Library entries**

- [`hmTrace`](hmTrace.md) - the other diagnostic safe method in this enum.
- [`TvxHTTP.Options`](../../Classes/HTTP/TvxHTTP/Methods/Options.md) - outbound call.

**External references**

- [RFC 9110 OPTIONS](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.7).

<small>Created 2026-07-15</small>
