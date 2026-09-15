---
title: Move
description: Relocates one string/object pair by detaching it, deleting the old entry and inserting at a new index.
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tstrings, move, reorder, partial-mutation]
---

```Delphi
procedure Move(CurIndex, NewIndex: Integer);
```

### Example

```Delphi
procedure MoveFirstToLast(const Items: TStringList);
begin
  if (not Items.Sorted) and (Items.Count > 1) then
    Items.Move(0, Items.Count - 1);
end;
```

### Usage

`Move` relocates one string/object pair by detaching it, deleting the old entry and inserting at a new index.

- Never call on a sorted `TStringList`; sorting already determines position.
- Validate both indexes against the pre-move count and consider how deletion changes allowable insertion positions.
- Do not treat the call as transactional; preserve recovery data before high-risk moves.

### Additional Technical Info
`Move` is declared by hidden ancestor `TStrings` and is normally used through a concrete visible descendant such as [`TStringList`](../../../Lists/TStringList.md). The installed base algorithm is multi-step and is not rollback-safe.

#### Source-backed behaviour

When indexes differ, the method batches updates, reads the pair, writes nil into the old object slot, deletes the old entry, then calls [`InsertObject`](InsertObject.md) at `NewIndex`. Detaching the object before deletion prevents an owning descendant from freeing it during the move.

This order creates a significant quirk for `TStringList`: if `Sorted=True`, deletion succeeds but `InsertObject` then raises `EStringListError`, so the entry has already been removed and its object detached. Invalid `NewIndex`, allocation or event failures can likewise leave the list missing the pair. Equal indexes do nothing.

#### Related members

[`Exchange`](Exchange.md) swaps two existing pairs without delete/insert in `TStringList`. [`Delete`](Delete.md) and [`InsertObject`](InsertObject.md) are the destructive steps.

#### Official RTL references

- [Embarcadero: TStrings.Move](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TStrings.Move)
- [Free Pascal: TStrings.Move](https://www.freepascal.org/docs-html/rtl/classes/tstrings.move.html)

<small>Created 2026-07-15</small>
