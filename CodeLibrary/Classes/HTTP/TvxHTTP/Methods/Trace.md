---
title: Trace
description: Sends a synchronous TRACE request and captures the echoed response, with significant credential and request-disclosure risk.
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, trace, diagnostics, disclosure, security]
---

```Delphi
procedure Trace(const aURL: string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { Use only against a controlled diagnostic endpoint with no credentials. }
  Http.ClearAuthentication;
  Http.AuthType := fatNone;
  Http.Trace('http://diagnostics.example.invalid/trace');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

Sends a synchronous TRACE request and captures the echoed response, with significant credential and request-disclosure risk.

### Additional Technical Info
`Trace` selects `hmTrace`, stores `aURL`, and synchronously asks Indy to send TRACE with a response-content stream. It sends no pending request body; any pending [`Content`](../Properties/Content.md) is normally cleared afterward.

TRACE requests a loop-back representation of the received request. That can expose authorization fields, cookies, proxy additions and other sensitive request metadata in the response. Many production servers disable it. Use this method only for tightly controlled diagnostics, with authentication and sensitive custom headers removed, and never return/store the echoed content where another principal can read it.

Velox's own raw-wire intercept can also log both the request and echoed response when HTTP communication logging is enabled, multiplying disclosure. [`ClearAuthentication`](ClearAuthentication.md) alone retains credential fields and headers, so also set `AuthType := fatNone`, clear sensitive [`Header`](../Properties/Header.md) entries and consider a separate freshly constructed client.

HTTP error statuses normally remain inspectable and a successful echo is captured in [`Response.Content`](../../TvxHTTPResponse/Properties/Content.md). Operational failures can raise. The method blocks, accepts unrestricted destinations, follows the shared proxy/redirect/cookie lifecycle and uses a local SSL configuration that does not enable peer verification.

TRACE is safe/idempotent in protocol classification but is not an application health check and must not be enabled merely to test connectivity.

**External references**

- [RFC 9110 section 9.3.8: TRACE](https://www.rfc-editor.org/rfc/rfc9110#section-9.3.8)
- [RFC 9110 section 17.1: Establishing Authority](https://www.rfc-editor.org/rfc/rfc9110#section-17.1)
- [RFC 9525: Service Identity in TLS](https://www.rfc-editor.org/rfc/rfc9525)

<small>Created 2026-07-15</small>
