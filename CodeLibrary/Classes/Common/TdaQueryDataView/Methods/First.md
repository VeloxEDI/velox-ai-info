---
title: First
description: Positions the concrete client dataset on its first visible record after resolving any pending edit through normal browse-mode rules.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, first, navigation]
---

```Delphi
procedure First;
```

### Example

```Delphi
procedure RewindView(const View: TdaCDSQueryDataView);
begin
  View.First;
end;
```

### Usage

Positions the client dataset on its first visible record after resolving any pending edit through normal browse-mode rules.

- Explicitly post/cancel before navigation when implicit edit resolution would be surprising.
- Re-read field values after the call.
- Do not use `First` as a refresh; refresh/query lifecycle is separate.

### Additional Technical Info
`First` delegates cursor positioning to the concrete DataView's `TvxClientDataSet`.

#### Source-backed behaviour

The hidden base is a no-op. Both visible descendants call `FQuery.First`. The terminal dataset method calls `CheckBrowseMode`, which can post a modified pending edit or cancel an unmodified one, sends scroll events, resets to the beginning and fetches the first visible record. Filters and master/detail ranges determine which record is first.

On an empty view it leaves BOF and EOF true. It does not rerun the source SQL by itself. Event and provider errors propagate, and event handlers can add further effects.

#### Official terminal references

- [Embarcadero: TDataSet.First](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.First)
- [Free Pascal: TDataSet.First](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.first.html)

<small>Created 2026-07-15</small>
