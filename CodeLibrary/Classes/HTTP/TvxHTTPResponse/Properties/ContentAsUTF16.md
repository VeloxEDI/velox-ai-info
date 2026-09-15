---
title: ContentAsUTF16
description: Decodes or rewrites the buffered response body as little-endian UTF-16 without automatic BOM removal.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, utf-16, encoding]
---

```Delphi
property ContentAsUTF16: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Get('https://legacy.example.invalid/v1/utf16le');
  if Http.Response.Success then
    Value := Http.Response.ContentAsUTF16;
end;
```

### Usage

`ContentAsUTF16` decodes or rewrites the buffered response body as little-endian UTF-16 without automatic BOM removal.

### Additional Technical Info
`ContentAsUTF16` treats the whole [`Content`](Content.md) stream as Delphi `TEncoding.Unicode`, which is little-endian UTF-16. It does not inspect `Content-Type` and it supplies the encoding explicitly, so a leading UTF-16LE BOM is preserved as a decoded U+FEFF character rather than removed.

The getter reads from offset zero through the complete stream and leaves the position at the end. An unmatched final byte cannot form a UTF-16 code unit and is silently ignored. The installed Delphi implementation copies complete 16-bit code units without validating surrogate pairing, so an unpaired surrogate can remain in the resulting string.

The setter emits little-endian UTF-16 bytes without adding a BOM, writes at offset zero and rewinds. It does not truncate: a shorter value can retain old complete or partial code units, and assigning an empty string retains the prior body. Clear `Content` before assignment for safe replacement.

Use this property only when the endpoint contract explicitly requires little-endian UTF-16. For BOM-led automatic detection use the read-only behavior of `ContentAsString`, while noting its ANSI fallback and unrelated ASCII setter.

**External references**

- [Embarcadero `TEncoding.Unicode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.Unicode)
- [Free Pascal `TUnicodeEncoding`](https://www.freepascal.org/docs-html/rtl/classes/tunicodeencoding.html) - compatible encoding context; Velox executes Delphi `TEncoding.Unicode`.
- [RFC 2781: UTF-16](https://www.rfc-editor.org/rfc/rfc2781)

<small>Created 2026-07-20</small>
