---
title: ContentAsUTF8
description: Reads or writes explicit UTF-8 request bytes while preserving a decoded BOM and retaining old trailing bytes after shorter writes.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, body, utf-8, encoding]
---

```Delphi
property ContentAsUTF8: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Content.Clear;
  Http.ContentAsUTF8 := '{"reference":"DEMO-1001"}';
  Http.Header['Content-Type'] := 'application/json; charset=utf-8';
  Http.Post('https://api.example.invalid/v1/messages');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

`ContentAsUTF8` reads or writes explicit UTF-8 request bytes while preserving a decoded BOM and retaining old trailing bytes after shorter writes.

### Additional Technical Info
`ContentAsUTF8` is the explicit UTF-8 view over the shared [`Content`](Content.md) request stream. Unlike [`ContentAsString`](ContentAsString.md), its getter does not fall back to ANSI and does not remove a byte-order mark.

The setter writes `TEncoding.UTF8.GetBytes` output from offset zero and does not emit the UTF-8 preamble `EF BB BF`. The shared helper never truncates: shorter content retains old trailing bytes and assigning `''` leaves the complete prior body intact. Clear `Content` before using this property as a replacement setter.

The getter decodes all bytes as UTF-8. If the stream begins with `EF BB BF`, explicit decoding returns U+FEFF as the first character. The installed Delphi decoder rejects malformed UTF-8; the property does not substitute another encoding. Reading normally leaves the stream at its end, while Indy independently rewinds it for a request.

Use this property for JSON and other modern text interfaces whose byte contract is UTF-8, and set a matching `Content-Type` when appropriate. The full encoded/decoded representation is buffered in memory and raw request logging can disclose the payload.

**Related entries**

- [`StringToStreamUTF8`](../../../../Functions/Conversion/StringToStreamUTF8.md) and [`StreamToStringUTF8`](../../../../Functions/Conversion/StreamToStringUTF8.md) document the same explicit UTF-8 terminals.
- [`ContentAsString`](ContentAsString.md) has a different read contract despite using the same UTF-8 write path.

**External references**

- [Embarcadero `TEncoding.UTF8`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.UTF8), [`TEncoding.GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString)
- [Free Pascal `TEncoding.UTF8`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.utf8.html) and [`TUTF8Encoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tutf8encoding.html) - compatible UTF-8 context; the exact malformed-input behavior is Delphi-specific.

<small>Created 2026-07-15</small>
