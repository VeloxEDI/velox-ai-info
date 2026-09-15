---
title: QueryFields
description: Returns a cached mutable list built by ampersand-splitting and then URL-decoding each complete query field as UTF-8.
sidebar_position: 25
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, query, parameters, decoding, string-list]
---

```Delphi
property QueryFields: TStrings read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if (Request <> nil) and (Request.QueryFields <> nil) then
    Value := Request.QueryFields.Values['id']
  else
    Value := '';
end;
```

### Usage

`QueryFields` returns a cached mutable list built by ampersand-splitting and then URL-decoding each complete query field as UTF-8.

### Additional Technical Info
On first access, WebBroker creates a `TStringList` and parses [`Query`](Query.md). It separates fields at unquoted ampersands, URL-decodes each **entire** extracted field, converts `+` to space and interprets decoded bytes as UTF-8 under the active default settings. Each line is then typically `Name=Value` and can be read through `TStrings.Values`.

Decoding after field splitting has observable effects. `%26` remains within one list item and becomes `&`; `%3D` becomes `=` before `TStrings` later identifies the name/value separator, so an encoded equals sign in a name can change how `Values[...]` sees that line. Duplicate names and input order are preserved as separate lines, while `Values['name']` can hide later duplicates. Enumerate entries when duplicates are forbidden or significant.

The parser raises `EConvertError` for malformed percent encoding. Because the list is assigned before extraction starts, an exception can leave a partially populated cached list; a later `QueryFields` read returns that partial list without reparsing. Handle malformed input as a terminal client error rather than continuing with the cache.

The returned list is host-owned and mutable. Do not free it. Adding/changing/deleting lines affects later consumers of this request but does not rewrite the encoded `Query` or the HTTP request. It is not thread-safe.

Define an allow-list of parameter names, maximum counts/lengths, duplicate policy and type validation. Do not put credentials/secrets in query parameters. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebRequest.QueryFields`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.QueryFields)
- [Embarcadero DocWiki: `Web.HTTPApp.ExtractHTTPFields`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.ExtractHTTPFields)
- [RFC 3986 section 2.1: Percent-Encoding](https://www.rfc-editor.org/rfc/rfc3986#section-2.1)

<small>Created 2026-07-15</small>
