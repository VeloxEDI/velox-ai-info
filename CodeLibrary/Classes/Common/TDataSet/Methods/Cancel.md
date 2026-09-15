---
title: Cancel
description: Abandons the current pending edit or insert and returns the dataset to browse state.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, cancel, edit-state, rollback]
---

```Delphi
procedure Cancel;
```

### Example

```Delphi
procedure AbandonChanges(const Data: TvxClientDataSet);
begin
  Data.Cancel;
end;
```

### Usage

`Cancel` abandons the current pending edit or insert and returns the dataset to browse state.

- Call after an exception only when the dataset is still in an edit/insert state; the method safely no-ops otherwise.
- Do not present Cancel as a SQL rollback.
- Nested datasets and event handlers can add failure/side-effect paths.

### Additional Technical Info
`Cancel` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It is a record-buffer operation, not a general transaction rollback.

#### Source-backed behaviour

The compiled method acts only in `dsEdit` or `dsInsert`; in other states it is a no-op. It first cancels active nested datasets, sends browse-mode checks, runs cancel/scroll events, updates cursor position, invokes descendant `InternalCancel`, frees field buffers, returns to browse state and resynchronizes.

Cancelling an inserted row discards the pending row. Cancelling an edit restores the concrete dataset's pre-edit record values. It cannot undo a row already posted, changes applied to a provider/database, or unrelated external effects from event handlers.

#### Related members

[`Post`](Post.md) accepts the pending record buffer. [`Close`](Close.md) cancels edits while deactivating.

#### Official RTL references

- [Embarcadero: TDataSet.Cancel](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Cancel)
- [Free Pascal: TDataSet.Cancel](https://www.freepascal.org/docs-html/fcl/db/tdataset.cancel.html)

<small>Created 2026-07-15</small>
