---
title: EndUpdate
description: Ends one TCollection update-batch level and triggers the deferred collection update when balance reaches zero.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tcollection, endupdate]
---

```Delphi
procedure EndUpdate;
```

### Example

```Delphi
procedure BatchChanges(const Items: TCollection);
begin
  Items.BeginUpdate;
  try
    // Perform one or more collection changes.
  finally
    Items.EndUpdate;
  end;
end;
```

### Usage

`EndUpdate` ends one TCollection update-batch level and triggers the deferred collection update when balance reaches zero.

**Parameters and result**

It has no parameters or return value. It must be called once, and only once, for each completed `BeginUpdate`.

**Behaviour**

- Nested batches do not release updates until the outermost matching call reaches zero.
- The deferred update callback runs synchronously before `EndUpdate` returns.
- The counter is decremented before the callback, so a callback exception leaves the counter at zero.
- Always place it in the `finally` block paired with `BeginUpdate`.

**Errors and edge cases**

There is no unmatched-call exception. Calling `EndUpdate` at balance zero makes the counter negative; later `Changed` calls then remain suppressed because the counter is not zero. Callback exceptions propagate.

### Additional Technical Info
`EndUpdate` is a script-visible method declared on hidden ancestor `TCollection`. Visible descendant classes inherit it even though `Classes/Common` is intentionally omitted from the Velox and Docusaurus Code Library menus.

`EndUpdate` closes one nesting level opened by `BeginUpdate`. When the internal counter becomes exactly zero, Delphi calls the collection's normal virtual `Update(nil)` path through `Changed`.

**Implementation trace**

Studio 37.0 performs an unchecked `Dec(FUpdateCount)` and then calls `Changed`. `Changed` calls `Update(nil)` only when the counter equals zero; it does not test for a negative counter.

**Side effects and ownership**

Mutates the update counter and can synchronously invoke descendant `Update` behaviour. The method itself does not commit or roll back mutations.

**Performance and concurrency**

Counter work is O(1), followed by descendant update cost when balance reaches zero. It is not a lock and supplies no cross-thread safety.

**Remarks**

This entry describes the installed Delphi Studio 37.0 terminal reached by the Velox-modified PascalScript registration. Free Pascal is linked for compatible Object Pascal context; where implementations differ, the traced Delphi behaviour above is authoritative. The example is source-reviewed and non-destructive except where the named operation is inherently destructive.

**Related entries**

- [`BeginUpdate`](BeginUpdate.md) opens the required matching level.
- [`Clear`](Clear.md) uses an internally balanced batch around item destruction.

**External references**

- [Embarcadero DocWiki: `System.Classes.TCollection.EndUpdate`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TCollection.EndUpdate)
- [Free Pascal: `TCollection.EndUpdate`](https://www.freepascal.org/docs-html/rtl/classes/tcollection.endupdate.html)

<small>Created 2026-07-15</small>
