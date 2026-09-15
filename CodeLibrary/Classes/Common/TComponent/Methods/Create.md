---
title: Create
description: Constructs a component and optionally registers it with an owner that controls its lifetime.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcomponent, create]
---

```Delphi
constructor Create(AOwner: TComponent); virtual;
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
var
  Item: TComponent;
begin
  Item := TComponent.Create(nil);
  try
    Value := Item.ClassName;
  finally
    Item.Free;
  end;
end;
```

### Usage

`Create` constructs a component and optionally registers it with an owner that controls its lifetime.

**Parameters and result**

`AOwner` is an existing `TComponent` or nil. The result is the newly constructed runtime class, including item initialization when invoked through a item constructor.

**Errors and edge cases**

Owner validation, duplicate naming, allocation or item construction can raise. Velox constructor failure destroys the partially created instance; do not use an unassigned/failed result.

**Side effects and ownership**

Allocates an object and can mutate the owner's component list, run validation and invoke item constructor/notification logic.

### Additional Technical Info
`Create` is a script-visible constructor declared on hidden ancestor `TComponent`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`Create` constructs a Delphi component. A non-nil `AOwner` immediately becomes the component's lifetime owner; nil leaves lifetime management with the caller or another host that later adopts it.

**Implementation trace**

PascalScript registers the virtual Delphi constructor. Studio 37.0 sets the component style to inheritable and, for a non-nil owner, calls `AOwner.InsertComponent(Self)`, which validates containment/name rules and inserts the component into the owner's live list.

**Behaviour**

- An owner automatically destroys owned components during its own destruction.
- Nil ownership means the script must establish another documented owner or call `Free` exactly once.
- Ownership is not the same as visual parenthood, Velox module hierarchy or a database relationship.
- Concrete visible descendants can perform substantial work beyond this base constructor.

**Performance and concurrency**

Base work is O(1) plus owner-list insertion and descendant construction. Construction and owner lists are not generally thread-safe.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`Owner`](../Properties/Owner.md) exposes the resulting lifetime owner.
- [`DestroyComponents`](DestroyComponents.md) is the owner's destructive child cleanup.
- [`TObject.Free`](../../TObject/Methods/Free.md) explains caller cleanup.

**External references**

- [Embarcadero DocWiki: `System.Classes.TComponent.Create`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TComponent.Create)
- [Free Pascal: `TComponent.Create`](https://www.freepascal.org/docs-html/rtl/classes/tcomponent.create.html)

<small>Created 2026-07-15</small>
