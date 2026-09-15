---
title: ContentAsUTF8
description: Decodes or rewrites the buffered response body explicitly as UTF-8 without automatic BOM removal.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, utf-8, encoding]
---

```Delphi
property ContentAsUTF8: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Get('https://api.example.invalid/v1/document');
  if Http.Response.Success then
    Value := Http.Response.ContentAsUTF8;
end;
```

### Usage

`ContentAsUTF8` decodes or rewrites the buffered response body explicitly as UTF-8 without automatic BOM removal.

### Additional Technical Info
`ContentAsUTF8` decodes all [`Content`](Content.md) bytes with Delphi `TEncoding.UTF8`. It is the deterministic choice for an endpoint contract that declares UTF-8. The property does not examine `Content-Type`, and because the encoding is explicit, a leading UTF-8 BOM is decoded as U+FEFF instead of being removed.

The getter rewinds the stream, reads its complete size and leaves the position at the end. The installed Delphi UTF-8 decoder enables invalid-character checking; malformed or incomplete UTF-8 makes the conversion fail with `EEncodingError` rather than returning a partial string. Validate or handle the exception before relying on remote data as structured text.

The setter writes BOM-free UTF-8 from offset zero and returns the stream to zero. It does not truncate an older body. A shorter value leaves stale tail bytes, while assigning an empty value leaves the entire body. Clear `Content` before assigning a replacement.

This local mutation does not affect the remote response. It can be useful to normalise a buffered value for later Velox processing, but preserve the original bytes first if audit or signature verification depends on them.

**External references**

- [Embarcadero `TEncoding.UTF8`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.UTF8)
- [Free Pascal `TUTF8Encoding`](https://www.freepascal.org/docs-html/rtl/classes/tutf8encoding.html) - compatible encoding context; Velox executes Delphi `TEncoding.UTF8`.
- [RFC 3629: UTF-8](https://www.rfc-editor.org/rfc/rfc3629)

<small>Created 2026-07-20</small>
