---
title: DestroyComponents
description: Destroys all components currently owned by a TComponent, processing the live owner list from the end.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcomponent, destroycomponents]
---

```Delphi
procedure DestroyComponents;
```

### Example

```Delphi
procedure RemoveOwnedComponents(const Container: TComponent);
begin
  Container.DestroyComponents;
end;
```

### Usage

`DestroyComponents` destroys all components currently owned by a TComponent, processing the live owner list from the end.

**Parameters and result**

No parameters or return value. On normal completion `ComponentCount` is zero.

**Behaviour**

- Ordinary processing is last-owned to first-owned.
- Every removed child is destroyed; aliases to children become invalid.
- Child destructors and component notifications run synchronously and can affect other objects.
- Calling again after normal completion is a no-op because no owned list remains.

**Errors and edge cases**

A nil receiver fails. A child destructor or notification exception propagates; already destroyed children stay destroyed and remaining children can remain owned, so failure is partial rather than transactional.

### Additional Technical Info
`DestroyComponents` is a script-visible method declared on hidden ancestor `TComponent`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`DestroyComponents` frees every component owned by the receiver. It is a destructive lifetime operation, not a way to clear a visual container or detach children for reuse.

**Implementation trace**

Studio 37.0 frees the owner's sorted-name cache, then repeatedly selects the last owned component, removes it through the appropriate notification path and calls `Free` until the component list itself becomes nil.

**Side effects and ownership**

Potentially large destructive mutation with arbitrary descendant destructors/notifications. It does not destroy the receiver itself.

**Performance and concurrency**

At least O(n), plus removal, notifications and child destruction. Do not iterate the same owner list concurrently or retain unprotected child references.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`ComponentCount`](../Properties/ComponentCount.md) reports remaining owned children.
- [`Components`](../Properties/Components.md) returns the live references this method invalidates.
- [`Owner`](../Properties/Owner.md) explains lifetime ownership.

**External references**

- [Embarcadero DocWiki: `System.Classes.TComponent.DestroyComponents`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TComponent.DestroyComponents)
- [Free Pascal: `TComponent.DestroyComponents`](https://www.freepascal.org/docs-html/rtl/classes/tcomponent.destroycomponents.html)

<small>Created 2026-07-15</small>
