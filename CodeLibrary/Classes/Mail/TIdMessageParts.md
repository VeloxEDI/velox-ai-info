---
title: TIdMessageParts
description: Owns concrete text and attachment parts while exposing a disabled base Add method, cached counts and a registry-backed attachment encoder selection.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, mail, mime, message-parts, collection]
---

```Delphi
TIdMessageParts = class(TOwnedCollection)
```

### Example

```Delphi
procedure RefreshPartCounts(const Parts: TIdMessageParts);
begin
  Parts.CountParts;
end;
```

### Usage

`TIdMessageParts` owns text and attachment parts while exposing a disabled base Add method, cached counts and a registry-backed attachment encoder selection.

### Additional Technical Info
`TIdMessageParts` is the homogeneous collection owned by `TIdMessage`. It owns concrete [`TIdText`](TIdText.md) and [`TIdAttachment`](TIdAttachment.md) descendants and exposes [`Add`](TIdMessageParts/Methods/Add.md), [`CountParts`](TIdMessageParts/Methods/CountParts.md), cached [`AttachmentCount`](TIdMessageParts/Properties/AttachmentCount.md)/[`TextPartCount`](TIdMessageParts/Properties/TextPartCount.md), [`AttachmentEncoding`](TIdMessageParts/Properties/AttachmentEncoding.md), and indexed [`Items`](TIdMessageParts/Properties/Items.md).

The list and returned parts are normally message-owned/borrowed. Clearing or destroying it frees every part, including received attachment temporary-file cleanup. Do not free list-owned items independently.

The public `Add` is intentionally disabled because exact `TIdMessagePart` construction is prohibited: it always returns nil and does not change Count. Concrete native constructors insert themselves into the collection. Use the surrounding mail API to create the required descendant.

Counts are cached, not maintained. `CountParts` must be called after additions, removals or relevant metadata changes before reading the two count properties. `ContentID` also contributes to a hidden related-part counter.

`Items[index] := source` calls `Assign` on the existing destination object. It does not replace/reparent the object; destination runtime type controls copied content and can reject an incompatible source.

AttachmentEncoding defaults to `MIME` through a global encoder lookup. Unknown/unregistered names raise before stored state changes. Collection mutations and assignments are non-transactional and not thread-safe; counts can be stale/partial after failures.

The source-reviewed example explicitly refreshes cached counts and was not runtime-tested.

**External references**

- [Indy upstream: `IdMessageParts.pas`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - complete collection implementation.
- [Embarcadero DocWiki: `System.Classes.TOwnedCollection`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TOwnedCollection) - Delphi ownership context.
- [Free Pascal: `TOwnedCollection`](https://www.freepascal.org/docs-html/rtl/classes/townedcollection.html) - compatibility context; Velox uses current Delphi/Indy.

<small>Created 2026-07-15</small>
