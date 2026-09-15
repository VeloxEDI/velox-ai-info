---
title: BeginUpdate
description: Begins a nestable TStrings update batch that suppresses normal descendant change notifications until balanced.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, beginupdate, notifications, batching]
---

```Delphi
procedure BeginUpdate;
```

### Example

```Delphi
procedure ReplaceValues(const Items: TStringList);
begin
  Items.BeginUpdate;
  try
    Items.Clear;
    Items.Add('One');
    Items.Add('Two');
  finally
    Items.EndUpdate;
  end;
end;
```

### Usage

`BeginUpdate` begins a nestable TStrings update batch that suppresses normal string list change notifications until balanced.

- Always pair the call with [`EndUpdate`](EndUpdate.md) in `finally`.
- Do not share mutable lists across concurrent scripts/threads without an external synchronisation contract.
- The batch is not atomic: readers see changes and exceptions leave completed mutations in place.

### Additional Technical Info
`BeginUpdate` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). It is notification batching, not locking, transaction control or a snapshot.

#### Source-backed behaviour

If the internal update count is zero, the installed base implementation first calls virtual `SetUpdateState(True)` and then increments the count. Nested calls only increment. `TStringList.SetUpdateState(True)` invokes its `OnChanging` path once at the outer transition; ordinary changes made while the count is positive suppress per-change events.

The counter is a plain integer without thread synchronisation or overflow protection. An exception entering update state occurs before the increment.

#### Related members

[`EndUpdate`](EndUpdate.md) decrements the same unchecked counter. Bulk methods such as [`AddStrings`](AddStrings.md), [`Exchange`](Exchange.md) and [`Move`](Move.md) use this pair internally.

#### Official RTL references

- [Embarcadero: TStrings.BeginUpdate](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.BeginUpdate)
- [Free Pascal: TStrings.BeginUpdate](https://www.freepascal.org/docs-html/rtl/classes/tstrings.beginupdate.html)

<small>Created 2026-07-15</small>
