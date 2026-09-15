---
title: RecNo
description: Gets or sets the concrete descendant's current record sequence number, with unsupported base behaviour returning minus one.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, recno, sequence, cursor]
---

```Delphi
property RecNo: Integer read write;
```

### Example

```Delphi
procedure MoveToRecord(const Data: TvxClientDataSet; Number: Integer);
begin
  Data.RecNo := Number;
end;
```

### Usage

`RecNo` gets or sets the dataset's current record sequence number, with unsupported base behaviour returning minus one.

- Use a stable key with [`Locate`](../Methods/Locate.md) when identity matters.
- Validate the requested range against current dataset semantics; out-of-range writes raise in the client cursor.
- Writing can auto-Post/Cancel and trigger scroll events.

### Additional Technical Info
`RecNo` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). Record numbers are cursor/view metadata, not stable business keys.

#### Source-backed behaviour

Modified base `TDataSet.GetRecNo` returns `-1` and its setter does nothing. `TCustomClientDataSet` overrides both: reading requires Active and returns the current buffer's DS cursor record number (or `-1` during internal calculation); writing resolves browse mode, invokes before-scroll, moves to the requested sequence, recentres/resynchronizes buffers and invokes after-scroll.

Filtering, indexes, inserts/deletes and refresh/reopen can change numbering. `TvxClientDataSet.RecordPosition` is a Cardinal proxy over the same property, so unsupported `-1` must not be treated as a valid unsigned position.

#### Related members

[`RecordCount`](RecordCount.md) gives descendant count metadata. [`MoveBy`](../Methods/MoveBy.md) is relative navigation.

#### Official RTL references

- [Embarcadero: TDataSet.RecNo](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.RecNo)
- [Free Pascal: TDataSet.RecNo](https://www.freepascal.org/docs-html/fcl/db/tdataset.recno.html)

<small>Created 2026-07-15</small>
