---
title: IsEncoded
description: Exposes a retained legacy Boolean field that current Velox/Indy message parsing, generation and transport code does not consume.
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message, legacy, encoded, no-effect]
---

```Delphi
property IsEncoded: Boolean read write;
```

### Example

```Delphi
procedure ReportLegacyEncodedFlag(var Value: Variant);
var
  Msg: TIdMessage;
begin
  Msg := Email;
  if Msg = nil then Exit;

  Value := Msg.IsEncoded;
end;
```

### Usage

`IsEncoded` exposes a retained legacy Boolean field that current Velox message parsing, generation and transport code does not consume.

### Additional Technical Info
`IsEncoded` is a legacy read/write field retained in `TIdMessage` and exposed to PascalScript. In the current Velox product source and bundled Indy protocol code, no executable message path reads it to choose behavior, sets it after parsing/encoding, or clears it.

The field begins `False` through normal object zero-initialization. [`Clear`](../Methods/Clear.md), [`ClearHeader`](../Methods/ClearHeader.md), load, header processing, generation and save/send do not reset or consult it. If a script writes `True`, the value persists on that message until another script changes it or the object is destroyed, but Body, headers, parts and wire output are unaffected.

Old source comments describe an intended raw-message distinction involving this flag, but that design is not implemented by the current code. Do not infer that `True` means the current Body is encoded, raw, decoded or safe to retransmit.

Use [`NoDecode`](NoDecode.md) to bypass receive-time MIME/transfer decoding and [`NoEncode`](NoEncode.md) to bypass normal generated output. Inspect [`ContentTransferEncoding`](ContentTransferEncoding.md), Encoding and parts for actual message state, while respecting their documented normalization and parsing behavior.

This property is also unrelated to the separate read-only `IsEncoded` field on individual message parts. Treat the message-level flag as compatibility state, not a processing control. The example reads it for diagnostics and was not runtime-tested.

**External references**

- [Velox-modified Indy: `IdMessage.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessage.pas) - upstream declaration and historical comments; the no-consumer finding is confirmed against Velox's complete current source tree.
- [Indy upstream: `IdMessageClient.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageClient.pas) - implemented parse/send switches (`NoDecode` and `NoEncode`).

<small>Created 2026-07-15</small>
