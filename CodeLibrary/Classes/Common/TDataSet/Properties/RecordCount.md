---
title: RecordCount
description: Returns the concrete descendant's record count, which may represent fetched rows rather than the final source-query total.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, recordcount, fetched-rows, count]
---

```Delphi
property RecordCount: Integer read;
```

### Example

```Delphi
procedure ReadCount(const Data: TvxClientDataSet; var Count: Integer);
begin
  if Data.Active then
    Count := Data.RecordCount
  else
    Count := 0;
end;
```

### Usage

`RecordCount` returns the dataset's record count, which may represent fetched rows rather than the final source-query total.

- Check Active and do not assume every TDataSet supports a nonnegative count.
- Do not call Last merely for counting unless full-fetch cost is accepted.
- Count is not a business aggregate from the database and can become stale after mutations.

### Additional Technical Info
`RecordCount` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). The base class cannot provide a universal count.

#### Source-backed behaviour

Modified base `TDataSet.GetRecordCount` returns `-1`. `TCustomClientDataSet` requires Active and obtains the count from its DS cursor; provider details not yet fetched can affect availability/completeness. Generic descendants may fetch lazily, and calling Last can force remaining rows.

`TvxClientDataSet` configures `FetchOnDemand=False` and `PacketRecords=-1`, so its successful normal Open typically materializes the complete result and RecordCount reflects those client rows. Local filters can alter visible cursor behaviour; count semantics remain descendant/filter dependent.

#### Related members

[`IsEmpty`](../Methods/IsEmpty.md) checks current-buffer emptiness. [`FieldCount`](FieldCount.md) counts columns, not rows.

#### Official RTL references

- [Embarcadero: TDataSet.RecordCount](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.RecordCount)
- [Free Pascal: TDataSet.RecordCount](https://www.freepascal.org/docs-html/fcl/db/tdataset.recordcount.html)

<small>Created 2026-07-15</small>
