---
title: Empty
description: Returns the dataset's EOF flag exactly and therefore can report true for a nonempty dataset positioned by Last.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, empty, eof, cursor, warning]
---

```Delphi
function Empty: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Reliable cursor-empty test: both flags, not DATA1.Empty alone.
  Value := DATA1.BOF and DATA1.EOF;
end;
```

### Usage

Returns the dataset's EOF flag exactly and therefore can report true for a nonempty dataset positioned by Last.

**Usage notes**

Do not use Empty to decide whether records exist. For an active cursor use `BOF and EOF`; where an exact count is required, use the appropriate record-count/schema contract and account for filters/ranges.

**Side effects and errors**

Reading Empty performs no navigation, state check, data access, post or mutation; it reads the Boolean flag. On an inactive/new object the flag's prior/default state is not a supported record-existence test even if reading it does not raise.

### Additional Technical Info
`Empty` is a misleadingly named convenience method whose entire implementation is `Result := EOF`. It reports cursor end-of-file state, not whether record count is zero.

The example shows the reliable Delphi cursor test for an active dataset/range: both BOF and EOF. It is source-reviewed and was not executed by the documentation workflow.

**Signature and exact behavior**

EOF is true when an empty dataset opens, but also after `Last`, after attempting to move beyond the final record, or for an empty range. Consequently a nonempty dataset positioned on its last row can make Empty return true. It can still have a valid active last-record buffer at that point.

The complement method `NotEmpty` is just `not EOF` and has the inverse defect. Neither method checks BOF, RecordCount or physical storage.

**Performance and concurrency**

The method is constant-time. EOF is mutable shared cursor state and can change after any navigation, locate, range, delete, load, index or resync operation. Do not split a check and dependent operation across helpers that may move the dataset.

**External references**

- [Embarcadero DocWiki: `TDataSet.Eof`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Eof) - authoritative states that make EOF true, including Last on a nonempty dataset.
- [Free Pascal: `TDataSet.EOF`](https://www.freepascal.org/docs-html/fcl/db/tdataset.eof.html) - compatible EOF/empty-cursor distinction.

<small>Created 2026-07-15</small>
