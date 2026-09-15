---
title: BOF
description: Indicates that backward navigation is at the beginning boundary of the current dataset view.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, bof, boundary, navigation]
---

```Delphi
property BOF: Boolean read;
```

### Example

```Delphi
procedure MoveBeforeCurrent(const Data: TvxClientDataSet);
begin
  if not Data.BOF then
    Data.Prior;
end;
```

### Usage

`BOF` indicates that backward navigation is at the beginning boundary of the current dataset view.

- Use Active plus [`IsEmpty`](../Methods/IsEmpty.md), not BOF alone, to test for rows.
- Check it in reverse loops and ensure [`Prior`](../Methods/Prior.md) is called on every iteration path.
- Cursor-changing callbacks can invalidate a previously read value.

### Additional Technical Info
`BOF` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It is a cursor flag, not a record-number or empty-dataset property by itself.

#### Source-backed behaviour

The base maintains `FBOF` through buffer activation/clear and relative navigation. [`First`](../Methods/First.md) explicitly sets BOF true after positioning; a failed backward move also sets it true. Clearing/inactivating buffers sets both BOF and EOF true.

The flag describes the current filtered/indexed view and can change after filters, locate, post/delete or resynchronization. A nonempty dataset can legitimately have BOF true while positioned at its first row.

#### Related members

[`EOF`](EOF.md) is the forward boundary. [`First`](../Methods/First.md), [`Prior`](../Methods/Prior.md) and [`MoveBy`](../Methods/MoveBy.md) update it.

#### Official RTL references

- [Embarcadero: TDataSet.BOF](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.BOF)
- [Free Pascal: TDataSet.BOF](https://www.freepascal.org/docs-html/fcl/db/tdataset.bof.html)

<small>Created 2026-07-15</small>
