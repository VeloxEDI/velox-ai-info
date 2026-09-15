---
title: ProcessHeaders
description: Projects the current raw Headers into typed message state using Indy decoding, defaults, priority precedence and MIME-layout selection.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, headers, process-headers, mime, parsing]
---

```Delphi
procedure ProcessHeaders;
```

### Example

```Delphi
procedure ParseReplacementHeaders(const Message: TIdMessage;
  var Value: Variant);
begin
  Message.ClearHeader;
  Message.AddHeader('Subject: Example message');
  Message.AddHeader('Content-Type: text/plain; charset=utf-8');
  Message.ProcessHeaders;
  Value := Message.Subject;
end;
```

### Usage

`ProcessHeaders` projects the current raw Headers into typed message state using Velox decoding, defaults, priority precedence and MIME-layout selection.

### Additional Technical Info
`ProcessHeaders` reads the current raw registered-but-ungenerated `Headers` list and replaces/normalizes the corresponding typed message properties. It does not parse body bytes and does not remove the raw lines.

Content-Type receives special handling. A missing/empty header becomes `text/plain` with `us-ascii`. A present value has its `charset` parameter removed into CharSet; a text media type without a charset also defaults to `us-ascii`. Later, the method removes the `boundary` parameter from the stored ContentType and pushes its value into MIMEBoundary with parent `-1`.

It copies Content-Transfer-Encoding and Content-Disposition, MIME-decodes Subject and address display names, and replaces FromList, To/Recipients, Cc, Bcc and ReplyTo through Indy's permissive address parser. Message-ID and In-Reply-To pass through their bracket-normalizing setters. Newsgroups are parsed as comma-separated text. Organization, Sender and receipt-recipient text are assigned without the same encoded-word decoding used for Subject/address names.

Receipt address precedence is `Disposition-Notification-To`, then `Return-Receipt-To` only when the first parses to empty text. Date is converted from the header's GMT/RFC form to local `TDateTime`. Invalid values can raise or normalize according to the underlying Indy routines.

Priority precedence is exact: `X-Priority`, `Priority`, `Importance`, then `X-MSMail-Priority`. Text containing `non-urgent` or `low` becomes `mpLowest`; otherwise text containing `urgent` or `high` becomes `mpHighest`; otherwise the first token is parsed as 1..5 with invalid/out-of-range input defaulting to 3 (`mpNormal`). Intermediate `mpHigh`/`mpLow` values are obtained only from numeric 2/4.

Encoding is selected solely from MIME-Version: absent means `mePlainText`, present means `meMIME`. The Encoding setter consequently selects `UUE` or `MIME` AttachmentEncoding. A boundary without MIME-Version still yields plain-text layout; MIME-Version without a boundary yields MIME layout, matching the source TODO rather than a stricter MIME inference.

Important quirk: the method does not clear MIMEBoundary before pushing. Normal `LoadFromStream` calls `Clear` first, but repeated direct `ProcessHeaders` calls can accumulate boundary entries; a later header with no boundary leaves an existing stack untouched. ClearHeader/MIMEBoundary.Clear before reparsing a replacement header set.

The projection is sequential and non-transactional. A malformed later field can leave earlier properties/lists already replaced. Complexity is linear in header/address content plus decoder work, and the message is not thread-safe. The source-reviewed example establishes a clean header state first and was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessage.ProcessHeaders`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - projection/default/priority pipeline baseline.
- [RFC 2045 section 5.2](https://www.rfc-editor.org/rfc/rfc2045.html#section-5.2) - absent Content-Type default.
- [RFC 2047](https://www.rfc-editor.org/rfc/rfc2047.html) - encoded header words decoded for selected fields.
- [RFC 5322 section 3.6](https://www.rfc-editor.org/rfc/rfc5322.html#section-3.6) - structured message fields.

<small>Created 2026-07-15</small>
