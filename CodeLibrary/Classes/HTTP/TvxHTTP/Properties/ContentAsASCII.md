---
title: ContentAsASCII
description: Reads or writes the request body as explicit seven-bit ASCII while retaining any old bytes beyond a shorter new value.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, body, ascii, encoding]
---

```Delphi
property ContentAsASCII: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Content.Clear;
  Http.ContentAsASCII := 'DEMO-1001';
  Http.Header['Content-Type'] := 'text/plain; charset=us-ascii';
  Http.Post('https://api.example.invalid/v1/ascii-message');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

`ContentAsASCII` reads or writes the request body as explicit seven-bit ASCII while retaining any old bytes beyond a shorter new value.

### Additional Technical Info
`ContentAsASCII` exposes the shared [`Content`](Content.md) buffer through Delphi `TEncoding.ASCII`. Use it only when the interface restricts data to the seven-bit ASCII repertoire.

The setter rewinds and writes encoded bytes without a BOM. It does not truncate: a shorter value overwrites only its own length and retains the old tail, while `''` leaves the prior body untouched. Clear `Content` first for replacement semantics. Characters above U+007F are outside the intended contract and can be substituted or rejected by the installed conversion; Velox performs no repertoire or round-trip validation.

The getter rewinds and decodes the complete stream with the explicit ASCII encoding. It does not inspect a BOM and normally leaves the stream at its end. Bytes outside ASCII do not become evidence of another encoding; their conversion is implementation dependent and can lose information.

Indy transmits the entire stream size and rewinds it independently, so reading this property before a request does not cause an empty send. The normal request `finally` clears the body, while a failure before the HTTP terminal can leave it queued. The body is held in memory and can appear in HTTP request logging.

**Related entries**

- [`StringToStreamASCII`](../../../../Functions/Conversion/StringToStreamASCII.md) and [`StreamToStringASCII`](../../../../Functions/Conversion/StreamToStringASCII.md) use the same Delphi encoding for caller-owned streams.

**External references**

- [Embarcadero `TEncoding.ASCII`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.ASCII), [`TEncoding.GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString)
- [Free Pascal `TEncoding.ASCII`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.ascii.html) - compatible encoding context; Velox executes the installed Delphi path.

<small>Created 2026-07-15</small>
