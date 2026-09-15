---
title: FindFirst
description: Restarts the descendant's forward find operation and moves to the first record accepted by its active filter search.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, findfirst, filter, cursor]
---

```Delphi
function FindFirst: Boolean;
```

### Example

```Delphi
procedure FindFirstMatch(const Data: TvxClientDataSet; var Found: Boolean);
begin
  Data.Filter := 'Status = ''Ready''';
  Found := Data.FindFirst;
end;
```

### Usage

`FindFirst` restarts the dataset's forward find operation and moves to the first record accepted by its active filter search.

- Set a client-side [`Filter`](../Properties/Filter.md) deliberately; this is not SQL search.
- Treat a false result as no match and explicitly reposition if subsequent logic requires a known cursor.
- The call can auto-post/cancel a pending edit through browse mode.

### Additional Technical Info
`FindFirst` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). This legacy find family is virtual and is meaningful only when the concrete descendant implements `FindRecord`.

#### Source-backed behaviour

Modified base `TDataSet.FindRecord` is a false-return stub. `TCustomClientDataSet` overrides it: it resolves pending browse mode, synchronizes/fetches cursor data, starts from BOF, uses current filter expression/callback through a dedicated cursor when `Filtered=False` or the active filtered cursor when true, and resynchronizes the main cursor when a record is found.

Success returns true and moves to the match. On failure, cursor/boundary effects differ depending on whether a separate find cursor or the active filtered cursor was used; do not assume position preservation.

#### Related members

[`FindNext`](FindNext.md) continues forward, while [`FindLast`](FindLast.md) restarts backward. [`Filtered`](../Properties/Filtered.md) controls whether the filter also restricts the live dataset view.

#### Official RTL references

- [Embarcadero: TDataSet.FindFirst](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.FindFirst)
- [Free Pascal: TDataSet.FindFirst](https://www.freepascal.org/docs-html/fcl/db/tdataset.findfirst.html)

<small>Created 2026-07-15</small>
