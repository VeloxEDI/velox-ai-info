---
title: Insert
description: Appends a pending record at the end of the concrete client dataset and, for file/CDS views, writes hard-coded ID/master linkage fields.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, insert, append, master-detail]
---

```Delphi
procedure Insert;
```

### Example

```Delphi
procedure AddOutputRow(const View: TdaCDSQueryDataView);
begin
  View.Insert;
  View['Code'].AsString := 'A100';
  View.Post;
end;
```

### Usage

Call `Insert` to append a pending record to the query DataView's client dataset. File/CDS views also populate their configured ID and master-link fields.

- Assign at least the intended row values before calling `Post`.
- Do not reorder the generated ID fields of file/CDS views without reviewing the required field contract.
- Treat SQL-view insertion as client-buffer staging; database INSERT is generated later by the save workflow when configured.

### Additional Technical Info
Despite its name, `Insert` uses append-at-end semantics in both shipped descendants.

#### Source-backed behaviour

The hidden base is a no-op. Each descendant returns immediately if `FQuery.State = dsInsert`; otherwise it calls `FQuery.Append`. The SQL DataView stops there. The file/CDS DataView then writes integer field index 1: for a detail view it copies the master's field index 0, otherwise it writes literal `1`. Its generated layout expects `ID` at index 0 and `MASTER_ID` at index 1; missing, reordered or non-integer fields can raise or corrupt linkage.

The record remains pending. Entering insert alone does not make `Modified` true, and this DataView's [`Post`](Post.md) only posts when `Modified` is true. Therefore an untouched appended record can remain in insert state. Appending can first resolve any prior edit through dataset browse-mode rules.

#### Official terminal references

- [Embarcadero: TDataSet.Append](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Append)
- [Free Pascal: TDataSet.Append](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.append.html)

<small>Created 2026-07-15</small>
