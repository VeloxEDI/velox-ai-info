---
title: Free
description: Calls an object's virtual destructor when non-nil and leaves all script reference variables unchanged.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tobject, free]
---

```Delphi
procedure Free;
```

### Example

```Delphi
procedure ReleaseObject(var Obj: TObject);
begin
  Obj.Free;
  Obj := nil;
end;
```

### Usage

`Free` calls an object's destructor when non-nil and leaves all script reference variables unchanged.

**Parameters and result**

No parameters or return value. Call exactly once only when the script owns the object or its contract explicitly authorises manual destruction.

**Behaviour**

- Calling on nil is harmless.
- After success, every remaining alias is dangling and must not be read, compared through a method or freed again.
- Owner-managed components are normally freed by their owner; host-exposed live objects/datasets/lists are commonly not script-owned.
- Set the controlling variable to nil after free when possible, while remembering that other aliases are still not cleared.

**Errors and edge cases**

Double free, use-after-free or freeing a Velox-provided object is unsafe and can corrupt the process. Destructor exceptions can propagate and make cleanup state uncertain.

### Additional Technical Info
`Free` is a script-visible method declared on hidden ancestor `TObject`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`Free` destroys an object and releases its instance memory when the receiver is non-nil. It is nil-safe, but it does not set the caller's variable or any aliases to nil.

**Implementation trace**

PascalScript binds directly to Delphi `TObject.Free`. In the current non-ARC Windows RTL it tests `Self <> nil` and calls the virtual destructor, which dispatches through the actual runtime class and ultimately releases memory.

**Side effects and ownership**

Runs arbitrary descendant destructors, can recursively destroy owned graphs, close resources and invoke notifications before releasing memory.

**Performance and concurrency**

Cost is entirely dependent on the runtime destructor/owned graph. Destruction is not a concurrency-safe cancellation mechanism.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`Create`](Create.md) establishes caller-owned bare objects.
- [`TComponent.Owner`](../../TComponent/Properties/Owner.md) identifies common automatic lifetime ownership.

**External references**

- [Embarcadero DocWiki: `System.TObject.Free`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.TObject.Free)
- [Free Pascal: `TObject.Free`](https://www.freepascal.org/docs-html/rtl/system/tobject.free.html)

<small>Created 2026-07-15</small>
