---
title: ConvertPreamble
description: Controls whether qualifying multipart output appends a quoted-printable text part copied from Body instead of emitting Body as the MIME preamble.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, mime, preamble, text-part, mutation]
---

```Delphi
property ConvertPreamble: Boolean read write;
```

### Example

```Delphi
procedure PreserveLiteralPreamble;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  // Keep Body as the MIME preamble; create explicit TIdText parts for content.
  Msg.ConvertPreamble := False;
end;
```

### Usage

`ConvertPreamble` controls whether qualifying multipart output appends a quoted-printable text part copied from Body instead of emitting Body as the MIME preamble.

### Additional Technical Info
`ConvertPreamble` changes how normal MIME body generation handles a nonempty [`Body`](Body.md). Its default is `True`, and [`ClearHeader`](../Methods/ClearHeader.md)—therefore `Clear` and load—resets it to `True`.

Conversion occurs only when all of these conditions are true during full body output:

- message [`Encoding`](Encoding.md) is `meMIME`;
- the generated layout is not single-part MIME;
- Body contains more than spaces, tabs and CR/LF characters;
- [`MessageParts`](MessageParts.md) contains at least one item; and
- its most recently counted `TextPartCount` is zero.

Indy then appends a `TIdText` item containing Body, copies the message [`CharSet`](CharSet.md), sets `ContentType` to `text/plain` and `ContentTransfer` to `quoted-printable`, emits a standard MIME preamble, and writes the new last item first.

#### Important persistent-mutation quirk

Despite its conversion-helper role, the appended `TIdText` is **not removed after output**. It remains owned by MessageParts. The current send uses it once, but a later send/save first recounts the now-present text part and no longer takes the conversion branch. The later output can therefore emit the original Body as preamble and also emit the retained part containing the same text. Repeated serialization is not necessarily idempotent.

To avoid hidden collection mutation, prefer explicit `TIdText` construction and keep Body empty or intentionally use it as a preamble. If using automatic conversion, inspect or clear the resulting parts before serializing the same object again. [`ClearBody`](../Methods/ClearBody.md) removes both Body and the appended part.

When the property is `False`, qualifying Body content is encoded/written as literal preamble; it is not promoted into a MIME entity and has no part headers. With no parts, Body is written directly regardless of this property. [`NoEncode`](NoEncode.md) bypasses this logic entirely.

The example only changes an in-memory field and was source-reviewed, not executed or sent.

**External references**

- [Indy upstream: `TIdMessageClient.SendBody`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageClient.pas) - exact conversion conditions, appended part and output order.
- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - default/reset behavior.
- [RFC 2046, multipart syntax](https://www.rfc-editor.org/rfc/rfc2046#section-5.1.1) - preamble versus body-part semantics.

<small>Created 2026-07-15</small>
