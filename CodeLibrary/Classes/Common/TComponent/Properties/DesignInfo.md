---
title: DesignInfo
description: Reads or writes Delphi's native LongInt component-designer metadata field.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcomponent, designinfo]
---

```Delphi
property DesignInfo: LongInt read write;
```

### Example

```Delphi
procedure PreserveDesignInfo(const Item: TComponent;
  var Saved: LongInt);
begin
  Saved := Item.DesignInfo;
end;
```

### Usage

`DesignInfo` reads or writes Velox LongInt component-designer metadata field.

**Parameters and result**

Read/write signed `LongInt`. The runtime does not validate a script-assigned value as coordinates or any other schema.

**Behaviour**

- Meaning belongs to Velox component/designer code and can vary by context.
- Changing it does not move a normal runtime object unless code interprets it.
- Using it as durable application data can collide with Velox streaming/designer use.
- The field is distinct from `Tag` and from Velox module FIDs/statuses.

**Errors and edge cases**

A nil receiver fails. Ordinary integer assignment has no semantic validation; normal Velox scripting range/conversion rules apply.

### Additional Technical Info
`DesignInfo` is a script-visible property declared on hidden ancestor `TComponent`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`DesignInfo` is a low-level 32-bit field reserved for component designer information. It is not a general Velox configuration slot and has no universal business meaning.

**Implementation trace**

PascalScript directly reads/writes Delphi `TComponent.DesignInfo`. Studio 37.0's component streaming code treats the low and high 16-bit halves as design-time Left and Top values when defining those properties.

**Side effects and ownership**

A write mutates the live component and can affect later native streaming/designer interpretation.

**Performance and concurrency**

O(1), unsynchronised mutable state.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`Tag`](Tag.md) is a separate native-width general-purpose field.
- [`ComponentState`](ComponentState.md) exposes read-only lifecycle flags.

**External references**

- [Embarcadero DocWiki: `System.Classes.TComponent.DesignInfo`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TComponent.DesignInfo)
- [Free Pascal: `TComponent.DesignInfo`](https://www.freepascal.org/docs-html/rtl/classes/tcomponent.designinfo.html)

<small>Created 2026-07-15</small>
