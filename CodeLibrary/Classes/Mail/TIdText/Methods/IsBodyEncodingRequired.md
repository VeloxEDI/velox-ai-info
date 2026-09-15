---
title: IsBodyEncodingRequired
description: Reports whether any stored Delphi UTF-16 code unit exceeds ASCII 127, without checking other MIME transfer constraints.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, text-part, ascii, encoding, unicode]
---

```Delphi
function IsBodyEncodingRequired: Boolean;
```

### Example

```Delphi
procedure CheckText(const Part: TIdText; var Value: Variant);
begin
  Value := Part.IsBodyEncodingRequired;
end;
```

### Usage

`IsBodyEncodingRequired` reports whether any stored Velox UTF-16 code unit exceeds ASCII 127, without checking other MIME transfer constraints.

### Additional Technical Info
`IsBodyEncodingRequired` scans every String in [`Body`](../Properties/Body.md), then every 1-based Delphi `Char`. It returns true at the first code unit greater than `#127`; otherwise false.

Empty/ASCII-only bodies return false. Any non-ASCII BMP character returns true, and either surrogate code unit of a supplementary character also returns true. Line-break characters between TStrings entries are not explicitly scanned.

The name overstates the result. ASCII control characters (including NUL and DEL), long lines, leading dots, transport 7-bit limits and an incompatible selected ContentTransfer do not make it true. Conversely true does not choose base64 versus quoted-printable or perform encoding.

Use it as a narrow non-ASCII signal only. The actual MIME/SMTP encoder must decide encoding from content, charset and transport policy. The method does not mutate Body or metadata.

Worst-case time is O(total UTF-16 code units), extra memory is one copied line String at a time (`S := FBody[i]`). Concurrent body mutation is unsupported.

The source-reviewed example reads only and was not runtime-tested.

**External references**

- [Indy upstream: `TIdText.IsBodyEncodingRequired`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdText.pas) - exact nested scan.
- [RFC 2045 section 6](https://www.rfc-editor.org/rfc/rfc2045.html#section-6) - complete transfer-encoding context beyond this Boolean.

<small>Created 2026-07-15</small>
