---
title: IsMsgSinglePartMime
description: Exposes derived single-entity processing state that generation and receive logic overwrite, including encoded plain-text bodies despite the property name.
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, mime, single-part, derived-state, quirk]
---

```Delphi
property IsMsgSinglePartMime: Boolean read write;
```

### Example

```Delphi
procedure InspectGeneratedLayout(var Value: Variant);
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Msg.GenerateHeader;
  Value := Msg.IsMsgSinglePartMime;
end;
```

### Usage

`IsMsgSinglePartMime` exposes derived single-entity processing state that generation and receive logic overwrite, including encoded plain-text bodies despite the property name.

### Additional Technical Info
`IsMsgSinglePartMime` is internal layout/decoder state exposed as a writable Boolean. Treat it as derived and observational rather than configuration.

[`GenerateHeader`](../Methods/GenerateHeader.md) overwrites it with `True` only when [`Encoding`](Encoding.md) is `meMIME`, [`MessageParts`](MessageParts.md) has exactly one item, and [`Body`](Body.md) is empty under Indy's whitespace-only test. Normal send/save calls GenerateHeader immediately before body output, so a script's earlier manual assignment is discarded.

When true during output, Indy does not emit the normal message/body separator and multipart boundary framing. It removes message-level content headers from the generated set and lets the one part append its headers/content directly.

Receive logic overloads the flag more broadly. It sets it true for the decoder branch handling single-part MIME **or** a `mePlainText` body whose message-level transfer encoding is base64/quoted-printable. A decoded text entity can be placed in message Body; an attachment can be created as a part. Thus `True` after loading does not prove `Encoding = meMIME` or `MessageParts.Count = 1`.

[`ClearHeader`](../Methods/ClearHeader.md) resets the flag false. [`NoDecode`](NoDecode.md) avoids the decoder branch, and [`NoEncode`](NoEncode.md) bypasses generation/body layout and does not use it. Direct writes can only influence native paths that consume state without first recalculating it; those paths are not exposed as a safe script contract.

Calling GenerateHeader solely to inspect the value also mutates many other message fields, including Encoding, boundaries, headers and some part/address state. The example is illustrative and source-reviewed; it was not executed.

**External references**

- [Indy upstream: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - generation formula and reset.
- [Indy upstream: `IdMessageClient.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageClient.pas) - send framing and overloaded receive assignment.
- [RFC 2045 section 4](https://www.rfc-editor.org/rfc/rfc2045#section-4) - MIME version/context.
- [RFC 2046 section 5.1](https://www.rfc-editor.org/rfc/rfc2046#section-5.1) - multipart framing contrasted with single entities.

<small>Created 2026-07-15</small>
