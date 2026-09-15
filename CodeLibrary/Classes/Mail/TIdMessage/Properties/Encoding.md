---
title: Encoding
description: Selects the message layout as automatic, MIME or legacy plain-text-with-attachments and also overwrites the attachment encoder preference.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, encoding, layout, mime, uue]
---

```Delphi
property Encoding: TIdMessageEncoding read write;
```

### Example

```Delphi
procedure SelectMimeLayout;
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.Encoding := meMIME;
end;
```

### Usage

`Encoding` selects the message layout as automatic, MIME or legacy plain-text-with-attachments and also overwrites the attachment encoder preference.

### Additional Technical Info
`Encoding` selects message **layout**, not character encoding and not `Content-Transfer-Encoding`. Its [`TIdMessageEncoding`](../../../../Types/Enumerations/TIdMessageEncoding.md) values are:

- `meDefault` - defer the layout decision until header generation;
- `meMIME` - generate MIME headers, boundaries and parts; and
- `mePlainText` - write Body followed by optional legacy UUE/XXE-style attachments/text blocks.

Assignment first stores the enum and then overwrites [`AttachmentEncoding`](AttachmentEncoding.md): `meMIME` selects `MIME`; both other values select `UUE`. Set any intentional attachment override after setting Encoding. Encoder registry lookup can raise; because the enum field is stored first, a missing registry entry can leave Encoding changed even though assignment failed.

[`GenerateHeader`](../Methods/GenerateHeader.md) permanently resolves `meDefault`: zero MessageParts becomes `mePlainText`; any part—including a text part—becomes `meMIME`. The setter side effect runs again during that resolution. Generation also normalizes part transfer values, content type and boundaries; reading Encoding afterwards returns the resolved value rather than `meDefault`.

[`ProcessHeaders`](../Methods/ProcessHeaders.md) chooses only from raw `MIME-Version`: absent means `mePlainText`, present means `meMIME`. It does not infer MIME from a boundary, Content-Type or transfer encoding, and the setter again changes AttachmentEncoding. Changing Encoding after a load does not reparse Body/parts.

With [`NoEncode`](NoEncode.md), normal layout processing is bypassed and this property has no output effect. Use MIME for ordinary structured messages; legacy plain-text attachment layout is compatibility behavior rather than a modern interoperability default.

The example changes state only and was source-reviewed, not executed or sent.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - enum, setter side effects, default resolution and parsing heuristic.
- [Indy upstream: `TIdMessageClient.SendBody`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageClient.pas) - MIME versus plain-text layout branches.
- [RFC 2045 section 4](https://www.rfc-editor.org/rfc/rfc2045#section-4) - MIME-Version and MIME message structure.

<small>Created 2026-07-15</small>
