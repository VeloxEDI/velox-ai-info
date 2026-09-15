---
title: FindLast
description: Restarts the descendant's backward find operation and moves to the last record accepted by its filter search.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, findlast, filter, cursor]
---

```Delphi
function FindLast: Boolean;
```

### Example

```Delphi
procedure FindLastMatch(const Data: TvxClientDataSet; var Found: Boolean);
begin
  Data.Filter := 'Status = ''Ready''';
  Found := Data.FindLast;
end;
```

### Usage

`FindLast` restarts the dataset's backward find operation and moves to the last record accepted by its filter search.

- Configure [`Filter`](../Properties/Filter.md) before calling and handle false explicitly.
- This is client-dataset filtering, not server SQL/order guarantee.
- The operation can fetch remaining provider data and invoke scroll events.

### Additional Technical Info
`FindLast` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It searches from EOF toward the beginning; it is not the same as [`Last`](Last.md), which ignores the find criterion.

#### Source-backed behaviour

Base modified `TDataSet.FindRecord` always returns false. `TCustomClientDataSet` restarts its find cursor at EOF and moves backward under the current filter expression/callback. On success it resynchronizes the main cursor and returns true; pending edit state is first resolved through browse mode.

When the live dataset itself is filtered, the active cursor is used. Failure can therefore leave a boundary state different from the starting record; position preservation is not a universal contract.

#### Related members

[`FindPrior`](FindPrior.md) continues backward. [`FindFirst`](FindFirst.md) restarts forward.

#### Official RTL references

- [Embarcadero: TDataSet.FindLast](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.FindLast)
- [Free Pascal: TDataSet.FindLast](https://www.freepascal.org/docs-html/fcl/db/tdataset.findlast.html)

<small>Created 2026-07-15</small>
