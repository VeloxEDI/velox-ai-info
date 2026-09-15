---
title: ComponentCount
description: Reports the number of components immediately owned by a TComponent.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcomponent, componentcount]
---

```Delphi
property ComponentCount: Integer read;
```

### Example

```Delphi
function HasOwnedComponents(const Container: TComponent): Boolean;
begin
  Result := Container.ComponentCount > 0;
end;
```

### Usage

`ComponentCount` reports the number of components immediately owned by a TComponent.

**Parameters and result**

Read-only `Integer`. Valid `Components` indexes are 0 through `ComponentCount - 1`.

**Behaviour**

- Ownership changes update the value immediately.
- The value can change during notifications or child destruction.
- Zero is normal and does not imply the component itself has no owner.
- A saved count is not a lifetime guarantee for later indexed access.

**Errors and edge cases**

A nil receiver fails. The property itself has no not-found error.

### Additional Technical Info
`ComponentCount` is a script-visible property declared on hidden ancestor `TComponent`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`ComponentCount` is the size of the receiver's immediate ownership list. It does not count grandchildren, visual children that have another owner, or arbitrary Velox configuration objects.

**Implementation trace**

The PascalScript helper reads Delphi `TComponent.ComponentCount`. Studio 37.0 returns the internal list count or 0 when the owner has never allocated a component list.

**Side effects and ownership**

Read-only and no allocation in the terminal getter.

**Performance and concurrency**

O(1). Concurrent ownership mutation makes it unstable and is not synchronised.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`Components`](Components.md) indexes the same immediate owner list.
- [`DestroyComponents`](../Methods/DestroyComponents.md) reduces the count by destroying children.

**External references**

- [Embarcadero DocWiki: `System.Classes.TComponent.ComponentCount`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TComponent.ComponentCount)
- [Free Pascal: `TComponent.ComponentCount`](https://www.freepascal.org/docs-html/rtl/classes/tcomponent.componentcount.html)

<small>Created 2026-07-15</small>
