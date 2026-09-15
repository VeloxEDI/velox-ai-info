---
title: Content
description: Returns the actual host-owned request-body stream, sharing its mutable position and bytes with other request consumers.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, content, body, stream]
---

```Delphi
property Content: TStream read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if (Request <> nil) and (Request.Content <> nil) then
    Value := Request.Content.Size
  else
    Value := 0;
end;
```

### Usage

`Content` returns the actual Velox-provided request-body stream, sharing its mutable position and bytes with other request consumers.

### Additional Technical Info
`Content` returns `TvxAPIRequest.FContentStream` directly. This is a Velox property that shadows WebBroker's inherited `Content: string`; use [`ContentString`](ContentString.md) for the Velox string view.

The native request constructor either borrows Indy's supplied `PostStream` or creates an owned `TStringStream` from `FormParams`/`UnparsedParams`. In both cases the `TvxAPIRequest` owns or coordinates its lifetime. A script receives only a borrowed reference: do not free it, replace it or retain it after the current API execution.

The getter performs no read, copy, rewind, decoding, decompression, content-type validation or size check. The returned stream is mutable. Changing `Position` affects subsequent position-sensitive users, and methods supported by the concrete stream can change bytes/size. Those changes are immediately shared with [`ContentLength`](ContentLength.md), [`RawContent`](RawContent.md), [`ContentString`](ContentString.md) and any later native consumer.

If code must read through the stream, first enforce a trusted maximum size, save the original position, use checked reads, and restore the position in `finally`. Prefer `RawContent` for a documented whole-body byte snapshot when the endpoint has already bounded the body. Do not assume a single `Read` fills the requested buffer.

The stream can contain arbitrary binary or compressed data regardless of declared headers. It is host-owned and not thread-safe. Test [`Request`](../../../../Variables/Helpers/Request.md) and the returned stream for `nil` before use.

**External references**

- [Embarcadero DocWiki: `TWebRequest.Content`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.Content) describes the ancestor string property that Velox shadows.
- [Embarcadero DocWiki: `System.Classes.TStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream)
- [RFC 9110 section 6.4: Content](https://www.rfc-editor.org/rfc/rfc9110#section-6.4)

<small>Created 2026-07-15</small>
