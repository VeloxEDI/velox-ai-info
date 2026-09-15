---
title: ContentType
description: Stores the message media type while extracting charset, applying asymmetric empty defaults and controlling whether MIME type inference can run.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, content-type, mime, charset, inference]
---

```Delphi
property ContentType: string read write;
```

### Example

```Delphi
procedure ConfigureHtmlBody;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.ContentType := 'text/html; charset=utf-8';
  // ContentType now reads text/html; CharSet reads utf-8.
end;
```

### Usage

`ContentType` stores the message media type while extracting charset, applying asymmetric empty defaults and controlling whether MIME type inference can run.

### Additional Technical Info
`ContentType` stores the message-level media type used for parsing and normal generated headers. Its setter does more than a raw field assignment: it removes an embedded `charset` parameter and updates [`CharSet`](CharSet.md) under specific rules.

For nonempty input, the base value and other parameters remain in ContentType. A nonempty embedded charset replaces CharSet. With no embedded charset, text media defaults CharSet to `us-ascii` only when its current value is empty; otherwise the previous charset survives, even when changing to a non-text media type.

Assigning an empty String is asymmetric: the setter stores `text/plain` and sets CharSet to `us-ascii`. By contrast, [`ClearHeader`](../Methods/ClearHeader.md) writes the backing fields directly and leaves both empty. Reading empty is therefore possible after Clear, but `ContentType := ''` cannot reproduce that state.

#### Automatic MIME inference

[`GenerateHeader`](../Methods/GenerateHeader.md) infers a type only when Encoding is MIME and ContentType is truly empty. After recounting parts it chooses `multipart/mixed`, `multipart/alternative` or `text/plain` from text/attachment counts. Leave a new/cleared message value untouched to request this behavior; assigning empty disables inference by storing `text/plain`.

When generating a multipart message, a fresh boundary parameter is written into the header. The setter itself strips only charset, not a supplied boundary or arbitrary parameters. [`ProcessHeaders`](../Methods/ProcessHeaders.md) is different: it extracts charset, later removes boundary into [`MIMEBoundary`](MIMEBoundary.md), and defaults a missing type to `text/plain; charset=us-ascii` in typed state. It does not validate and replace a nonempty but syntactically invalid type.

Calculated single-part MIME clears the message-level generated content headers and lets its one part supply them. [`NoEncode`](NoEncode.md) ignores typed ContentType and writes raw Headers. No syntax or security validation is performed at assignment, so keep untrusted parameters out of raw header construction.

The example is source-reviewed only; no message was generated.

**External references**

- [Indy upstream: `TIdMessage.SetContentType`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - charset extraction and empty/default behavior.
- [Indy upstream: message generation](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - media-type inference and boundary projection.
- [RFC 2045 section 5](https://www.rfc-editor.org/rfc/rfc2045#section-5) - Content-Type field syntax and defaults.
- [RFC 2046](https://www.rfc-editor.org/rfc/rfc2046) - media types and multipart rules.

<small>Created 2026-07-15</small>
