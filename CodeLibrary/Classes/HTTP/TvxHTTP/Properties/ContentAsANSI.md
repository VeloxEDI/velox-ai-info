---
title: ContentAsANSI
description: Reads or writes the request body through the Velox host's Windows ANSI code page without BOM handling or truncation.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, http, request, body, ansi, encoding]
---

```Delphi
property ContentAsANSI: string read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Http.Content.Clear;
  Http.ContentAsANSI := 'DEMO-1001';
  Http.Header['Content-Type'] := 'text/plain';
  Http.Post('https://api.example.invalid/v1/legacy-message');
  Value := Http.Response.ResponseCode;
end;
```

### Usage

`ContentAsANSI` reads or writes the request body through the Velox host's Windows ANSI code page without BOM handling or truncation.

### Additional Technical Info
`ContentAsANSI` is a text view over the shared [`Content`](Content.md) request stream. It uses Delphi `TEncoding.ANSI`, whose process-wide instance captures the Windows active ANSI code page. The same script can therefore produce or interpret different bytes on hosts configured with different system code pages.

Writing rewinds the stream, encodes the string and writes from offset zero. It emits no byte-order mark or code-page identifier. Critically, the helper never reduces `Content.Size`: shorter text leaves the old trailing bytes in the outgoing body, and assigning `''` writes nothing and leaves all previous bytes intact. Clear the body first, as shown, whenever the property is meant to replace it.

Reading rewinds and decodes every byte through the active ANSI code page, without detecting or removing a BOM. It normally leaves `Content.Position = Content.Size`; Indy later rewinds the stream when sending. Bytes that do not map cleanly and characters that cannot be encoded can be substituted according to the Windows conversion. No loss or round-trip check occurs.

This property is for an integration contract that explicitly requires the deployment's legacy ANSI code page. It is not a portable meaning of “text.” Prefer [`ContentAsUTF8`](ContentAsUTF8.md) for new interfaces, and specify a matching `Content-Type` charset when the protocol permits it.

The body remains one-shot after an HTTP terminal, but pre-terminal setup failure can leave it queued. It is stored fully in memory and can be written to the raw HTTP log. Apply the same size, secrecy and trust controls described for [`Content`](Content.md).

**Related entries**

- [`StringToStreamANSI`](../../../../Functions/Conversion/StringToStreamANSI.md) and [`StreamToStringANSI`](../../../../Functions/Conversion/StreamToStringANSI.md) expose the same encoding behavior for caller-owned streams.

**External references**

- [Embarcadero `TEncoding.ANSI`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.ANSI), [`TEncoding.GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString)
- [Free Pascal `TEncoding.ANSI`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.ansi.html) - compatible code-page context; current behavior follows the installed Delphi RTL.

<small>Created 2026-07-15</small>
