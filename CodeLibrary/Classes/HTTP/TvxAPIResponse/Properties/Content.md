---
title: Content
description: Gets or replaces the response content stream, with ownership controlled by FreeContentStream and nonempty text taking wire priority.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, content, stream, ownership]
---

```Delphi
property Content: TStream read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if (Response <> nil) and (Response.Content <> nil) then
    Value := Response.Content.Size
  else
    Value := 0;
end;
```

### Usage

Gets or replaces the response content stream, with ownership controlled by FreeContentStream and nonempty text taking wire priority.

### Additional Technical Info
`Content` is Velox's script name for native `TWebResponse.ContentStream`; it is not WebBroker's string `Content` property. Use [`ContentString`](ContentString.md) for response text.

In a normal Velox REST action, the host assigns a new `TMemoryStream` before execution. Reading `Content` returns that actual mutable host-coordinated stream. Reads and writes share its bytes, size and position with native response producers such as file/report output. It is not a snapshot and is not thread-safe.

Assigning a different stream invokes WebBroker ownership logic:

- if [`FreeContentStream`](FreeContentStream.md) is true, the previous stream is freed immediately;
- the new reference becomes both WebBroker's and Indy's content stream;
- `ContentLength` is set to the new stream's `Size` (or string length when assigning `nil`); and
- with `FreeContentStream` true, the response owns and later frees/releases the new stream.

Do not free a transferred stream afterward. If a stream must remain caller-owned, set `FreeContentStream := False` before assignment and keep it valid until sending finishes; the caller is then responsible for its eventual cleanup. Changing the flag does not resurrect a stream already freed by replacement.

This bridge has a material precedence difference from generic WebBroker documentation: Indy checks `ContentText` first. If [`ContentString`](ContentString.md) is nonempty, its encoded text is sent and the stream is ignored. Otherwise Indy resets the stream position to zero and writes it. For HEAD, 1xx, 204 and 304 responses, no body bytes are written. Automatic sending then releases the response's content stream according to the Indy ownership flag.

Stream assignment can raise while freeing the old object, reading `Size`, converting a custom stream or allocating native state. A custom stream must support the `Size` and `Position` operations used during length calculation/sending. Do not assign the same stream to multiple owning responses. Test [`Response`](../../../../Variables/Helpers/Response.md) for `nil`.

**External references**

- [Embarcadero DocWiki: `TWebResponse.ContentStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/Web.HTTPApp.TWebResponse.ContentStream)
- [Embarcadero DocWiki: `System.Classes.TStream`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream)
- [RFC 9110 section 6.4: Content](https://www.rfc-editor.org/rfc/rfc9110#section-6.4)

<small>Created 2026-07-15</small>
