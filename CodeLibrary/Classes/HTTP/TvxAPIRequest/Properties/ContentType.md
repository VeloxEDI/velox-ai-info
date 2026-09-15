---
title: ContentType
description: Returns Indy's request media type after extracting the charset parameter into an unexposed separate field.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, content-type, media-type, charset]
---

```Delphi
property ContentType: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request <> nil then
    Value := Request.ContentType
  else
    Value := '';
end;
```

### Usage

`ContentType` returns Velox's request media type after extracting the charset parameter into an unexposed separate field.

### Additional Technical Info
`ContentType` returns Indy's `TIdRequestHeaderInfo.ContentType`, populated from the selected `Content-Type` request-header value. Indy's setter extracts/removes the `charset` parameter into a separate `CharSet` property before storing `ContentType`. Velox exposes `ContentType` but not that separate `CharSet`.

For example, a normal `Content-Type: application/json; charset=utf-8` is ordinarily represented here as `application/json`, while another non-charset parameter can remain. This also means [`ContentString`](ContentString.md) cannot see the extracted character set and normally uses UTF-8 fallback decoding even when the header declared something else.

The value is caller-supplied metadata, not validation of body bytes. Parse the media type and parameters according to HTTP syntax, compare type/subtype case-insensitively, define the endpoint's accepted types explicitly and reject unsupported input before parsing the body. Avoid broad substring tests that accept suffixes or parameter text unexpectedly.

`ContentType` does not decode [`ContentEncoding`](ContentEncoding.md), choose a JSON/XML parser, enforce schema, detect malware or cap body size. An empty value means none was selected; decide whether the endpoint rejects missing media type rather than guessing from the data.

Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil` and treat the live value as untrusted. The generic WebBroker page describes the abstraction; the Indy charset-extraction behavior above is the Velox runtime detail.

**External references**

- [Embarcadero DocWiki: `TWebRequest.ContentType`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.ContentType)
- [RFC 9110 section 8.3: Content-Type](https://www.rfc-editor.org/rfc/rfc9110#section-8.3)

<small>Created 2026-07-15</small>
