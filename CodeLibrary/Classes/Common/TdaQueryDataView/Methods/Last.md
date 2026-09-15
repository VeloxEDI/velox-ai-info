---
title: Last
description: Positions the concrete client dataset on its last visible record after resolving pending edit state and any required descendant fetch work.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, last, navigation]
---

```Delphi
procedure Last;
```

### Example

```Delphi
procedure MoveToLastRow(const View: TdaSQLQueryDataView);
begin
  View.Last;
end;
```

### Usage

Positions the client dataset on its last visible record after resolving pending edit state and any required dataset fetch work.

- Explicitly post/cancel before moving when implicit edit resolution is undesirable.
- Do not treat “last” as a stable record identity; sorting/filtering/query configuration controls order.
- Re-read fields and boundary state after the call.

### Additional Technical Info
`Last` delegates to the `TvxClientDataSet` owned by the concrete DataView.

#### Source-backed behaviour

The hidden base is a no-op. Both shipped descendants call `FQuery.Last`. The terminal dataset resolves pending edits through `CheckBrowseMode`, emits scroll events and positions on the last record visible under the current filter/master-detail range. A dataset that fetches incrementally may need to fetch to the end; `TvxClientDataSet` normally opens with `FetchOnDemand=False` and `PacketRecords=-1`, so its successful open normally already materializes the complete result.

On an empty dataset both boundary flags remain true. The operation does not refresh or rerun SQL. Event, provider and active-state errors propagate.

#### Official terminal references

- [Embarcadero: TDataSet.Last](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Last)
- [Free Pascal: TDataSet.Last](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.last.html)

<small>Created 2026-07-15</small>
