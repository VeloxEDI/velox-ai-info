---
title: Prior
description: Moves the concrete client dataset one visible record backward after resolving pending edit state through normal browse-mode rules.
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, prior, navigation]
---

```Delphi
procedure Prior;
```

### Example

```Delphi
procedure MoveBack(const View: TdaCDSQueryDataView);
begin
  if not View.BOF then
    View.Prior;
end;
```

### Usage

`Prior` moves the client dataset one visible record backward after resolving pending edit state through normal browse-mode rules.

- Explicitly post/cancel pending work when navigation side effects must be controlled.
- Re-read fields after movement.
- Use a stable key rather than repeated relative movement when exact restoration matters.

### Additional Technical Info
`Prior` is the backward navigation wrapper for concrete query/file DataViews.

#### Source-backed behaviour

The hidden base is empty. Both visible descendants call `FQuery.Prior`. The client dataset calls browse-mode resolution, can post a modified edit or cancel an unmodified one, emits scroll events and moves one visible record backward. Moving before the first record sets BOF.

Unlike SQL-view [`Next`](Next.md), `Prior` does not invoke primary-key capture in this wrapper. It does not rerun the query or change sorting/filter rules. Calling at BOF can still resolve pending state and invoke scroll-event paths even though no record movement occurs.

#### Official terminal references

- [Embarcadero: TDataSet.Prior](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Prior)
- [Free Pascal: TDataSet.Prior](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.prior.html)

<small>Created 2026-07-15</small>
