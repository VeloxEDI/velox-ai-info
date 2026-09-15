---
title: ContentTransfer
description: Reads or replaces the first Content-Transfer-Encoding header token without transforming or checking the part body.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, mime, transfer-encoding, base64]
---

```Delphi
property ContentTransfer: string read write;
```

### Example

```Delphi
procedure RequestBase64(const Part: TIdMessagePart);
begin
  Part.ContentTransfer := 'base64';
end;
```

### Usage

`ContentTransfer` reads or replaces the first Content-Transfer-Encoding header token without transforming or checking the part body.

### Additional Technical Info
`ContentTransfer` maps to the first `Content-Transfer-Encoding` header value. Nonempty assignment stores the raw String; empty removes the first occurrence. Duplicates may remain.

Assignment does not encode/decode the body and does not validate `7bit`, `8bit`, `binary`, `quoted-printable`, `base64` or extension tokens. A metadata/body mismatch can produce invalid or corrupted mail when another component assumes the declaration is accurate.

For text, [`TIdText.IsBodyEncodingRequired`](../../TIdText/Methods/IsBodyEncodingRequired.md) only detects characters above ASCII and does not choose/set this property. Apply the mail encoder's complete policy rather than blindly assigning from that Boolean.

The property is independent of [`IsEncoded`](IsEncoded.md), which remains false in current part source. Header mutation is synchronous and not thread-safe.

The source-reviewed example sets metadata only; it did not encode or send content.

**External references**

- [Indy upstream: `TIdMessagePart.SetContentTransfer`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - raw header mapping.
- [RFC 2045 section 6](https://www.rfc-editor.org/rfc/rfc2045.html#section-6) - MIME transfer-encoding rules.

<small>Created 2026-07-15</small>
