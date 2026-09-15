---
title: mePlainText
description: Selects Indy's non-MIME message layout with a text body and optional legacy UUE or XXE attachments.
sidebar_position: 166
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - constant
  - mail
  - indy
  - plain-text
  - uue
  - legacy
---

```Delphi
mePlainText = 2
```

### Example

```Delphi
procedure ConfigureSimpleMessage(Message: TIdMessage);
begin
  Message.Encoding := mePlainText;
  Message.CharSet := 'utf-8';
  Message.Body.Text := 'Processing completed.';
end;
```

### Usage

`mePlainText` selects Velox's non-MIME message layout with a text body and optional legacy UUE or XXE attachments.

### Additional Technical Info
`mePlainText` is the non-MIME layout member of [`TIdMessageEncoding`](../../Types/Enumerations/TIdMessageEncoding.md). It writes the main [`Body`](../../Classes/Mail/TIdMessage/Properties/Body.md) first, followed by optional legacy text or UUE/XXE attachment blocks.

The name describes layout, not character encoding. The example explicitly selects UTF-8 separately. It is source-reviewed and is not executed by the documentation workflow.

**Assignment side effect**

Setting `Encoding := mePlainText` stores the enum and immediately selects `UUE` as [`AttachmentEncoding`](../../Classes/Mail/TIdMessage/Properties/AttachmentEncoding.md). Assign `XXE` afterwards if a known legacy recipient requires it. Encoder registry lookup can raise after the enum field changes, leaving partially updated state.

**Output layout**

The message writer emits:

1. the RFC-style message headers and blank separator;
2. Body using the message `CharSet` conversion;
3. each text part between literal start/end text-attachment marker lines; and
4. each binary attachment through UUE or XXE, defaulting to UUE when no supported preference is present.

This is not MIME multipart output. Modern mail systems may not recognize, expose or preserve legacy inline UUE/XXE attachments reliably. Prefer [`meMIME`](meMIME.md) for normal production attachments and alternative bodies.

**Transfer-encoding interaction**

`mePlainText` does not mean that the main body must be raw 7-bit text. With no message parts, a whole-body `ContentTransferEncoding` of `base64` or `quoted-printable` is handled before the plain-layout writer and can encode Body.

When parts exist, header generation clears a nonempty whole-body transfer value other than `7bit`, `8bit` or `binary`, because the implementation cannot nest attachments inside an encoded body. For each part whose nonempty transfer name is neither `UUE` nor `XXE`, generation overwrites it with `UUE`.

**Automatic and input selection**

[`meDefault`](meDefault.md) resolves to `mePlainText` when `MessageParts.Count` is zero. Adding parts after that resolution does not automatically switch the stored value to MIME.

On input, Indy selects `mePlainText` whenever `MIME-Version` is absent, even if other headers look MIME-like. A MIME boundary without `MIME-Version` does not change that result. Changing the enum later does not reparse the already loaded representation.

**Body and content boundaries**

- `CharSet` remains responsible for converting Body text to bytes.
- `ContentType` and `ContentTransferEncoding` are separate headers; this enum does not validate them.
- An empty or whitespace-only Body is still a valid layout choice but can result in attachment-only legacy output.
- Text parts and their marker lines are an Indy legacy convention, not a MIME alternative-body structure.

**Errors and side effects**

The constant itself does not raise. Assignment, charset conversion, message/attachment encoder lookup, attachment stream access and output I/O can fail. Header generation can normalize transfer fields before a later failure.

**Performance and concurrency**

Body and every part are written sequentially; binary attachments incur UUE/XXE expansion and I/O. Do not send/save or mutate a shared message concurrently.

**Related entries**

- [`meDefault`](meDefault.md) automatically selects this layout only when no parts exist.
- [`meMIME`](meMIME.md) is the interoperable layout for normal multipart mail.
- [`TIdMessage.ContentTransferEncoding`](../../Classes/Mail/TIdMessage/Properties/ContentTransferEncoding.md) controls whole-body transfer encoding.
- [`TIdMessage.Encoding`](../../Classes/Mail/TIdMessage/Properties/Encoding.md) documents selection and mutation behavior.

**External references**

- [RFC 5322, Internet Message Format body](https://www.rfc-editor.org/rfc/rfc5322.html#section-2.3)
- [RFC 2045, MIME and content-transfer encoding](https://www.rfc-editor.org/rfc/rfc2045.html)
- [Indy `IdMessageClient.pas` upstream source](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageClient.pas) - legacy body/attachment writer compatibility reference; Velox's source is authoritative.

<small>Created 2026-07-15</small>
