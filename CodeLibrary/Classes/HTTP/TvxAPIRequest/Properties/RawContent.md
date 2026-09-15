---
title: RawContent
description: Allocates and returns a complete byte-array copy of the current request stream while restoring its original position.
sidebar_position: 26
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, raw-content, bytes, stream, memory]
---

```Delphi
property RawContent: TBytes read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  { The endpoint must already have enforced a trusted maximum body size. }
  if (Request <> nil) and (Request.ContentLength <= 1048576) then
    Value := Length(Request.RawContent)
  else
    Value := 0;
end;
```

### Usage

`RawContent` allocates and returns a complete byte-array copy of the current request stream while restoring its original position.

### Additional Technical Info
`RawContent` reads Velox's current [`Content`](Content.md) stream into a new dynamic byte array. The Indy bridge saves `Position`, seeks to zero, allocates `Size` bytes, performs one `Read(Buffer, 0, Length)` call and restores the saved position in `finally`.

The returned array is a detached byte copy; changing it does not alter the stream. The operation itself allocates memory proportional to the entire current stream size and blocks while copying. It does not enforce a limit, decompress [`ContentEncoding`](ContentEncoding.md), validate [`ContentType`](ContentType.md), verify a signature/hash or parse a format.

The implementation ignores the count returned by its single `Read`. A stream that short-reads without raising can leave the unread tail at its initial zero values while still returning an array of full `Size`. Ordinary memory/string streams usually fill the request, but callers must not generalise this as a checked `ReadExactly` contract.

Position restoration occurs even when the read raises, but concurrent/shared stream mutation can invalidate size/position assumptions. Very large Size/allocation, seek/read errors and an invalid directly constructed request can raise. Enforce body limits before this property and process arbitrary binary data with a parser that has its own size/depth limits.

Test [`Request`](../../../../Variables/Helpers/Request.md) for `nil`. Do not assume the bytes are UTF-8; [`ContentString`](ContentString.md) has separate decoding quirks.

**External references**

- [Embarcadero DocWiki: `TWebRequest.RawContent`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebRequest.RawContent)
- [Embarcadero DocWiki: `System.Classes.TStream.Read`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Read)
- [RFC 9110 section 6.4: Content](https://www.rfc-editor.org/rfc/rfc9110#section-6.4)

<small>Created 2026-07-15</small>
