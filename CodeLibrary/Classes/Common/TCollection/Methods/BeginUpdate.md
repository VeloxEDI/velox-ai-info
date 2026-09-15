---
title: BeginUpdate
description: Starts a nestable TCollection update batch by incrementing the Delphi update-suppression counter.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcollection, beginupdate]
---

```Delphi
procedure BeginUpdate;
```

### Example

```Delphi
procedure ReplaceItems(const Items: TCollection);
begin
  Items.BeginUpdate;
  try
    Items.Clear;
    // Add or insert the replacement items here.
  finally
    Items.EndUpdate;
  end;
end;
```

### Usage

`BeginUpdate` starts a nestable TCollection update batch by incrementing the Velox update-suppression counter.

**Parameters and result**

It has no parameters or return value. Calls can be nested; every successful call requires one matching `EndUpdate`.

**Behaviour**

**Errors and edge cases**

Calling it on nil raises a normal object-reference failure. The counter has no balance or overflow guard; a missing `EndUpdate` can suppress later updates indefinitely.

**Side effects and ownership**

The method starts an update batch. It does not itself add, remove, free or copy an item.

### Additional Technical Info
`BeginUpdate` is a script-visible method declared on hidden ancestor `TCollection`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`BeginUpdate` tells a Delphi `TCollection` descendant to defer its normal collection-level update callback while a group of mutations is performed. It does not lock the collection, start a database transaction or take a snapshot.

**Implementation trace**

PascalScript binds directly to `TCollection.BeginUpdate`. Studio 37.0 implements it as one unchecked `Inc(FUpdateCount)`. Item changes call the collection's `Changed` method, which invokes virtual `Update(nil)` only while that counter is exactly zero.

**Performance and concurrency**

Time is O(1). It is not a thread-synchronisation primitive; concurrent collection access remains unsafe unless the owning class supplies separate coordination.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`EndUpdate`](EndUpdate.md) decrements the same counter and can release the deferred update.
- [`Clear`](Clear.md), [`Delete`](Delete.md) and [`Insert`](Insert.md) are destructive/mutating operations commonly batched.

**External references**

- [Embarcadero DocWiki: `System.Classes.TCollection.BeginUpdate`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollection.BeginUpdate)
- [Free Pascal: `TCollection.BeginUpdate`](https://www.freepascal.org/docs-html/rtl/classes/tcollection.beginupdate.html)

<small>Created 2026-07-15</small>
