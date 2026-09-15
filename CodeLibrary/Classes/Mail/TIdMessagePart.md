---
title: TIdMessagePart
description: Defines collection-owned MIME part metadata through a mixture of internal header values and independent fields used by text and attachment descendants.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, mail, mime, message-part, headers]
---

```Delphi
TIdMessagePart = class(TCollectionItem)
```

### Example

```Delphi
procedure DescribePart(const Part: TIdMessagePart; var Value: Variant);
begin
  Value := Part.ContentType + ' / ' + Part.ContentTransfer;
end;
```

### Usage

`TIdMessagePart` provides MIME part metadata shared by text and attachment items, including headers, content type, transfer encoding, filename and related identifiers.

#### Ownership and lifetime

Normal parts belong to `TIdMessage.MessageParts`; clearing the collection or message makes its parts unavailable. Do not free a returned part. `Headers` is a read-only list reference, while assigning `ExtraHeaders` copies lines into the existing list rather than replacing that list.

Both list references are live and must not be freed. Avoid `Part.ExtraHeaders := Part.ExtraHeaders`: its setter calls the owned header list's `TStrings.Assign`, whose current Velox self-assignment clears before enumerating the same object, leaving the list empty.

The `TCollectionItem` ID/index/collection rules apply. A detached item has no owner message, so MIME default resolution and owner callbacks can differ.

### Additional Technical Info
`TIdMessagePart` is the common base for [`TIdText`](TIdText.md) and [`TIdAttachment`](TIdAttachment.md). It supplies MIME header metadata, field-backed filename/charset/name state, [`PartType`](TIdMessagePart/Methods/PartType.md) classification and [`ResolveContentType`](TIdMessagePart/Methods/ResolveContentType.md) defaults.

Do not create the base class directly. Its constructor inserts through `TCollectionItem` and then raises `EIdCanNotCreateMessagePart` when the runtime class is exactly `TIdMessagePart`. Obtain a concrete item from a message or construct it through an appropriate mail helper.

#### Header-backed versus field-backed metadata

These properties are first-value views over the internal header list: [`ContentDescription`](TIdMessagePart/Properties/ContentDescription.md), [`ContentDisposition`](TIdMessagePart/Properties/ContentDisposition.md), [`ContentID`](TIdMessagePart/Properties/ContentID.md), [`ContentLocation`](TIdMessagePart/Properties/ContentLocation.md), [`ContentTransfer`](TIdMessagePart/Properties/ContentTransfer.md) and [`ContentType`](TIdMessagePart/Properties/ContentType.md). Empty assignment removes the first matching header. If duplicates exist, a later duplicate can then become the visible value.

[`CharSet`](TIdMessagePart/Properties/CharSet.md), [`FileName`](TIdMessagePart/Properties/FileName.md) and [`Name`](TIdMessagePart/Properties/Name.md) are independent fields. Setting `ContentType` extracts/removes `charset` and `name` parameters and updates the fields only when extracted values are nonempty. Setting `ContentDisposition` similarly extracts/decodes a nonempty `filename`. Missing parameters do not clear stale fields, and writing a field does not update the corresponding header.

Direct edits through `Headers`, the convenience properties and the standalone fields can therefore diverge. Choose one controlled authoring path and read back the effective state before encoding.

#### Assignment and encoded state

Native `Assign` copies `Headers`, `ExtraHeaders`, `CharSet`, `FileName` and `Name`. It does not copy parent-part linkage, callbacks or [`IsEncoded`](TIdMessagePart/Properties/IsEncoded.md). Header assignment includes the header-backed metadata.

`IsEncoded` initializes false. A complete source search finds no later assignment to the part field in this product version, so it remains false for current native parts and should not be used as an encoding decision.

Metadata setters do not validate MIME tokens, media types, identifiers, URIs, filenames or transfer/body compatibility. Header operations can be non-transactional when callbacks/allocation fail. Parts, headers, fields and their owner collection are mutable and not thread-safe.

The source-reviewed example reads an existing borrowed part and was not executed against mail infrastructure.

**External references**

- [Indy upstream: `IdMessageParts.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - complete base-part implementation.
- [RFC 2045](https://www.rfc-editor.org/rfc/rfc2045.html) - MIME content-header framework represented by these properties.

<small>Created 2026-07-15</small>
