---
title: RecordPosition
description: Gets or sets the current client-dataset RecNo through a range-checked unsigned Cardinal wrapper.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, recordposition, recno, cursor, cardinal]
---

```Delphi
property RecordPosition: Cardinal read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  SavedPosition: Cardinal;
begin
  SavedPosition := DATA1.RecordPosition;
  // Consume immediately while data, filter and index remain unchanged.
  DATA1.RecordPosition := SavedPosition;
  Value := DATA1.RecordPosition;
end;
```

### Usage

`RecordPosition` gets or sets the current client-dataset RecNo through a range-checked unsigned Cardinal function.

**Usage notes**

Use only for immediate temporary restoration under unchanged packet/index/filter state. Prefer a unique business-key Find for durable repositioning.

**Setter**

The Cardinal is passed to a signed Integer RecNo setter. With the product's range checking, values above `MaxInt` raise `ERangeError` before RecNo/cursor work; never use them. If the in-range target differs, RecNo enters browse mode, can post a pending edit, fires BeforeScroll, calls `MoveToSeqNo`, recentres/resynchronises and fires AfterScroll.

An invalid/out-of-range position raises. A failure after browse/post or BeforeScroll can still have side effects even if no final reposition occurs.

### Additional Technical Info
`RecordPosition` is a Velox name/type wrapper over inherited client-dataset `RecNo`. Reading returns `RecNo` converted from signed Integer to `Cardinal`; writing converts the Cardinal back and assigns RecNo.

The example round-trips immediately under unchanged state. It is source-reviewed and was not executed by the documentation workflow.

In normal active browse state, client-dataset RecNo is a 1-based sequence position. It is not a zero-based offset, bookmark, database key or durable row identity. IndexFieldNames, filters/ranges, inserts/deletes, loads and data refresh can change which record a number identifies.

**Getter**

Native RecNo checks that the dataset is active and reads the active record buffer's internal sequence number. During `dsInternalCalc` it returns `-1`. Velox is compiled with Delphi range checking enabled, so assigning that sentinel to the Cardinal result raises `ERangeError`; it does not wrap to `4294967295`. Inactive access raises a dataset error first.

**Performance and concurrency**

Positioning cost depends on client-dataset cursor/index internals and resync. The position and cursor are mutable unsynchronised state.

**External references**

- [Embarcadero DocWiki: `TDataSet.RecNo`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.RecNo) - signed active-record-number contract implemented by descendants.
- [Free Pascal: `TDataSet.RecNo`](https://www.freepascal.org/docs-html/fcl/db/tdataset.recno.html) - compatible caution that RecNo is inherently unreliable for exact positioning.

<small>Created 2026-07-15</small>
