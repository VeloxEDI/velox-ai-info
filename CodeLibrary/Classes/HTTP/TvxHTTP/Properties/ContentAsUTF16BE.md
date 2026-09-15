---
title: ContentAsUTF16BE
description: Reads or writes explicit big-endian UTF-16 request bytes without automatic BOM removal, emission, or stream truncation.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, body, utf-16be, big-endian]
---

```Delphi
property ContentAsUTF16BE: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Content.Clear;
  Http.ContentAsUTF16BE := 'DEMO-1001';
  Http.Header['Content-Type'] := 'text/plain; charset=utf-16be';
  Http.Post('https://api.example.invalid/v1/unicode-message');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

`ContentAsUTF16BE` reads or writes explicit big-endian UTF-16 request bytes without automatic BOM removal, emission, or stream truncation.

### Additional Technical Info
`ContentAsUTF16BE` treats the shared [`Content`](Content.md) stream as explicit big-endian UTF-16 through Delphi `TEncoding.BigEndianUnicode`. Each Delphi UTF-16 code unit is written high byte first.

The setter writes no `FE FF` BOM. It starts at offset zero but does not truncate, so a shorter encoded value retains old trailing bytes and `''` leaves the prior body untouched. Clear `Content` before setting a replacement value.

The getter consumes every complete byte pair as big-endian and does not detect or switch byte order. A matching BOM is decoded as a leading U+FEFF character rather than removed. The current decoder ignores one unmatched final byte. Little-endian input produces byte-swapped characters.

Surrogate pairs are copied as code units, and unpaired-surrogate handling follows the installed Delphi conversion. The getter normally leaves the shared stream at its end; Indy later rewinds the entire body. Velox does not set `Content-Type` or `charset` from this property.

**Related entries**

- [`StringToStreamUTF16BE`](../../../../Functions/Conversion/StringToStreamUTF16BE.md) and [`StreamToStringUTF16BE`](../../../../Functions/Conversion/StreamToStringUTF16BE.md) document the same explicit big-endian terminals.
- [`ContentAsUTF16`](ContentAsUTF16.md) selects little-endian byte order; [`ContentAsString`](ContentAsString.md) can select byte order from a supported BOM on read.

**External references**

- [Embarcadero `TEncoding.BigEndianUnicode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.BigEndianUnicode), [`TEncoding.GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString)
- [Free Pascal `TEncoding.BigEndianUnicode`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.bigendianunicode.html) and [`TBigEndianUnicodeEncoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tbigendianunicodeencoding.html) - compatible byte-order context; current edge behavior follows Delphi source.

<small>Created 2026-07-15</small>
