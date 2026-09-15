---
title: Referer
description: Returns Indy's selected optional Referer header as untrusted text without proving the request's origin.
sidebar_position: 28
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, referer, origin, privacy]
---

```Delphi
property Referer: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.Referer
  else
    Value := '';
end;
```

### Usage

Returns Velox's selected optional Referer header as untrusted text without proving the request's origin.

### Additional Technical Info
`Referer` returns the first `Referer` request-header value selected by Indy. The historical misspelling is the standard field name. Velox does not parse the URI, remove credentials/fragments, validate an origin or check that the referenced resource actually initiated the request.

Clients and intermediaries can omit, truncate or alter this privacy-sensitive field, and non-browser callers can send arbitrary text. It is therefore unsuitable as sole CSRF protection, authentication, tenant selection or access control. Use approved origin/token controls and authenticated identity for security decisions.

If analytics/troubleshooting needs the value, length-bound it, parse as a URI, redact user information/query secrets and avoid ordinary logs where possible. Do not reflect it into a redirect or HTML response without strict allow-listing and output encoding.

Empty means no selected value; duplicates are not combined by this getter. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.Referer`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.Referer)
- [RFC 9110 section 10.1.3: Referer](https://www.rfc-editor.org/rfc/rfc9110#section-10.1.3)

<small>Created 2026-07-15</small>
