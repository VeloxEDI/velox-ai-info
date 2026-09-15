---
title: Delete
description: Moves by a signed offset from the current client record and deletes the record actually reached, without directly issuing a database DELETE statement.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, delete, relative-index]
---

```Delphi
procedure Delete(aRelativeIndex: Integer);
```

### Example

```Delphi
procedure DeleteCurrentRecord(const View: TdaCDSQueryDataView);
begin
  View.Delete(0);
end;
```

### Usage

Moves by a signed offset from the current client record and deletes the record actually reached, without directly issuing a database DELETE statement.

- Use `0` when the current record is the intended target.
- For a relative delete, independently ensure the requested destination exists; do not assume out-of-range means no deletion.
- Expect cursor movement, dataset events, filtering/master-detail visibility changes and deletion errors.

### Additional Technical Info
`Delete(aRelativeIndex)` removes one record from the concrete view's in-memory client dataset. The parameter is a movement distance, not an absolute zero-based record index.

#### Source-backed behaviour

The hidden base is a no-op stub. Both visible descendants call `FQuery.Delete(aRelativeIndex)`. `TvxClientDataSet.Delete` calls `MoveBy(aRelativeIndex)` when the value is nonzero, ignores the returned actual distance, then calls inherited `TDataSet.Delete` on the current record.

If the requested move crosses BOF/EOF, `MoveBy` can stop at a boundary and the method still deletes the boundary record actually reached. Navigation first resolves a pending edit through browse-mode rules. Deletion changes the client dataset; it does not generate database `DELETE` SQL here. Whether a later DataView save flow persists any corresponding effect is separate and should not be inferred.

#### Official terminal references

- [Embarcadero: TDataSet.Delete](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Delete)
- [Free Pascal: TDataSet.Delete](https://www.freepascal.org/docs-html/current/fcl/db/tdataset.delete.html)

<small>Created 2026-07-15</small>
