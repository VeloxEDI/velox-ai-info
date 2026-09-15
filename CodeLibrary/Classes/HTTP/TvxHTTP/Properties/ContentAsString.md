---
title: ContentAsString
description: Writes BOM-free UTF-8 but reads by BOM detection with a host-ANSI fallback, making its two directions intentionally asymmetric.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, body, encoding, bom, utf-8]
---

```Delphi
property ContentAsString: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Content.Clear;
  Http.ContentAsString := '{"reference":"DEMO-1001"}';
  Http.Header['Content-Type'] := 'application/json; charset=utf-8';
  Http.Post('https://api.example.invalid/v1/messages');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

`ContentAsString` writes BOM-free UTF-8 but reads by BOM detection with a host-ANSI fallback, making its two directions intentionally asymmetric.

### Additional Technical Info
`ContentAsString` is not a symmetric “default encoding” property. Writing always uses BOM-free UTF-8. Reading detects only a leading UTF-8, UTF-16 little-endian or UTF-16 big-endian byte-order mark, removes that preamble and decodes accordingly; without one of those BOMs it falls back to the Velox host's Windows ANSI code page.

The write path calls the shared stream helper at position zero. It emits no UTF-8 BOM and never truncates the existing [`Content`](Content.md) stream. If the new UTF-8 representation is shorter, stale tail bytes remain in the request; assigning `''` changes nothing. Always call `Content.Clear` first when replacing a body.

The read path is BOM recognition rather than content or HTTP-header detection. It does not consult `Content-Type`, `charset`, XML declarations or JSON rules, and it does not infer BOM-free UTF-8. ASCII-only UTF-8 happens to survive the ANSI fallback, but non-ASCII text is host-dependent. For a known wire encoding, use the matching explicit `ContentAs...` property.

Reading consumes the complete stream and normally leaves its position at the end. Indy rewinds before transmission, so that side effect does not shorten a subsequent request. A malformed byte sequence in a BOM-selected UTF-8 body can raise. The full byte array and resulting string coexist in memory during conversion.

The body follows the one-shot and pre-terminal-retention rules documented under [`Content`](Content.md). Set a `Content-Type` value consistent with the write path; Velox does not do this automatically.

**Related entries**

- [`StringToStream`](../../../../Functions/Conversion/StringToStream.md) matches the UTF-8 write terminal.
- [`StreamToString`](../../../../Functions/Conversion/StreamToString.md) documents the same BOM-selection and ANSI-fallback read terminal.

**External references**

- [Embarcadero `TEncoding.GetBufferEncoding`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBufferEncoding), [`TEncoding.UTF8`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.UTF8) and [`TEncoding.ANSI`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.ANSI)
- [Free Pascal `TEncoding.GetBufferEncoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.getbufferencoding.html) and [`TEncoding.UTF8`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.utf8.html) - compatible API context; the exact fallback and error behavior is Delphi-specific.

<small>Created 2026-07-15</small>
