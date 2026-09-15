---
title: ContentAsUTF16BE
description: Decodes or rewrites the buffered response body as big-endian UTF-16 without automatic BOM removal.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, utf-16be, encoding]
---

```Delphi
property ContentAsUTF16BE: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Get('https://legacy.example.invalid/v1/utf16be');
  if Http.Response.Success then
    Value := Http.Response.ContentAsUTF16BE;
end;
```

### Usage

`ContentAsUTF16BE` decodes or rewrites the buffered response body as big-endian UTF-16 without automatic BOM removal.

### Additional Technical Info
`ContentAsUTF16BE` treats every pair of [`Content`](Content.md) bytes as big-endian UTF-16 through Delphi `TEncoding.BigEndianUnicode`. Header metadata is ignored. Because the encoding is supplied explicitly, a leading big-endian BOM is decoded as U+FEFF rather than stripped.

The getter resets the stream to zero, reads its entire size and leaves the position at the end. A trailing unmatched byte cannot form a code unit and is silently ignored. The installed Delphi implementation swaps complete 16-bit code units without validating surrogate pairing, so unpaired surrogates can remain in the resulting string.

The setter emits big-endian UTF-16 without a BOM, writes from offset zero and rewinds. The underlying writer does not truncate old data. Shorter text can leave old tail bytes that corrupt later decoding; empty text does not clear anything. Call `Content.Clear` before replacement.

Do not confuse this property with `ContentAsUTF16`, which uses little-endian byte order. Select the view from a trusted endpoint contract rather than guessing from content.

**External references**

- [Embarcadero `TEncoding.BigEndianUnicode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.BigEndianUnicode)
- [Free Pascal `TBigEndianUnicodeEncoding`](https://www.freepascal.org/docs-html/rtl/classes/tbigendianunicodeencoding.html) - compatible context; Velox executes Delphi's encoding.
- [RFC 2781: UTF-16](https://www.rfc-editor.org/rfc/rfc2781)

<small>Created 2026-07-20</small>
