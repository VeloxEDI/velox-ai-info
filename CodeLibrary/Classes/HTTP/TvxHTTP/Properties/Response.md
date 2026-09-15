---
title: Response
description: Returns the stable client-owned response facade whose body is cleared per attempt while underlying Indy metadata can remain stale.
sidebar_position: 23
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, status, headers, ownership]
---

```Delphi
property Response: TVxHTTPResponse read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Get('https://api.example.invalid/v1/status');
  if Http.Response.Success then
    Value := Http.Response.ContentAsUTF8
  else
    Value := IntToStr(Http.Response.ResponseCode) + ' ' +
      Http.Response.ResponseText;
end;
```

### Usage

Returns the stable client-owned response facade whose body is cleared per attempt while Velox metadata can remain stale.

### Additional Technical Info
`Response` returns the [`TVxHTTPResponse`](../../TvxHTTPResponse.md) facade created with the HTTP client. The property is read-only because scripts cannot replace that reference; it is not an immutable snapshot. The same object is returned for the client's lifetime, and its body-oriented members can mutate the locally captured response content.

The `TVxHTTP` client owns and frees this object. Do not call `Free` on it and do not retain it after the owning HTTP helper/client has gone out of scope. Under normal construction the property is not `nil`.

`SendRequest` first initialises proxy, intercept and local SSL objects, then clears only the facade's memory-stream content. A failure in one of those initialisers can therefore preserve the preceding body and metadata. After the clear, Velox still does not clear the associated Indy response code, reason text or raw headers. Once Indy reaches its HTTP response terminal it refreshes those fields and writes the final response body into the facade, replacing intermediate authentication or redirect bodies. Velox then rewinds successful captured content to position zero.

If SSL configuration or authentication fails after the clear but before Indy receives a new response, current `Response.Content` is empty while `ResponseCode`, `ResponseText`, headers and derived properties can still describe the preceding request. A still-earlier proxy/intercept/SSL-object initialisation failure can preserve all preceding response state. An operational exception during a request can likewise leave a mixture of current and retained state depending on how far Indy progressed. Treat response metadata as current only when the request reached the expected endpoint and workflow logs confirm the attempt.

Velox suppresses Indy's normal exception for HTTP error status codes and asks it to retain protocol-error content, so 4xx and 5xx responses normally populate this same facade. Use `Success` and `ResponseCode` rather than assuming that method return means a 2xx result. Network, TLS, parsing and other operational exceptions can still propagate.

The response body is fully buffered in memory. Decode it using the explicit `ContentAs...` property that matches the response's declared media type and charset; do not assume `ContentAsString` consults HTTP headers. Response content and headers are untrusted remote input and can be large or sensitive.

**External references**

- [RFC 9110 section 15: Status codes](https://www.rfc-editor.org/rfc/rfc9110#section-15)
- [RFC 9110 section 6: Message abstraction](https://www.rfc-editor.org/rfc/rfc9110#section-6)

<small>Created 2026-07-15</small>
