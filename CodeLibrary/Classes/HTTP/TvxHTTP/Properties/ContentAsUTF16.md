---
title: ContentAsUTF16
description: Reads or writes explicit little-endian UTF-16 request bytes without automatic BOM removal, emission, or stream truncation.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, body, utf-16, little-endian]
---

```Delphi
property ContentAsUTF16: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Content.Clear;
  Http.ContentAsUTF16 := 'DEMO-1001';
  Http.Header['Content-Type'] := 'text/plain; charset=utf-16le';
  Http.Post('https://api.example.invalid/v1/unicode-message');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

`ContentAsUTF16` reads or writes explicit little-endian UTF-16 request bytes without automatic BOM removal, emission, or stream truncation.

### Additional Technical Info
`ContentAsUTF16` interprets the shared [`Content`](Content.md) stream as explicit little-endian UTF-16 using Delphi `TEncoding.Unicode`. Each Delphi UTF-16 code unit is written low byte first.

The setter emits payload bytes only; it does not prepend the `FF FE` BOM. It writes from offset zero but never shortens the stream. Shorter text can therefore be followed by stale bytes from an older body, and assigning `''` leaves that old body unchanged. Clear `Content` before replacement.

The getter decodes every complete two-byte pair as little-endian. It does not auto-detect byte order and does not remove a BOM; a matching `FF FE` prefix is returned as the leading U+FEFF character. An unmatched final byte is ignored by the current Delphi decoder. Big-endian input is byte-swapped rather than corrected automatically.

Surrogate pairs remain two UTF-16 code units and current encoding does not make this property a Unicode-validity check. Reading normally leaves the stream at its end, but Indy rewinds the complete stream before sending it. Set the request `Content-Type` explicitly because Velox does not infer a charset.

**Related entries**

- [`StringToStreamUTF16`](../../../../Functions/Conversion/StringToStreamUTF16.md) and [`StreamToStringUTF16`](../../../../Functions/Conversion/StreamToStringUTF16.md) document the same explicit little-endian terminals.
- [`ContentAsUTF16BE`](ContentAsUTF16BE.md) selects big-endian byte order; [`ContentAsString`](ContentAsString.md) can remove a supported leading BOM on read.

**External references**

- [Embarcadero `TEncoding.Unicode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.Unicode), [`TEncoding.GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString)
- [Free Pascal `TEncoding.Unicode`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.unicode.html) and [`TUnicodeEncoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tunicodeencoding.html) - compatible UTF-16 context; current edge behavior follows Delphi source.

<small>Created 2026-07-15</small>
