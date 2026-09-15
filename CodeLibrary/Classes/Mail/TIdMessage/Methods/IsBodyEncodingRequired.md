---
title: IsBodyEncodingRequired
description: Returns true only when an individual Body line contains a Delphi UTF-16 code unit above 127, not when other transfer-encoding constraints apply.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, body, encoding, unicode, transfer-encoding]
---

```Delphi
function IsBodyEncodingRequired: Boolean;
```

### Example

```Delphi
procedure CheckBodyCharacters(const Message: TIdMessage;
  var Value: Variant);
begin
  Value := Message.IsBodyEncodingRequired;
end;
```

### Usage

`IsBodyEncodingRequired` returns true only when an individual Body line contains a Velox UTF-16 code unit above 127, not when other transfer-encoding constraints apply.

### Additional Technical Info
`IsBodyEncodingRequired` scans every character of every individual message-level Body line. It returns true at the first Delphi `Char` greater than `#127`; otherwise it returns false.

This is only a non-ASCII detector. It does not inspect line separators inserted by `TStrings`, MIME part bodies or attachments. It also does not test SMTP line-length limits, dot transparency, NUL/other ASCII controls, trailing whitespace, declared charset, invalid surrogate pairing or whether a chosen transfer encoding can represent the body.

Delphi strings are UTF-16. Any non-ASCII BMP character and either surrogate code unit of a supplementary character is greater than 127, so both cause true. Pure ASCII content—including controls that may still require handling—returns false.

The method does not set ContentTransferEncoding or encode data. Callers must choose a charset and standards-compliant transfer encoding separately; [`GenerateHeader`](GenerateHeader.md) does not use this function to validate the message-level transfer-encoding value.

Time is O(total characters until the first match), with one line copied into a local string per outer iteration. The object is mutable and unsynchronized. The source-reviewed example reports the narrow predicate only and was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessage.IsBodyEncodingRequired`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - exact greater-than-127 scan.
- [RFC 2045 section 6](https://www.rfc-editor.org/rfc/rfc2045.html#section-6) - MIME Content-Transfer-Encoding rules that extend beyond this helper.
- [Embarcadero DocWiki: `System.Char`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Char) - Delphi UTF-16 code-unit type.
- [Free Pascal: `UnicodeChar`](https://www.freepascal.org/docs-html/rtl/system/unicodechar.html) - compatibility context only; Velox uses Delphi `Char`.

<small>Created 2026-07-15</small>
