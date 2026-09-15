---
title: ContentLength
description: Returns the parsed declared response length, which can be absent or differ from the captured stream size.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, content-length, size]
---

```Delphi
property ContentLength: Int64 read;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Get('https://api.example.invalid/v1/export');
  Value := 'Declared=' + IntToStr(Http.Response.ContentLength) +
    ', captured=' + IntToStr(Http.Response.Content.Size);
end;
```

### Usage

`ContentLength` returns the parsed declared response length, which can be absent or differ from the captured stream size.

### Additional Technical Info
`ContentLength` returns Indy's parsed `Content-Length` response metadata. It is the sender's declared representation-data length, not a calculated size of [`Content`](Content.md). Indy uses `-1` when a valid length was not supplied; chunked and close-delimited responses commonly have no declared value.

Always inspect `Content.Size` when the question is how many bytes Velox actually captured. The two values can legitimately differ:

- HEAD, informational, 204 and 304 responses suppress a body while retaining applicable metadata;
- a chunked response has no `Content-Length` but can contain bytes;
- a host-configured Indy decompressor can produce a decoded body while the property retains the encoded wire length;
- a gracefully closed connection can yield a shorter captured body than the declared length; and
- an operational failure can leave partial content or earlier metadata.

Do not allocate memory, accept a payload or decide completeness solely from this untrusted value. Velox already buffers the response without enforcing an application-level maximum. Apply an endpoint-specific limit and validate the captured representation before parsing.

Initial typed metadata is not reprocessed when trailer fields are appended to the raw header list. The value can also be stale if pre-request setup exits before new response headers are received.

**External references**

- [RFC 9110 section 8.6: Content-Length](https://www.rfc-editor.org/rfc/rfc9110#section-8.6)
- [RFC 9112 section 6: Message body length](https://www.rfc-editor.org/rfc/rfc9112#section-6)
- [Embarcadero `TStream.Size`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Size)
- [Free Pascal `TStream.Size`](https://www.freepascal.org/docs-html/rtl/classes/tstream.size.html) - compatible stream context; Velox executes Delphi and Indy implementations.

<small>Created 2026-07-20</small>
