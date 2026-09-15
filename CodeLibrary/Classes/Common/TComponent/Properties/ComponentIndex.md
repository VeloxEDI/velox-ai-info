---
title: ComponentIndex
description: Reads or reorders a component's zero-based position within its owner's immediate component list.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcomponent, componentindex]
---

```Delphi
property ComponentIndex: Integer read write;
```

### Example

```Delphi
procedure MoveOwnedComponentFirst(const Item: TComponent);
begin
  if Item.Owner <> nil then
    Item.ComponentIndex := 0;
end;
```

### Usage

`ComponentIndex` reads or reorders a component's zero-based position within its owner's immediate component list.

**Parameters and result**

Read/write `Integer`. The getter can return -1; setter requests are clamped rather than rejected when the component is currently owned.

**Behaviour**

- Reordering shifts other components' indexes.
- Writing any value on an unowned component has no effect.
- The property is positional and unstable across other owner-list mutations.
- Order can affect Velox streaming/enumeration even though it is not a Velox business priority field.

**Errors and edge cases**

A nil receiver fails. For a normally owned component out-of-range writes are clamped; item/owner corruption or concurrent mutation can still surface list errors.

### Additional Technical Info
`ComponentIndex` is a script-visible property declared on hidden ancestor `TComponent`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`ComponentIndex` is the receiver's position in its owner's component list. Writing it changes enumeration/streaming order; it does not change the owner.

**Implementation trace**

Studio 37.0 returns the owner's list index or -1 without an owner/list. The setter does nothing without an owner, clamps negative values to 0 and values at/above count to `count - 1`, then deletes/inserts the reference when the target differs.

**Side effects and ownership**

A successful write mutates the owner's live list but does not free, adopt or rename a component.

**Performance and concurrency**

Getter is O(n) because it searches for the receiver; moving can be O(n). No concurrency guarantee.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`Owner`](Owner.md) must be non-nil for a meaningful index.
- [`Components`](Components.md) reads the owner list by position.
- [`ComponentCount`](ComponentCount.md) defines its current size.

**External references**

- [Embarcadero DocWiki: `System.Classes.TComponent.ComponentIndex`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TComponent.ComponentIndex)
- [Free Pascal: `TComponent.ComponentIndex`](https://www.freepascal.org/docs-html/rtl/classes/tcomponent.componentindex.html)

<small>Created 2026-07-15</small>
