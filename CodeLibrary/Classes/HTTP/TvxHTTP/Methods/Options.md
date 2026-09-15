---
title: Options
description: Sends a synchronous bodyless OPTIONS request to the supplied target and captures the server's status, fields and optional response content.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, options, capabilities, headers]
---

```Delphi
procedure Options(const aURL: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Options('https://api.example.invalid/resources');
  Value := Http.Response.Header['Allow'];
end;
```

### Usage

Sends a synchronous bodyless OPTIONS request to the supplied target and captures the server's status, fields and optional response content.

### Additional Technical Info
`Options` selects `hmOptions`, stores `aURL`, and synchronously calls Indy's OPTIONS request with a response-content stream. It sends no request body. Pending [`Content`](../Properties/Content.md) is ignored and then normally cleared during request finalisation.

Inspect [`Response`](../Properties/Response.md) for status, raw fields such as `Allow`, and any representation returned by the server. Velox does not parse an option set, perform CORS preflight logic or change later method availability. A server's response is descriptive and can be incomplete or policy-dependent.

The method requires a URL string and does not provide a separate server-wide asterisk-target API. Do not assume that passing a literal `*` produces a valid origin-form/asterisk-form request through Indy's URL parser.

HTTP error statuses normally remain inspectable; operational failures can raise. Proxy, redirect, cookies, authentication, stored headers and raw-wire logging use the common client pipeline. The call blocks, destinations are unrestricted, and the local SSL path does not enable peer-certificate verification.

**External references**

- [RFC 9110 section 9.3.7: OPTIONS](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.7)
- [RFC 9110 section 10.2.1: Allow](https://www.rfc-editor.org/rfc/rfc9110#section-10.2.1)
- [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525)

<small>Created 2026-07-15</small>
