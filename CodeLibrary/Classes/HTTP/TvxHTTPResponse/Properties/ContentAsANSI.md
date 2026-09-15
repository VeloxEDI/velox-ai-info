---
title: ContentAsANSI
description: Decodes or rewrites the buffered response body with the Windows host ANSI encoding.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, response, ansi, encoding]
---

```Delphi
property ContentAsANSI: String read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Get('https://legacy.example.invalid/v1/text');
  if Pos('charset=windows-1252', LowerCase(Http.Response.Header['Content-Type'])) > 0 then
    Value := Http.Response.ContentAsANSI
  else
    Value := Http.Response.ContentAsUTF8;
end;
```

### Usage

`ContentAsANSI` decodes or rewrites the buffered response body with the Windows host ANSI encoding.

### Additional Technical Info
`ContentAsANSI` interprets the entire [`Content`](Content.md) stream using Delphi's `TEncoding.ANSI`. On Windows this is the current process/system ANSI code page, so the same bytes can decode differently on hosts with different locale settings. It does not inspect `Content-Type` or its charset parameter.

The getter rewinds the stream, reads all bytes and leaves its position at the end. It supplies the encoding explicitly, so a leading byte-order mark is decoded as data rather than stripped by Velox's generic BOM detection.

The setter encodes the supplied string with the host ANSI code page, writes from offset zero and returns the stream position to zero. It does **not** clear or truncate the existing stream. Writing a shorter value leaves old tail bytes; writing an empty string leaves every old byte intact. Call [`Content.Clear`](../../../Stream/TMemoryStream/Methods/Clear.md) before assignment when replacement semantics are required.

Characters absent from the host code page are subject to the Delphi encoding fallback and may be replaced. Prefer [`ContentAsUTF8`](ContentAsUTF8.md) for Unicode APIs and use this property only when the endpoint contract explicitly requires the host's ANSI encoding. Assigning any response text property mutates the locally buffered copy; it does not alter the already received server response.

**External references**

- [Embarcadero `TEncoding.ANSI`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.ANSI)
- [Free Pascal code-page support](https://www.freepascal.org/docs-html/rtl/system/setcodepage.html) - analogous code-page context; Velox executes Delphi `TEncoding.ANSI`.
- [RFC 9110 section 8.3: Content-Type](https://www.rfc-editor.org/rfc/rfc9110#section-8.3)

<small>Created 2026-07-20</small>
