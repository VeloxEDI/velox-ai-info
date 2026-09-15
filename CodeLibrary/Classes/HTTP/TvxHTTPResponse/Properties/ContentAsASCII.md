---
title: ContentAsASCII
description: Decodes or rewrites the buffered response body with Delphi's seven-bit ASCII encoding.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, ascii, encoding]
---

```Delphi
property ContentAsASCII: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Get('https://device.example.invalid/v1/health');
  if Http.Response.Success then
    Value := Trim(Http.Response.ContentAsASCII)
  else
    Value := 'HTTP ' + IntToStr(Http.Response.ResponseCode);
end;
```

### Usage

`ContentAsASCII` decodes or rewrites the buffered response body with Velox's seven-bit ASCII encoding.

### Additional Technical Info
`ContentAsASCII` decodes every byte in [`Content`](Content.md) with Delphi's ASCII encoding. It is appropriate only for payloads whose contract is restricted to the ASCII repertoire; it does not inspect response headers or infer a charset.

The getter resets the stream to offset zero, reads its complete size and leaves the position at the end. Because the encoding is explicit, a leading BOM is not removed by Velox's generic detection path.

The setter encodes the value as ASCII, writes at offset zero and rewinds the stream. The shared writer never truncates. A shorter replacement retains old tail bytes, and assigning `''` writes zero bytes without clearing anything. Call [`Content.Clear`](../../../Stream/TMemoryStream/Methods/Clear.md) first when replacing an earlier body.

Non-ASCII characters cannot round-trip through this property and are subject to Delphi's replacement fallback. This limitation is especially important because [`ContentAsString`](ContentAsString.md) unexpectedly uses the same ASCII setter despite having a different getter. Use `ContentAsUTF8` for general Unicode text.

**External references**

- [Embarcadero `TEncoding.ASCII`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.ASCII)
- [Free Pascal ASCII conversion context](https://www.freepascal.org/docs-html/rtl/system/astring.html) - analogous string context; Velox executes Delphi `TEncoding.ASCII`.
- [RFC 9110 section 8.3: Content-Type](https://www.rfc-editor.org/rfc/rfc9110#section-8.3)

<small>Created 2026-07-20</small>
