---
title: Post
description: Posts the pending client record only when its Modified flag is true; it neither forces an untouched insert closed nor persists directly to a database.
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, post, modified]
---

```Delphi
procedure Post;
```

### Example

```Delphi
procedure SetReady(const View: TdaSQLQueryDataView);
begin
  View.Edit;
  View['Status'].AsString := 'Ready';
  View.Post;
end;
```

### Usage

Posts the pending client record only when its Modified flag is true; it neither forces an untouched insert closed nor persists directly to a database.

- Assign/clear the intended fields before posting an inserted record.
- Validate business-required values explicitly.
- Use the DataView/module save workflow for database persistence and check its `Log.Status`; do not equate this method with SQL success.

### Additional Technical Info
`Post` completes a modified edit/insert in the concrete view's in-memory client dataset.

#### Source-backed behaviour

The hidden base is a no-op. Both shipped descendants execute `if FQuery.Modified then FQuery.Post`. They do not test dataset state independently. Consequently an edit or append that made no field modification is left in its current state; notably, [`Insert`](Insert.md) on a SQL view followed immediately by `Post` can remain `dsInsert` because entering insert does not itself set `Modified`.

When called, client-dataset `Post` commits the current record buffer and runs dataset events/provider verification. In the compiled modified VCL, the base required-field check is disabled, and Velox normally disables client constraints. This post does not execute the DataView's generated SQL save routine or prove a database transaction committed.

#### Official terminal references

- [Embarcadero: TDataSet.Post](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Post)
- [Free Pascal: TDataSet.Post](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.post.html)

<small>Created 2026-07-15</small>
