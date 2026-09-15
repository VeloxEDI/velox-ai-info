---
title: Get
description: Sends a synchronous bodyless GET request through the configured Velox HTTP client and captures response content and metadata for inspection.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, get, request, response]
---

```Delphi
procedure Get(const aURL: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Header['Accept'] := 'application/json';
  Http.Get('https://api.example.invalid/v1/status');

  if Http.Response.Success then
    Value := Http.Response.ContentAsUTF8
  else
    Value := Http.Response.ResponseCode;
end;
```

### Usage

Sends a synchronous bodyless GET request through the configured Velox HTTP client and captures response content and metadata for inspection.

### Additional Technical Info
`Get` selects `hmGet`, stores `aURL`, and performs a synchronous Indy GET. It sends no request body. Any pending [`Content`](../Properties/Content.md) is ignored for the request and then normally cleared during finalisation.

The method returns no value. A completed call places response bytes in [`Response.Content`](../../TvxHTTPResponse/Properties/Content.md), rewinds that stream, and exposes status, headers and decoded views through [`Response`](../Properties/Response.md). HTTP error statuses normally remain inspectable rather than raising because Velox enables protocol-error content. Operational failures still raise.

Redirects are followed by default, cookies and stored headers persist between calls, and authentication/proxy/SSL configuration is applied before sending. If authentication preflight fails before the actual request, the method can return without a response and without clearing pending request content. If a network failure occurs before a new response, do not trust residual status/header metadata from an earlier call.

GET is defined as safe and idempotent at the protocol level, but the remote service can violate those expectations. Velox performs no caching, retry policy or response media-type validation. Reading a text view can allocate another whole-body copy; inspect length/type and impose endpoint limits for large or untrusted responses.

URLs run with the Velox process's network reach. Allowlist externally influenced destinations. The reviewed local SSL configuration does not enable peer verification, so HTTPS does not currently establish reliable server identity in this helper.

**External references**

- [RFC 9110 section 9.3.1: GET](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.1)
- [RFC 9110 section 9.2.1: Safe Methods](https://www.rfc-editor.org/rfc/rfc9110#section-9.2.1)
- [RFC 9110 section 9.2.2: Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2)
- [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525)

<small>Created 2026-07-15</small>
