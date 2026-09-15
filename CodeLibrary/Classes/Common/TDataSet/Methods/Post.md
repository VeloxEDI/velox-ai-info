---
title: Post
description: Validates the current edit event path and commits the pending record into the concrete dataset buffer.
sidebar_position: 25
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, post, edit-buffer, required-fields]
---

```Delphi
procedure Post;
```

### Example

```Delphi
procedure CommitPending(const Data: TvxClientDataSet);
begin
  Data.Post;
end;
```

### Usage

Call `Post` after `Append`, `Insert` or `Edit`, once all field assignments and business validation are complete. It accepts the pending record changes and returns the dataset to browse state. Calling it when the dataset is not editing or inserting raises an error.

If assignment or validation fails while the record is still pending, call [`Cancel`](Cancel.md) instead. In normal Velox scripting, `Post` updates the in-memory dataset; persistence to SQL or another external destination is handled separately by the owning module or flow.

### Additional Technical Info

`Post` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). It does not by itself prove or perform a database transaction commit.

#### Source-backed behaviour

The method first calls `UpdateRecord`, which raises unless state is an edit mode. It then runs browse-mode data checks, before-post, descendant `InternalPost` through post-error handling, frees field buffers, enters browse, resynchronizes and runs after-post. `TCustomClientDataSet.InternalPost` modifies or inserts the current DS cursor record.

Velox's compiled modified `Data.DB.InternalPost` has the standard `CheckRequiredFields` call deliberately commented out. `TvxClientDataSet` also disables constraints after open and normally sets `LogChanges=False` outside data-edit mode. Therefore `Required` metadata and client constraints are not a reliable validation gate here, and Post normally means accepted into the in-memory client dataset only.

#### Operational guidance

- Call only after Append/Insert/Edit; calling in browse state raises `Dataset not in edit or insert mode`.
- Validate required business fields explicitly in the flow before Post.
- Use Cancel on assignment/validation exceptions while still editing.
- Database persistence requires the separate approved edit/provider/apply workflow; never describe Post alone as saving to SQL.

#### Related members

[`Cancel`](Cancel.md) abandons the pending buffer. [`Modified`](../Properties/Modified.md) reports current edit-buffer changes.

#### Official RTL references

- [Embarcadero: TDataSet.Post](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Post)
- [Free Pascal: TDataSet.Post](https://www.freepascal.org/docs-html/fcl/db/tdataset.post.html)

<small>Created 2026-07-15</small>
