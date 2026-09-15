---
title: MoveBy
description: Moves relatively by up to the requested record distance and returns the signed distance actually travelled.
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, moveby, navigation, signed-result]
---

```Delphi
function MoveBy(Distance: Integer): Integer;
```

### Example

```Delphi
procedure MoveForward(const Data: TvxClientDataSet; Requested: Integer;
  var Actual: Integer);
begin
  Actual := Data.MoveBy(Requested);
end;
```

### Usage

`MoveBy` moves relatively by up to the requested record distance and returns the signed distance actually travelled.

- Compare the returned value with the requested distance to detect a boundary.
- Never assume movement succeeded solely because no exception was raised.
- Avoid zero-distance calls as harmless probes; they can resolve edits and invoke an unpaired before-scroll callback.

### Additional Technical Info
`MoveBy` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). Positive moves forward, negative moves backward and zero performs no movement.

#### Source-backed behaviour

The base first calls `CheckBrowseMode`, so it can Post/Cancel pending state, then runs before-scroll. It advances through buffered/descendant records until the requested distance is exhausted or EOF/BOF is reached. The result increments for forward moves and decrements for backward moves; its magnitude can be smaller than requested.

Forward boundary sets EOF; backward boundary sets BOF. Negative movement invokes `CheckBiDirectional` when it needs a prior record and therefore raises for unidirectional datasets. Dataset-change/scroll and after-scroll events run in `finally` once movement enters the directional branch. A zero distance, or a request made while the matching boundary flag is already true, still runs `CheckBrowseMode` and `DoBeforeScroll` but skips that branch and therefore does **not** pair it with `DoAfterScroll` in this implementation.

#### Related members

[`Next`](Next.md) calls a one-step forward path and [`Prior`](Prior.md) a one-step backward path. [`RecNo`](../Properties/RecNo.md) is descendant sequence metadata, not equivalent movement.

#### Official RTL references

- [Embarcadero: TDataSet.MoveBy](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.MoveBy)
- [Free Pascal: TDataSet.MoveBy](https://www.freepascal.org/docs-html/fcl/db/tdataset.moveby.html)

<small>Created 2026-07-15</small>
