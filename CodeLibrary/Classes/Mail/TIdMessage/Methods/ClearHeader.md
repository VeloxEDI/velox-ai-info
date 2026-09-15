---
title: ClearHeader
description: Clears address/header/output state and restores selected defaults while deliberately retaining body content and several configuration or state fields.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, clear-header, reset-defaults]
---

```Delphi
procedure ClearHeader;
```

### Example

```Delphi
procedure ReplaceHeadersOnly(const Message: TIdMessage);
begin
  Message.ClearHeader;
  Message.Subject := 'Replacement message';
end;
```

### Usage

`ClearHeader` clears address/header/output state and restores selected defaults while deliberately retaining body content and several configuration or state fields.

### Additional Technical Info
`ClearHeader` resets the header-facing model but leaves Body and MessageParts intact. It performs the following native operations in order:

- clears CcList, BccList, FromList, NewsGroups, ReplyTo and Recipients;
- sets Date to zero (`UseNowForDate=True`), Organization/References/Subject to empty, Priority to `mpNormal`, and clears receipt-recipient/sender text;
- assigns empty strings directly to the ContentType/CharSet fields and clears ContentTransferEncoding/ContentDisposition;
- clears raw Headers, registered-but-ungenerated ExtraHeaders, MIMEBoundary, Flags, MsgId, UID and registered-but-ungenerated LastGeneratedHeaders;
- assigns `meDefault` directly to the Encoding field, sets ConvertPreamble true, and resets internal saving/single-part-MIME flags.

Direct field assignments matter. Emptying ContentType here does not call its setter, so it remains truly empty instead of becoming `text/plain; charset=us-ascii`. Resetting Encoding does not call its setter, so the existing AttachmentEncoding selection is retained.

Several fields are deliberately or accidentally not reset: `InReplyTo`, `IsEncoded`, `NoEncode`, `NoDecode`, `AttachmentEncoding`, `AttachmentTempDirectory` and native events/configuration. A reused message can therefore retain reply threading, raw/encoded-state flags or operational settings. Explicitly reset them when starting a logically unrelated message.

Clearing the MIME boundary does not alter existing parts. Conversely, keeping Body/parts while clearing ContentType/Encoding means [`GenerateHeader`](GenerateHeader.md) will infer new layout state on the next output pass.

The many sequential mutations are non-transactional and not thread-safe. The source-reviewed example intentionally preserves the existing body/parts and was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessage.ClearHeader`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - reset sequence baseline.
- [RFC 5322 section 3.6](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6) - structured message fields affected by the reset.

<small>Created 2026-07-15</small>
