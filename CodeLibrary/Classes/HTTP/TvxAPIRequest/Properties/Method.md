---
title: Method
description: Returns Indy's uppercased effective request command after its POST-only method-override processing.
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, method, override, routing]
---

```Delphi
property Method: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.Method
  else
    Value := '';
end;
```

### Usage

Returns Velox's uppercased effective request command after its POST-only method-override processing.

### Additional Technical Info
`Method` returns `TIdHTTPRequestInfo.Command`. Indy extracts the request-line command, uppercases it, and stores it as the effective command. For an original POST only, Indy checks `X-HTTP-Method-Override`, then `X-HTTP-Method`, then `X-METHOD-OVERRIDE`; the first nonempty override is uppercased and replaces the stored command.

The property therefore may not equal the original wire method. The raw request line is retained internally by Indy but is not exposed by `TvxAPIRequest`. [`HTTPMethod`](HTTPMethod.md) maps this effective value to a Velox enum and loses identity for OPTIONS, TRACE and custom methods.

Method override can bypass assumptions made by proxies, firewalls or application code that inspect only the request line. Enable/accept it only where the endpoint design deliberately supports it, apply the same authentication/authorisation/CSRF/audit rules as the effective operation, and reject unsupported methods before business side effects.

HTTP method tokens are case-sensitive by specification even though Indy normalises this implementation to uppercase. Use exact equality against an allow-list; do not accept prefixes or arbitrary extension text. Reading the property does not dispatch an operation. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.Method`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.Method)
- [RFC 9110 section 9.1: Methods](https://www.rfc-editor.org/rfc/rfc9110#section-9.1)

<small>Created 2026-07-15</small>
