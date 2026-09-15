---
title: hmTrace
description: Selects outbound HTTP TRACE diagnostic reflection, which can disclose configured request headers and is commonly disabled.
sidebar_position: 154
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, http, trace, diagnostics, security]
---

```Delphi
hmTrace = 8
```

### Example

```Delphi
function IsTrace(Method: TvxHTTPMethod): Boolean;
begin
  Result := Method = hmTrace;
end;
```

### Usage

`hmTrace` selects outbound HTTP TRACE diagnostic reflection, which can disclose configured request headers and is commonly disabled.

### Additional Technical Info
`hmTrace` is ordinal 8 of [`TvxHTTPMethod`](../../Types/Enumerations/TvxHTTPMethod.md). [`TvxHTTP.Trace`](../../Classes/HTTP/TvxHTTP/Methods/Trace.md) selects it and asks Indy to capture the server's diagnostic loop-back response.

Velox applies configured headers and authentication before selecting the TRACE branch. A compliant TRACE service can reflect received request fields, so authorization tokens, cookies, proxy credentials and other sensitive headers can be exposed in the response or intermediary logs. RFC 9110 says a client must not send credentials or sensitive data in TRACE-generated fields. Avoid this method in production integrations; many servers disable it.

Velox does not pass staged `Content` to TRACE and clears the stream after the attempt, consistent with TRACE having no request content. TRACE is safe and idempotent in standard semantics, but diagnostic disclosure makes it security-sensitive. The example therefore only compares the enum and does not call the method.

Generated OpenAPI maps this enum to TRACE. The current inbound Velox API runtime does not execute TRACE, and the request wrapper has no explicit Trace mapping. Stored REST metadata does not add that runtime branch.

No TRACE, header-reflection, API, network, runtime or image test ran.

**Related Code Library entries**

- [`hmOptions`](hmOptions.md) - capability query.
- [`TvxHTTP.Trace`](../../Classes/HTTP/TvxHTTP/Methods/Trace.md) - outbound call.

**External references**

- [RFC 9110 TRACE](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.8).

<small>Created 2026-07-15</small>
