---
title: Components
description: Returns a live component reference from an owner's zero-based immediate component list.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcomponent, components]
---

```Delphi
property Components[Index: Integer]: TComponent read;
```

### Example

```Delphi
function FirstOwnedComponent(const Container: TComponent): TComponent;
begin
  Result := nil;
  if Container.ComponentCount > 0 then
    Result := Container.Components[0];
end;
```

### Usage

`Components` returns a live component reference from an owner's zero-based immediate component list.

**Parameters and result**

`Index` is zero-based from 0 through `ComponentCount - 1`. The result is a live `TComponent` reference.

**Behaviour**

- The list is ownership, not necessarily visual parent/child structure.
- Index order can change through `ComponentIndex` or other Velox ownership operations.
- Destroying/removing a child invalidates returned aliases.
- Check a fresh `ComponentCount` immediately before ordinary indexed iteration.

**Errors and edge cases**

Nil receiver, absent list or invalid index raises; this property does not return nil for an out-of-range request.

### Additional Technical Info
`Components` is a script-visible property declared on hidden ancestor `TComponent`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`Components` provides positional access to immediately owned components. The returned child remains owner-managed; reading it does not copy or retain the object.

**Implementation trace**

The PascalScript indexed-property helper calls Delphi's `Components[Index]` getter. Studio 37.0 raises a list-index error when no list exists or the index is outside the current bounds, otherwise it returns the stored pointer.

**Side effects and ownership**

Read-only and no ownership transfer. Mutating or freeing the returned component affects the owner graph and requires the concrete API's lifetime rules.

**Performance and concurrency**

O(1) after bounds checking. The live reference is unsafe across concurrent mutation or destruction.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`ComponentCount`](ComponentCount.md) defines the valid range.
- [`ComponentIndex`](ComponentIndex.md) reorders positions.
- [`DestroyComponents`](../Methods/DestroyComponents.md) invalidates every returned child reference.

**External references**

- [Embarcadero DocWiki: `System.Classes.TComponent.Components`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TComponent.Components)
- [Free Pascal: `TComponent.Components`](https://www.freepascal.org/docs-html/rtl/classes/tcomponent.components.html)

<small>Created 2026-07-15</small>
