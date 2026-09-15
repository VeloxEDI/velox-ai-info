---
title: First
description: Moves to the first available record after resolving any pending edit through browse mode.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, first, navigation, auto-post]
---

```Delphi
procedure First;
```

### Example

```Delphi
procedure RewindData(const Data: TvxClientDataSet);
begin
  Data.First;
end;
```

### Usage

Moves to the first available record after resolving any pending edit through browse mode.

- Explicitly Post/Cancel first when implicit browse-mode resolution is unacceptable.
- On unidirectional datasets, First can reopen/re-execute the dataset and repeat external work.
- Do not interpret BOF alone as empty; use [`IsEmpty`](IsEmpty.md) or BOF and EOF together with Active context.

### Additional Technical Info
`First` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). Navigation has edit and event side effects; it is not a pure cursor assignment.

#### Source-backed behaviour

The compiled base calls `CheckBrowseMode`, so a modified edit can be posted and an unmodified one cancelled. It runs before-scroll, handles unidirectional datasets by closing/reopening when not already at BOF, otherwise clears buffers, invokes descendant `InternalFirst`, fills forward buffers, sets BOF true, emits dataset-change and runs after-scroll.

For an empty dataset BOF and EOF can both be true. For `TCustomClientDataSet`, cursor/provider errors propagate through descendant record retrieval.

#### Related members

[`Last`](Last.md) moves to the opposite boundary. [`MoveBy`](MoveBy.md), [`Next`](Next.md) and [`Prior`](Prior.md) navigate relatively.

#### Official RTL references

- [Embarcadero: TDataSet.First](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.First)
- [Free Pascal: TDataSet.First](https://www.freepascal.org/docs-html/fcl/db/tdataset.first.html)

<small>Created 2026-07-15</small>
