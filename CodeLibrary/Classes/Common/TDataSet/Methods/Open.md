---
title: Open
description: Activates the concrete dataset and, for TvxClientDataSet, materialises provider data into its client buffer.
sidebar_position: 24
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, open, provider, lifecycle]
---

```Delphi
procedure Open;
```

### Example

```Delphi
procedure EnsureOpen(const Data: TvxClientDataSet);
begin
  if not Data.Active then
    Data.Open;
end;
```

### Usage

`Open` activates the dataset and, for TvxClientDataSet, materialises provider data into its client buffer.

- Opening can execute external SQL/provider work and materialize an unbounded result; constrain the query before opening.
- Do not infer that constraints or change logging protect later script edits in normal `TvxClientDataSet` mode—they are explicitly disabled.
- Repeated Open while already Active is a no-op through the property equality check.

### Additional Technical Info
`Open` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It is equivalent to assigning [`Active := True`](../Properties/Active.md).

#### Source-backed behaviour

Base `TDataSet.Open` only sets Active. The modified active setter runs before-open, opens/initializes the descendant cursor and fields/buffers, enters browse state and runs after-open, cleaning up back to inactive on incomplete open.

`TvxClientDataSet.SetActive(True)` attaches its provider when an SQL connection exists, then uses `TCustomClientDataSet` to fetch. Its constructor sets `FetchOnDemand=False` and `PacketRecords=-1`. After a normal non-edit-mode open it sets `LogChanges=False`, disables constraints, detaches the provider and closes the owned SQL dataset; the client rows remain in memory.

#### Related members

[`Close`](Close.md) deactivates and releases buffers. [`RecordCount`](../Properties/RecordCount.md) describes materialized count.

#### Official RTL references

- [Embarcadero: TDataSet.Open](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Open)
- [Free Pascal: TDataSet.Open](https://www.freepascal.org/docs-html/fcl/db/tdataset.open.html)

<small>Created 2026-07-15</small>
