---
title: Modified
description: Reports whether the current edit or insert record buffer has been changed since entering/resetting that state.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, modified, edit-buffer, dirty]
---

```Delphi
property Modified: Boolean read;
```

### Example

```Delphi
procedure ResolvePending(const Data: TvxClientDataSet);
begin
  if Data.Modified then
    Data.Post
  else
    Data.Cancel;
end;
```

### Usage

`Modified` reports whether the current edit or insert record buffer has been changed since entering/resetting that state.

- Read only in the context of the current pending record.
- Do not use it to decide whether an entire flow/database transaction has changes.
- Validation can still fail even when Modified is true.

### Additional Technical Info
`Modified` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It is not a dataset-wide change log or database dirty indicator.

#### Source-backed behaviour

The property exposes `FModified`. Field edits/data events set it, while insert completion, Post, Cancel and temporary state transitions reset it. `CheckBrowseMode` uses it: modified edit/insert state is posted, while unmodified state is cancelled.

`TvxClientDataSet` normally sets `LogChanges=False` after opening outside data-edit mode, so Modified must not be confused with the client dataset's update log. It says nothing about prior posted rows or database application.

#### Related members

[`Edit`](../Methods/Edit.md), [`Post`](../Methods/Post.md) and [`Cancel`](../Methods/Cancel.md) define its lifecycle.

#### Official RTL references

- [Embarcadero: TDataSet.Modified](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Modified)
- [Free Pascal: TDataSet.Modified](https://www.freepascal.org/docs-html/fcl/db/tdataset.modified.html)

<small>Created 2026-07-15</small>
