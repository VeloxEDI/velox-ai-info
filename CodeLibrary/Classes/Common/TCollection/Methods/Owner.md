---
title: Owner
description: Returns the TPersistent owner reported by a TCollection descendant without transferring ownership.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcollection, owner]
---

```Delphi
function Owner: TPersistent;
```

### Example

```Delphi
function CollectionHasOwner(const Items: TCollection): Boolean;
begin
  Result := Items.Owner <> nil;
end;
```

### Usage

Returns the TPersistent owner reported by a collection without transferring ownership.

**Parameters and result**

It has no parameters. The result is a live `TPersistent` reference or nil and remains owned by the surrounding object graph.

**Behaviour**

- Nil is a valid result for an unowned/base collection.
- Owner is not necessarily a `TComponent` and is not necessarily a Velox module.
- The returned reference can become invalid when the Velox owner is destroyed.
- Reading it does not add a reference count or extend lifetime.

**Errors and edge cases**

Calling on nil raises an object-reference failure. The method itself has no not-found exception; callers must test a nil result before dereferencing.

### Additional Technical Info
`Owner` is a script-visible method declared on hidden ancestor `TCollection`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`Owner` exposes the persistent object returned by the collection's virtual owner hook. Base `TCollection` normally reports nil; owned/embedded descendants can return the object that contains the collection.

**Implementation trace**

PascalScript binds to Delphi `TCollection.Owner`. Studio 37.0 simply returns `GetOwner`, allowing descendant classes such as owned collections to override that protected virtual source.

**Side effects and ownership**

Read-only and no ownership transfer. Never free the result merely because this method returned it.

**Performance and concurrency**

O(1) plus any descendant `GetOwner` implementation. No thread-safety or lifetime guarantee is added.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`TPersistent.Assign`](../../TPersistent/Methods/Assign.md) documents the base persistent copy protocol.
- [`TComponent.Owner`](../../TComponent/Properties/Owner.md) is the component-specific lifetime owner property.

**External references**

- [Embarcadero DocWiki: `System.Classes.TCollection.Owner`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollection.Owner)
- [Free Pascal: `TCollection.Owner`](https://www.freepascal.org/docs-html/rtl/classes/tcollection.owner.html)

<small>Created 2026-07-15</small>
