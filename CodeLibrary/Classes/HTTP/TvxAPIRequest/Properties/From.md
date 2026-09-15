---
title: From
description: Returns Indy's selected optional From request-header text without validating an address or identifying the caller.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, from, contact, identity]
---

```Delphi
property From: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.From
  else
    Value := '';
end;
```

### Usage

Returns Velox's selected optional From request-header text without validating an address or identifying the caller.

### Additional Technical Info
`From` returns the first `From` header value selected by Indy's request-header processing. It is an unparsed optional string. Velox does not validate an email address, resolve it to a Velox user/trading partner or authenticate control of that address.

HTTP defines this field as contact information for the human user controlling a requesting user agent, subject to privacy constraints. Automated clients commonly omit it. A caller can supply any text, so the property is unsuitable for access control, routing to a customer, audit identity or notification without a separate trusted mapping.

Apply a length limit and explicit address parser only if a governed integration contract uses the field. Avoid logging/persisting it unnecessarily because it can contain personal information. Empty means no selected value; duplicate physical fields are not combined by this getter.

Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil` and use authenticated claims/configuration for identity decisions.

**External references**

- [Embarcadero DocWiki: `TWebRequest.From`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.From)
- [RFC 9110 section 10.1.2: From](https://www.rfc-editor.org/rfc/rfc9110#section-10.1.2)

<small>Created 2026-07-15</small>
