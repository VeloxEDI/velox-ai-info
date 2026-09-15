---
title: ContentString
description: Copies the complete request stream and decodes it as UTF-8 in normal Indy request handling, without decompressing it.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, body, string, utf-8, memory]
---

```Delphi
property ContentString: string read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { The API/server must already have enforced a trusted body-size limit. }
  if (Request <> nil) and (Request.ContentLength <= 1048576) then
    Value := Request.ContentString
  else
    Value := '';
end;
```

### Usage

`ContentString` copies the complete request stream and decodes it as UTF-8 in normal Velox request handling, without decompressing it.

### Additional Technical Info
`ContentString` recreates WebBroker's string-content operation for Velox's stream-shadowing request class. It calls `ReadTotalContent`, retrieves [`RawContent`](RawContent.md), then calls `Web.HTTPApp.EncodingGetString(ContentType, Bytes)`.

For the active Indy bridge, [`ContentType`](ContentType.md) has already had its `charset` parameter removed into Indy's separate `CharSet` field. Velox does not pass that separate field to `EncodingGetString`. Consequently the decoder normally sees no `CHARSET` token and falls back to WebBroker's default encoding, UTF-8. A request such as `text/plain; charset=ISO-8859-1` is therefore exposed as `ContentType = 'text/plain'` and its body is still decoded as UTF-8. This is a material compatibility quirk; non-UTF-8 text can be corrupted/replaced.

The operation makes a byte array sized to the entire stream, reads from position zero, restores the original position, and then allocates the resulting Unicode string. The underlying Indy read does not verify that its single `Read` filled every allocated byte. With assertions enabled, `ReadTotalContent` can also obtain another full raw copy while checking byte length against [`ContentLength`](ContentLength.md).

No `Content-Encoding` decompression, JSON/XML validation, BOM-specific policy, signature verification or media-type enforcement occurs. Coded/binary bodies can produce meaningless text. Enforce a trusted maximum request size before this property, reject unsupported content codings/media types, and require UTF-8 at the endpoint unless a separate verified byte decoder is used.

Reading preserves the stream position but not an immutable snapshot: another consumer can mutate the shared stream between checks and reads. The property can raise on range checks, allocation failure, invalid object state or encoding/stream errors. Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `Web.HTTPApp.EncodingGetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.EncodingGetString)
- [Embarcadero DocWiki: `TWebRequest.Content`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.Content)
- [RFC 9110 section 8.3.2: Charset](https://www.rfc-editor.org/rfc/rfc9110#section-8.3.2)

<small>Created 2026-07-15</small>
