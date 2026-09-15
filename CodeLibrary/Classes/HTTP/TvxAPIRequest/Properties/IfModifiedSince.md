---
title: IfModifiedSince
description: Parses the first If-Modified-Since value, returning -1 when absent and leaving conditional-response decisions to the flow.
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, if-modified-since, conditional, cache]
---

```Delphi
property IfModifiedSince: TDateTime read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if (Request <> nil) and (Request.IfModifiedSince >= 0) then
    Value := Request.IfModifiedSince
  else
    Value := 0;
end;
```

### Usage

`IfModifiedSince` parses the first If-Modified-Since value, returning -1 when absent and leaving conditional-response decisions to the flow.

### Additional Technical Info
`IfModifiedSince` selects the first raw `If-Modified-Since` value and uses WebBroker's date parser. Empty returns `-1`; invalid nonempty syntax can raise. Standard weekday-leading HTTP-date text becomes a timezone-free `TDateTime` representing UTC, while limited numeric-leading legacy formats take the older non-timezone-converting path.

Reading the property does not evaluate a resource timestamp, set status `304`, suppress content or configure caching. HTTP defines this as a conditional request validator normally evaluated only when the selected representation has a known modification date, and more specific validators can take precedence.

Do not use a caller-supplied date for access control or as proof of data version. If implementing conditional retrieval, distinguish the sentinel, compare at HTTP-date precision with the server-controlled representation timestamp, apply method/precondition precedence, and set the response deliberately. Invalid fields should become a controlled result rather than an unhandled script exception.

Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`. This property has no automatic relationship to Velox Configuration/Map modification dates.

**External references**

- [Embarcadero DocWiki: `TWebRequest.IfModifiedSince`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.IfModifiedSince)
- [RFC 9110 section 13.1.3: If-Modified-Since](https://www.rfc-editor.org/rfc/rfc9110#section-13.1.3)
- [RFC 9110 section 13.2.2: Precedence of preconditions](https://www.rfc-editor.org/rfc/rfc9110#section-13.2.2)

<small>Created 2026-07-15</small>
