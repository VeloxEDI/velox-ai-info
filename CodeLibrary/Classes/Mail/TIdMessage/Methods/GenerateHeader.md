---
title: GenerateHeader
description: Recounts and normalizes message state, resolves layout, creates MIME boundary data and builds the internal output-header list from typed and raw values.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, mime, generate-header, serialization]
---

```Delphi
procedure GenerateHeader;
```

### Example

```Delphi
procedure PrepareMessageHeaders(const Message: TIdMessage;
  var Value: Variant);
begin
  Message.GenerateHeader;
  Value := Message.ContentType;
end;
```

### Usage

`GenerateHeader` updates message counts, resolves the message layout, creates MIME boundary values and prepares the output headers from typed properties and raw header lines.

### Additional Technical Info
`GenerateHeader` prepares the message's internal registered-but-ungenerated `LastGeneratedHeaders` list for serialization. It is a mutating normalization pass, not a read-only preview.

The method first recounts MessageParts. If Encoding is `meDefault`, it permanently sets `mePlainText` when no parts exist or `meMIME` when at least one exists; the Encoding setter also selects `UUE` or `MIME` AttachmentEncoding. Later part changes do not restore `meDefault` automatically.

It then normalizes each nonempty part ContentTransfer token. MIME accepts `7bit`, `8bit`, `binary`, `base64`, `quoted-printable` and `binhex40`; unknown values become `base64`. Plain-text layout accepts only `UUE`/`XXE`; unknown values become `UUE`. With any parts present, a message-level ContentTransferEncoding outside `7bit`/`8bit`/`binary` is cleared.

For MIME layout, the method clears the boundary stack, generates a new random boundary and pushes it as parent `-1`. Repeated calls therefore replace the prior boundary. When ContentType is empty it stores an inferred value:

- any attachment produces `multipart/mixed`;
- more than one text part and no attachment produces `multipart/alternative`;
- otherwise it uses `text/plain`.

The selected encoder then initializes headers. Header-character encoding/charset comes from Indy's platform default and an internal event hook. The method copies raw Headers into LastGeneratedHeaders and sets/replaces the first standard fields from typed state: From, Subject, To, Cc, Newsgroups, MIME/content headers, Sender, Reply-To, Organization, receipt headers, References, Date, priority headers, Message-ID and In-Reply-To.

Bcc is removed during normal generation and included only while `SaveToFile` has set an internal flag; direct `SaveToStream` follows the omission path. Date is current local time when UseNowForDate is true, otherwise the stored Date, then converted to an RFC/GMT string. Normal priority removes all three priority headers. Message-ID is not auto-generated.

A one-part MIME message with empty preamble is marked single-part: message-level content headers are removed so the part encoder can append its headers later. Otherwise text content without a charset uses `us-ascii`, and multipart output receives the generated boundary parameter.

Finally, ExtraHeaders are appended and may introduce duplicates. They do not reliably override the first standard value. The method does not serialize bytes itself and does not make the object immutable.

Every stage can change live message/part/header state before a later failure. Registry lookup, address/header encoding, date conversion, boundary generation and allocation can raise; there is no rollback. Cost is linear in parts plus header/address content, with extra encoding cost, and the object is not thread-safe. The source-reviewed example was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessage.GenerateHeader`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - generation pipeline baseline.
- [RFC 2045 section 5.2](https://www.rfc-editor.org/rfc/rfc2045.html#section-5.2) - default Content-Type semantics.
- [RFC 2046 section 5.1.1](https://www.rfc-editor.org/rfc/rfc2046.html#section-5.1.1) - multipart boundaries.
- [RFC 2047](https://www.rfc-editor.org/rfc/rfc2047.html) - encoded non-ASCII header words.
- [RFC 5322 section 3.6.3](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6.3) - destination address fields including Bcc.

<small>Created 2026-07-15</small>
