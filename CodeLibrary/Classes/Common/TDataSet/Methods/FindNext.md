---
title: FindNext
description: Continues a descendant filter search forward from the prior find/current cursor and moves to the next match.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, findnext, filter, cursor]
---

```Delphi
function FindNext: Boolean;
```

### Example

```Delphi
procedure FindAnother(const Data: TvxClientDataSet; var Found: Boolean);
begin
  Found := Data.FindNext;
end;
```

### Usage

`FindNext` continues a dataset filter search forward from the prior find/current cursor and moves to the next match.

- Normally call after [`FindFirst`](FindFirst.md) or another successful forward find.
- Stop on false and do not assume the current cursor still identifies the last match in every filtering mode.
- Filter text is local expression syntax, not SQL.

### Additional Technical Info
`FindNext` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It relies on state established by the concrete descendant's find implementation.

#### Source-backed behaviour

Base `TDataSet` returns false because `FindRecord` is a stub. `TCustomClientDataSet` reuses or synchronizes its find cursor, moves one record forward under the configured filter and, on success, resynchronizes the active cursor and sets `Found=True`.

Calling without a prior successful/restarted find still uses the current cursor/filter state; exact starting position is descendant-defined. Browse-mode checks can post/cancel pending edits.

#### Related members

[`FindPrior`](FindPrior.md) moves backward; [`FindFirst`](FindFirst.md) restarts the sequence.

#### Official RTL references

- [Embarcadero: TDataSet.FindNext](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.FindNext)
- [Free Pascal: TDataSet.FindNext](https://www.freepascal.org/docs-html/fcl/db/tdataset.findnext.html)

<small>Created 2026-07-15</small>
