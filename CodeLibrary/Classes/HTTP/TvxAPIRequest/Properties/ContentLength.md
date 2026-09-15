---
title: ContentLength
description: Returns the current request-body stream size narrowed from native Int64 to a range-checked scripting Integer.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, content-length, body-size, range-check]
---

```Delphi
property ContentLength: Integer read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Request = nil then
    Value := -1
  else if Request.ContentLength > 1048576 then
    Value := -2                 { reject before materialising the body }
  else
    Value := Request.ContentLength;
end;
```

### Usage

`ContentLength` returns the current request-body stream size narrowed from Velox Int64 to a range-checked scripting Integer.

### Additional Technical Info
Despite the inherited WebBroker name, this implementation does not return the original `Content-Length` header. The Indy bridge formats `FContentStream.Size`, parses that text to native Int64 and the Velox property helper assigns it to PascalScript `Integer`.

The result is therefore the current body stream size after Indy has read/prepared the request. It can describe a chunked request or a bridge-created form/unparsed-parameter stream even when no original `Content-Length` field existed. If script/native code changes the stream size through [`Content`](Content.md), a later `ContentLength` read changes too.

The Velox project enables range checking. A native stream size greater than `2,147,483,647` cannot fit the exposed 32-bit `Integer`; the helper assignment raises `ERangeError` rather than returning a truncated or wrapped value. Practical endpoint/server limits should be substantially lower and enforced before the script materialises [`RawContent`](RawContent.md) or [`ContentString`](ContentString.md).

This value is useful as a current-size guard, not as proof that the transport was well-formed, the body matches its media type, memory allocation will succeed or no decompression expansion will occur. Recheck size at the authority boundary and handle changes caused by shared stream mutation.

Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`. Reading this property does not allocate a body copy, but subsequent whole-body helpers do.

**External references**

- [Embarcadero DocWiki: `TWebRequest.ContentLength`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.ContentLength)
- [Embarcadero DocWiki: `System.Classes.TStream.Size`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Size)
- [RFC 9110 section 8.6: Content-Length](https://www.rfc-editor.org/rfc/rfc9110#section-8.6)

<small>Created 2026-07-15</small>
