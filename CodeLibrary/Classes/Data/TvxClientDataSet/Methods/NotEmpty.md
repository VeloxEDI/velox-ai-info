---
title: NotEmpty
description: Returns not EOF exactly and can therefore report false for a nonempty dataset positioned by Last.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, notempty, eof, cursor, warning]
---

```Delphi
function NotEmpty: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Reliable active-cursor record-existence test.
  Value := not (DATA1.BOF and DATA1.EOF);
end;
```

### Usage

`NotEmpty` returns not EOF exactly and can therefore report false for a nonempty dataset positioned by Last.

**Usage notes**

Use `not (BOF and EOF)` for an active cursor record-existence test. Do not use this method as a guard if another call between the guard and data access can navigate the same dataset.

**Side effects and errors**

The method only reads the EOF flag. It does not activate, navigate, post, query, count or mutate the dataset.

### Additional Technical Info
`NotEmpty` returns exactly `not EOF`. It does not test record count and is not a reliable indication that at least one record exists.

The example checks the complement of the standard BOF-and-EOF empty-cursor condition. It is source-reviewed and was not executed by the documentation workflow.

**Signature and exact behavior**

Delphi sets EOF true for an empty opened dataset, but also when `Last` is called or a forward move cannot pass the last row. NotEmpty therefore returns false in those nonempty cursor states. Conversely its result on inactive/prior cursor state is not a supported existence guarantee.

`Empty` and `NotEmpty` are strict Boolean complements, so both share the same naming defect. They are useful only if the caller intentionally wants to know whether EOF is currently false.

**Performance and concurrency**

It is constant-time, but EOF is mutable unsynchronised cursor state. Locate, Last/Next, filtering/ranges, deletes, loads and index changes can change it immediately.

**External references**

- [Embarcadero DocWiki: `TDataSet.Eof`](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Eof) - authoritative EOF cursor semantics.
- [Free Pascal: `TDataSet.EOF`](https://www.freepascal.org/docs-html/fcl/db/tdataset.eof.html) - compatible explanation of EOF versus an empty dataset.

<small>Created 2026-07-15</small>
