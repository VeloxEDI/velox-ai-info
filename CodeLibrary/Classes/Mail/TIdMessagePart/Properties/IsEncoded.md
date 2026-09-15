---
title: IsEncoded
description: Exposes a read-only part flag that is initialized false and never assigned true anywhere in the current product source.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message-part, encoded, implementation-quirk]
---

```Delphi
property IsEncoded: Boolean read;
```

### Example

```Delphi
procedure ReadFlag(const Part: TIdMessagePart; var Value: Variant);
begin
  Value := Part.IsEncoded;
end;
```

### Usage

`IsEncoded` is a read-only part flag that always returns `False` in the current Velox version. Do not use it to decide whether message content is encoded; inspect the part's content-transfer encoding and actual content instead.

### Additional Technical Info
`IsEncoded` returns the protected `FIsEncoded` field. The base constructor sets it false.

A complete search of the current Velox and bundled Indy source finds no later assignment to this message-part field, including descendant/coder code. It therefore remains false for current native parts. This differs from similarly named message-level state and from historical design comments.

Do not use this property to decide whether Body/attachment bytes are decoded, whether ContentTransfer is accurate or whether encoding is required. Inspect the actual content/header pipeline and use the relevant encoder contract.

Native `Assign` does not copy the field. Reading is constant-time and side-effect free, but the borrowed part must remain alive.

The source-reviewed example exposes the value only and was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessagePart`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - declaration and sole initialization in the traced source.

<small>Created 2026-07-15</small>
