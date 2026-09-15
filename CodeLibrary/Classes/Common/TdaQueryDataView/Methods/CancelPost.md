---
title: CancelPost
description: Cancels the current pending edit or insert in the concrete data view's client dataset without undoing records already posted or persisted.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, cancel, edit-buffer]
---

```Delphi
procedure CancelPost;
```

### Example

```Delphi
procedure AbandonPendingChange(const View: TdaSQLQueryDataView);
begin
  View.CancelPost;
end;
```

### Usage

`CancelPost` cancels the current pending edit or insert in the data view's client dataset without undoing records already posted or persisted.

- Call this in the exception path that owns the current pending edit.
- Do not use it as a database transaction rollback; transaction control belongs to the surrounding Velox connection/action flow.
- After a successful cancel, re-read fields because the active record buffer may have been restored or repositioned.

### Additional Technical Info
`CancelPost` is declared by hidden `TdaQueryDataView` and used through a concrete view such as [`TdaSQLQueryDataView`](../../../Data/TdaSQLQueryDataView.md) or [`TdaCDSQueryDataView`](../../../Data/TdaCDSQueryDataView.md).

#### Source-backed behaviour

The hidden base implementation is an intentional no-op because the PascalScript importer cannot bind an abstract method. Both shipped visible descendants override it with `FQuery.Cancel`, where `FQuery` is a `TvxClientDataSet`. Delphi `TDataSet.Cancel` abandons only the current `dsEdit` or `dsInsert` buffer and returns the dataset to browse state; calling it outside an active edit is harmless descendant behaviour.

It does not restore records already posted, reverse [`Delete`](Delete.md)/[`DeleteAll`](DeleteAll.md), reopen a query, or roll back SQL previously executed by the DataView save workflow. Field/event/provider exceptions raised while cancelling propagate according to the dataset.

#### Official terminal references

- [Embarcadero: TDataSet.Cancel](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Cancel)
- [Free Pascal: TDataSet.Cancel](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.cancel.html)

<small>Created 2026-07-15</small>
