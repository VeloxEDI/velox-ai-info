---
title: Owner
description: Returns the component that owns and normally controls the lifetime of this TComponent.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcomponent, owner]
---

```Delphi
property Owner: TComponent read;
```

### Example

```Delphi
function IsCallerOwned(const Item: TComponent): Boolean;
begin
  Result := Item.Owner = nil;
end;
```

### Usage

`Owner` returns the component that owns and normally controls the lifetime of this TComponent.

**Parameters and result**

Read-only `TComponent` reference or nil. The returned owner remains Velox-provided and is never transferred to the script.

**Behaviour**

- Nil commonly means the caller must arrange cleanup.
- Destroying an owner normally destroys all owned components.
- Manually freeing a child normally removes it from the owner, but scripts must follow the object's documented lifetime contract.
- Never call `Free` on the owner merely because this property exposed it.

**Errors and edge cases**

A nil receiver fails. A nil result is valid and must be checked before dereferencing.

### Additional Technical Info
`Owner` is a script-visible property declared on hidden ancestor `TComponent`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`Owner` identifies the Delphi component responsible for including this component in its ownership list and normally freeing it. Ownership is a lifetime relationship, not necessarily a visual parent or Velox hierarchy.

**Implementation trace**

The PascalScript helper reads Delphi `TComponent.Owner` directly. `Create(AOwner)` establishes it through owner insertion; native remove/insert operations can change it, but no setter is exposed here.

**Side effects and ownership**

Read-only and no reference counting/lifetime extension. The returned pointer can become stale when the owner is destroyed.

**Performance and concurrency**

O(1). Ownership does not provide thread safety.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`Create`](../Methods/Create.md) establishes owner relationships.
- [`DestroyComponents`](../Methods/DestroyComponents.md) enforces owner-managed cleanup.
- [`Components`](Components.md) exposes an owner's child list.

**External references**

- [Embarcadero DocWiki: `System.Classes.TComponent.Owner`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TComponent.Owner)
- [Free Pascal: `TComponent.Owner`](https://www.freepascal.org/docs-html/rtl/classes/tcomponent.owner.html)

<small>Created 2026-07-15</small>
