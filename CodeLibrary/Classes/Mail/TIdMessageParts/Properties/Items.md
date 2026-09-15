---
title: Items
description: Gets a borrowed message part by zero-based index or Assign-copies a source into the existing destination object without replacing ownership.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, mail, message-parts, items, indexed-property, assign]
---

```Delphi
property Items[Index: Integer]: TIdMessagePart read write; default;
```

### Example

```Delphi
procedure ReadFirstPart(const Parts: TIdMessageParts;
  var Value: Variant);
begin
  if Parts.Count > 0 then
    Value := Parts.Items[0].ContentType
  else
    Value := '';
end;
```

### Usage

`Items` gets a borrowed message part by zero-based index or Assign-copies a source into the existing destination object without replacing ownership.

### Additional Technical Info
`Items` is the zero-based default indexed property for the collection. A read returns the existing `TIdMessagePart` descendant at `Index`; `Parts[Index]` and `Parts.Items[Index]` are equivalent in scripts.

The returned object is borrowed and owned by the collection. Do not free it. Removing/clearing the item or destroying the owning message invalidates the reference. An index below zero or greater than or equal to `Count` raises the inherited collection bounds exception.

A write has unusually important semantics: inherited `TCollection.SetItem` calls `Assign` on the existing destination item. It does not replace the object, move the source, change collection ownership or preserve every possible descendant-specific resource. Runtime types control the result:

- `TIdMessagePart.Assign` copies header/metadata state, including header lists, character set, filename and name.
- `TIdText.Assign` additionally copies its body.
- attachment backing storage is not copied by the base implementation; assigning attachment metadata therefore must not be treated as cloning the attached bytes or file.
- nil or incompatible sources can raise, and a multi-field assignment is not transactional.

Assignment can change fields used during encoding and counting without refreshing [`AttachmentCount`](AttachmentCount.md) or [`TextPartCount`](TextPartCount.md). Call [`CountParts`](../Methods/CountParts.md) afterward when cached counts matter.

Reads are normally constant-time. Assignment cost depends on copied headers/body and can be linear in their content. Neither access nor assignment is thread-safe. The source-reviewed example bounds-checks before borrowing the first item and was not runtime-tested.

**External references**

- [Indy upstream: `TIdMessageParts.GetItem`/`SetItem`](https://github.com/IndySockets/Indy/blob/master/Lib/Protocols/IdMessageParts.pas) - typed getter and inherited assignment setter.
- [Embarcadero DocWiki: `System.Classes.TCollection.SetItem`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollection.SetItem) - Delphi destination-`Assign` behavior.
- [Free Pascal: `TCollection`](https://www.freepascal.org/docs-html/rtl/classes/tcollection.html) - compatible collection model; Velox uses Delphi semantics.

<small>Created 2026-07-15</small>
