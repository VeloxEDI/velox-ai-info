---
title: Title
description: Returns the first unparsed legacy Title request-header value, which has no current HTTP field semantics.
sidebar_position: 34
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, title, legacy, header]
---

```Delphi
property Title: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.Title
  else
    Value := '';
end;
```

### Usage

Returns the first unparsed legacy Title request-header value, which has no current HTTP field semantics.

### Additional Technical Info
`Title` performs a case-insensitive Indy raw-header lookup for `Title` and returns the first selected value unchanged. Velox does not decode quoted/encoded words, interpret it as HTML, apply it to the API response or attach it to stored content.

`Title` was an HTTP/1.0 entity-header extension for a textual entity title and is not part of current HTTP semantics. Most clients will not send it. A nonempty value is merely untrusted application input unless a governed legacy integration contract defines it.

Do not render the value into HTML, logs, filenames or notifications without length limits and context-appropriate encoding/validation. It is not the Velox Configuration/Action title and has no routing effect. Prefer an explicit body field with schema and character/length rules for new APIs.

Empty means no selected value; duplicate fields are not combined by this getter. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.Title`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.Title)
- [RFC 1945: HTTP/1.0, legacy Title field](https://www.rfc-editor.org/rfc/rfc1945)
- [RFC 9110: current HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)

<small>Created 2026-07-15</small>
