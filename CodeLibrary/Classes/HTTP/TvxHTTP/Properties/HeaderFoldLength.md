---
title: HeaderFoldLength
description: Controls Indy's obsolete CRLF continuation folding for custom request headers, with zero disabling it by default.
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, header, folding, security]
---

```Delphi
property HeaderFoldLength: integer read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.HeaderFoldLength := 0;  // Required for normal HTTP/1.1 field lines.
  Http.Header['Accept'] := 'application/json';
  Http.Get('https://api.example.invalid/v1/status');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

`HeaderFoldLength` controls Velox's obsolete CRLF continuation folding for custom request headers, with zero disabling it by default.

### Additional Technical Info
`HeaderFoldLength` configures Indy's `Request.CustomHeaders` list. A new `TVxHTTP` explicitly sets it to `0`, which disables folding. A positive value enables folding and supplies the target wrap length; zero or a negative value disables it.

When enabled, current Indy wraps custom field text at whitespace or comma boundaries and inserts CRLF followed by a space for each continuation line. This is the historical `obs-fold` representation. HTTP/1.1 senders must not generate it, and recipients can reject it or normalise it differently. Such ambiguity is also unsafe across proxies and other intermediaries. Leave this property at zero.

The setting applies only when Velox transfers names not in the 22 recognised-field list to custom headers. Recognised fields such as `Accept`, `Content-Type`, `User-Agent`, `Host` and `Content-Length` are written through typed request properties and are not controlled by this value. Changing the property updates Indy's custom-header list immediately and remains in effect for later transfers.

There is no range validation. Very small positive lengths can split values into many continuation lines; large values effectively avoid wrapping until their threshold. This property does not make an overlong or untrusted header safe and does not validate CR/LF already present in a name or value. Validate [`Header`](Header.md) input independently.

Header folding is unrelated to HTTP response parsing, body encoding or UI line wrapping. It changes the bytes placed on the request wire and can therefore change protocol behavior.

**External references**

- [RFC 9112 section 5.2: Obsolete line folding](https://www.rfc-editor.org/rfc/rfc9112#section-5.2)
- [RFC 9110 section 5.5: Field values](https://www.rfc-editor.org/rfc/rfc9110#section-5.5)

<small>Created 2026-07-15</small>
