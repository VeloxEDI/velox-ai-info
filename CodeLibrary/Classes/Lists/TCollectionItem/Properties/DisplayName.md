---
title: DisplayName
description: Gets the item's virtual display label and, on the base class, treats assignment as notification without storing text.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, collection-item, display-name, virtual, notification]
---

```Delphi
property DisplayName: string read write;
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Item: TCollectionItem;
begin
  Item := TCollectionItem.Create(nil);
  try
    Item.DisplayName := 'Ignored by the base class';
    Value := Item.DisplayName;  // TCollectionItem
  finally
    Item.Free;
  end;
end;
```

### Usage

`DisplayName` gets the item's display label. For a plain `TCollectionItem`, assigning text only signals a change and does not retain that text; specialised item types can provide their own storage rules.

### Additional Technical Info
`DisplayName` is a virtual human-facing label used by Delphi collection tooling and concrete collection-item descendants. The current Delphi base getter returns the object's runtime `ClassName`, whether attached or detached. For an actual subclass it therefore returns that subclass name unless the subclass overrides the getter.

The base setter deliberately discards its input. It calls the item's change path with `AllItems=False`, which asks an attached collection to update this specific item when the collection is not inside an update batch. On a detached item there is no notification and no state change. Reading immediately after a base assignment still returns the runtime class name, as the example shows.

Concrete descendants can override both methods to store, validate or calculate a useful label. The PascalScript bridge calls the Delphi property virtually, so the actual runtime class controls behavior even when the script variable is typed `TCollectionItem`. Consult the concrete class page before assuming that assignment is ignored.

Do not use the property as a stable key. Labels can be derived, localized, duplicated or changed, and the base value contains only a class name. Use [`ID`](ID.md) for collection-scoped identity and [`Index`](Index.md) only for current order.

The read is normally constant-time. The setter can synchronously invoke collection-specific update code and propagate its exceptions after no base text has been stored. Neither the item nor collection notifications are thread-safe.

Free Pascal's base documentation describes a different calculated label based on the managing collection and index. Velox uses current Delphi, whose source returns only `ClassName`; the Free Pascal page is compatibility context, not the Velox result.

The source-reviewed example demonstrates exact base behavior and caller-owned cleanup. It was not executed by the documentation workflow.

**External references**

- [Embarcadero DocWiki: `System.Classes.TCollectionItem.DisplayName`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollectionItem.DisplayName) - documents the Delphi descendant-class-name default.
- [Free Pascal: `TCollectionItem.DisplayName`](https://www.freepascal.org/docs-html/rtl/classes/tcollectionitem.displayname.html) - useful compatibility reference with a different base label calculation.

<small>Created 2026-07-15</small>
