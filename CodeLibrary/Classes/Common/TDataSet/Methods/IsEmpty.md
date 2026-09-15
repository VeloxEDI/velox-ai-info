---
title: IsEmpty
description: Reports whether the dataset currently has no active buffered record.
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, isempty, current-buffer, active]
---

```Delphi
function IsEmpty: Boolean;
```

### Example

```Delphi
procedure CheckForRows(const Data: TvxClientDataSet; var HasRows: Boolean);
begin
  HasRows := Data.Active and not Data.IsEmpty;
end;
```

### Usage

`IsEmpty` reports whether the dataset currently has no active buffered record.

- Combine with Active when inactive must be distinguished from empty.
- Do not use this as authorisation, source-system existence proof or full-count query.
- For `TvxClientDataSet`, open normally fetches the complete result because fetch-on-demand is disabled; generic datasets can differ.

### Additional Technical Info
`IsEmpty` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It is a cursor/buffer test, not a database existence query.

#### Source-backed behaviour

The modified base returns `FActiveRecord >= FRecordCount`. After close/initialization that is also true, so inactive and active-empty datasets are indistinguishable without checking [`Active`](../Properties/Active.md). A normal active `TCustomClientDataSet` returns false when a current buffered record exists.

The method does not issue SQL, count remote rows or force a provider fetch by itself. Descendant buffer/fetch state determines what is currently known.

#### Related members

[`RecordCount`](../Properties/RecordCount.md) is descendant count metadata. [`BOF`](../Properties/BOF.md) and [`EOF`](../Properties/EOF.md) are boundary flags.

#### Official RTL references

- [Embarcadero: TDataSet.IsEmpty](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.IsEmpty)
- [Free Pascal: TDataSet.IsEmpty](https://www.freepascal.org/docs-html/fcl/db/tdataset.isempty.html)

<small>Created 2026-07-15</small>
