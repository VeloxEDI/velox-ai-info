---
title: ContentEncoding
description: Gets or sets Content-Encoding metadata without compressing or otherwise transforming the response bytes.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, content-encoding, compression]
---

```Delphi
property ContentEncoding: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Response <> nil then
  begin
    { Leave blank unless Content already contains correctly coded bytes. }
    Response.ContentEncoding := '';
    Value := Response.ContentEncoding;
  end;
end;
```

### Usage

`ContentEncoding` gets or sets Content-Encoding metadata without compressing or otherwise transforming the response bytes.

### Additional Technical Info
`ContentEncoding` maps directly to Indy's response `ContentEncoding`. A nonempty value is emitted as the `Content-Encoding` field; an empty value omits the field.

The property is metadata only. Velox, WebBroker and this bridge do not gzip, deflate, encrypt or otherwise transform [`Content`](Content.md) or [`ContentString`](ContentString.md) when it is assigned. Set the property only when the selected response bytes have already been encoded exactly as declared. Marking plain bytes as `gzip`, for example, causes conforming clients to attempt decompression and fail.

The value can contain a list of content-coding tokens in the order defined by HTTP semantics. It is distinct from transfer coding/framing and from the character encoding represented by the `charset` parameter of [`ContentType`](ContentType.md). Do not use it to set `Transfer-Encoding`.

No token syntax, supported-coding, body consistency or security validation occurs. Clear stale state when replacing a coded body with an uncoded one. Compression can expose resource-exhaustion or information-leak risks when secrets and attacker-controlled text share a compressed response; use an explicitly reviewed response policy.

Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`. The object is mutable and host-owned, and assignment performs no network I/O by itself.

**External references**

- [Embarcadero DocWiki: `TWebResponse.ContentEncoding`](https://docwiki.embarcadero.com/Libraries/Athens/en/API%3AWeb.HTTPApp.TWebResponse.ContentEncoding)
- [RFC 9110 section 8.4: Content Coding](https://www.rfc-editor.org/rfc/rfc9110#section-8.4)
- [RFC 9110 section 6.1: Message Framing](https://www.rfc-editor.org/rfc/rfc9110#section-6.1)

<small>Created 2026-07-15</small>
