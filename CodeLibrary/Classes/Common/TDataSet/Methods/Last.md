---
title: Last
description: Moves to the last available record after enforcing bidirectional navigation and resolving pending edits.
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, last, navigation, full-fetch]
---

```Delphi
procedure Last;
```

### Example

```Delphi
procedure MoveToLast(const Data: TvxClientDataSet);
begin
  Data.Last;
end;
```

### Usage

Moves to the last available record after enforcing bidirectional navigation and resolving pending edits.

- Do not call only to calculate a count unless full-fetch cost is intended.
- Explicitly resolve edits when implicit Post/Cancel is unacceptable.
- Unidirectional datasets raise.

### Additional Technical Info
`Last` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). On fetch-on-demand descendants it can force retrieval of all remaining rows.

#### Source-backed behaviour

The compiled base calls `CheckBiDirectional`, `CheckBrowseMode`, before-scroll, clears buffers, invokes descendant `InternalLast`, loads prior records, then sets EOF true, emits dataset-change and runs after-scroll. `TCustomClientDataSet.InternalLast` calls `CheckProviderEOF` before moving its DS cursor to EOF.

`TvxClientDataSet` configures `FetchOnDemand=False` and `PacketRecords=-1`, so its normal open already requests the full result. Other descendants can perform expensive remote fetch during Last.

#### Related members

[`First`](First.md) moves to the first record. [`RecordCount`](../Properties/RecordCount.md) can become complete only after full fetch in generic datasets.

#### Official RTL references

- [Embarcadero: TDataSet.Last](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Last)
- [Free Pascal: TDataSet.Last](https://www.freepascal.org/docs-html/fcl/db/tdataset.last.html)

<small>Created 2026-07-15</small>
