---
title: ContentAsString
description: Reads the response with BOM detection and ANSI fallback but unexpectedly writes it as ASCII.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, encoding, ascii, quirk]
---

```Delphi
property ContentAsString: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Get('https://api.example.invalid/v1/message');
  { Prefer an explicit view when the response contract declares UTF-8. }
  if Pos('charset=utf-8', LowerCase(Http.Response.Header['Content-Type'])) > 0 then
    Value := Http.Response.ContentAsUTF8
  else
    Value := Http.Response.ContentAsString;
end;
```

### Usage

`ContentAsString` reads the response with BOM detection and ANSI fallback but unexpectedly writes it as ASCII.

### Additional Technical Info
`ContentAsString` has deliberately documented asymmetric behavior. Its getter rewinds [`Content`](Content.md), reads all bytes, recognises UTF-8, UTF-16LE or UTF-16BE only when a corresponding BOM is present, removes that BOM and decodes the remainder. Without a recognised BOM it falls back to the Windows host ANSI code page. It does not consult `ContentType`, the raw `Content-Type` field or Indy's parsed charset.

Its setter does **not** use the inverse of that logic. The implementation calls `TEncoding.ASCII`, despite a nearby source comment saying the default is UTF-8. Non-ASCII characters can therefore be replaced and a value read successfully from BOM-marked Unicode cannot generally be written back unchanged. Treat this as an implementation quirk/bug and use the explicit `ContentAsUTF8`, `ContentAsUTF16` or `ContentAsUTF16BE` setter instead.

The getter leaves the shared stream at its end. The setter writes BOM-free ASCII bytes from offset zero and returns the position to zero. It never truncates the old stream: a shorter value retains stale tail bytes, and assigning an empty string preserves the entire previous body. Clear `Content` first when replacing it.

This property mutates only the locally buffered response and cannot change what the remote server sent. For deterministic integration logic, select an explicit encoding from a trusted endpoint contract; do not blindly trust a remote charset declaration.

**External references**

- [Embarcadero `TEncoding.GetBufferEncoding`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBufferEncoding), [`TEncoding.ANSI`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.ANSI) and [`TEncoding.ASCII`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.ASCII)
- [Free Pascal `TEncoding`](https://www.freepascal.org/docs-html/rtl/classes/tencoding.html) - compatible encoding context; Velox executes the traced Delphi implementation.
- [RFC 9110 section 8.3: Content-Type](https://www.rfc-editor.org/rfc/rfc9110#section-8.3)

<small>Created 2026-07-20</small>
