---
title: RecordPosition
description: Gets or sets the concrete client's one-based RecNo through an unsigned Cardinal wrapper, moving the cursor and resolving pending edits.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, recordposition, recno, cursor]
---

```Delphi
property RecordPosition: Cardinal read write;
```

### Example

```Delphi
procedure MoveToSecondRow(const View: TdaCDSQueryDataView);
begin
  View.RecordPosition := 2;
end;
```

### Usage

`RecordPosition` gets or sets the client's one-based RecNo through an unsigned Cardinal function, moving the cursor and resolving pending edits.

- Use stable business keys plus `Locate` for durable targeting.
- Restrict assignments to `1..RecordCount` on an active view.
- Explicitly post/cancel before repositioning when implicit browse-mode resolution is undesirable.

### Additional Technical Info
`RecordPosition` is a DataView wrapper over `TvxClientDataSet.RecordPosition`, which is implemented with the dataset's `RecNo`.

#### Source-backed behaviour

The hidden getter/setter are abstract. Each concrete view delegates to its query's `RecordPosition`; `TvxClientDataSet` reads/writes `RecNo`. Client sequence numbers are one-based for ordinary records. Setting a different value calls browse-mode resolution, before-scroll, DSBase `MoveToSeqNo`, resynchronization and after-scroll. Invalid positions raise rather than clamp.

The script type is unsigned even though native `RecNo` is signed and uses `-1` for some invalid/internal states. That sentinel cannot be represented faithfully and can raise or convert to a large Cardinal depending on range checks. Position is not a key: insertion, deletion, sorting, filtering and master-detail changes can renumber it.

#### Official terminal references

- [Embarcadero: TDataSet.RecNo](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.RecNo)
- [Free Pascal: TDataSet.RecNo](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.recno.html)

<small>Created 2026-07-15</small>
