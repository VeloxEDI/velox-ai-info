---
title: ContentType
description: Returns Indy's parsed media type after removing the charset parameter from the exposed value.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, content-type, media-type, charset]
---

```Delphi
property ContentType: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Get('https://api.example.invalid/v1/document');
  if LowerCase(Http.Response.ContentType) = 'application/json' then
    Value := Http.Response.ContentAsUTF8
  else
    Value := Http.Response.ContentType;
end;
```

### Usage

`ContentType` returns Velox's parsed media type after removing the charset parameter from the exposed value.

### Additional Technical Info
`ContentType` returns Indy's parsed media type from the first `Content-Type` response field. During parsing Indy removes the `charset` parameter from this exposed value and stores it in a separate response property that `TvxHTTPResponse` does not register. Other parameters can remain. Use [`Header`](Header.md)`['Content-Type']` when the original field and charset are required.

The property is metadata only. None of the `ContentAs...` getters consult it, and Velox does not automatically select a decoder from the declared charset. Choose an explicit encoding from a trusted API contract or parse and validate the raw charset yourself. A remote field can be incorrect or deliberately misleading.

An absent type returns `''`. Named lookup selects the first matching field and initial typed metadata is not reprocessed from trailers. Before a request Velox clears only [`Content`](Content.md), so this property can remain from the prior response if setup fails before new headers arrive.

Match media types case-insensitively and account for parameters rather than assuming the property always contains a bare token. Validate the actual bytes before passing untrusted content to JSON, XML, archive or other parsers.

**External references**

- [RFC 9110 section 8.3: Content-Type](https://www.rfc-editor.org/rfc/rfc9110#section-8.3)
- [IANA Media Types Registry](https://www.iana.org/assignments/media-types/media-types.xhtml)

<small>Created 2026-07-20</small>
