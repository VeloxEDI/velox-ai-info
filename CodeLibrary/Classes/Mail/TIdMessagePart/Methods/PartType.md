---
title: PartType
description: Returns the runtime part family's two-value classification used by message-part counting rather than deriving a MIME media type.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message-part, classification, enumeration]
---

```Delphi
function PartType: TIdMessagePartType;
```

### Example

```Delphi
procedure ClassifyPart(const Part: TIdMessagePart; var Value: Variant);
begin
  if Part.PartType = mptText then
    Value := 'text'
  else
    Value := 'attachment';
end;
```

### Usage

`PartType` returns the runtime part family's two-value classification used by message-part counting rather than deriving a MIME media type.

### Additional Technical Info
`PartType` is a virtual class function exposed to PascalScript as a callable method. Dispatch uses the runtime class.

| Result | Current runtime classes |
|---|---|
| `mptText` | [`TIdText`](../../TIdText.md) |
| `mptAttachment` | [`TIdAttachment`](../../TIdAttachment.md), `TIdAttachmentFile`, and the uninstantiable base implementation |

The result is structural, not inferred from [`ContentType`](../Properties/ContentType.md). A text part still returns `mptText` if its content type says `application/octet-stream`, and an attachment still returns `mptAttachment` if its header says `text/plain`.

`TIdMessageParts.CountParts` uses this exact two-value result to populate its cached text/attachment counts. Changing MIME metadata does not change the classification; only the concrete runtime class does.

The base class implementation returns `mptAttachment`, but exact `TIdMessagePart` construction raises, so scripts normally observe only concrete descendants. The method performs no mutation, allocation or I/O and is constant-time. The borrowed part must remain alive; concurrent collection destruction is unsafe.

The source-reviewed example handles the complete current enumeration and was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessagePart.PartType`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - base classification and counting consumer.
- [Indy upstream: `TIdText.PartType`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdText.pas) - text override.

<small>Created 2026-07-15</small>
