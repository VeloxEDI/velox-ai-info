---
title: "DATA10"
description: "Provides the tenth independent action-owned client dataset for general script working data."
sidebar_position: 95
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - temporary-data
---

```Delphi
DATA10: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA10, ['Code,string,40', 'Quantity,integer']);
  DATA10.Append;
  DATA10['Code'].AsString := 'SAMPLE-010';
  DATA10['Quantity'].AsInteger := 10;
  DATA10.Post;
  Value := DATA10.RecordCount;
end;
```

### Usage

`DATA10` provides the tenth independent action-owned client dataset for general script working data.

**Behaviour, side effects and errors**

- All field, record, filter, index and cursor changes persist for later users of `DATA10` in the same action execution.
- Closing, loading, querying or calling `CreateData` can invalidate the current record and retained field references.
- An in-memory `Post` changes the client dataset; it does not by itself prove that any database write or commit occurred.
- Query helpers perform real SQL/network work and normally catch/log failures. Direct methods, invalid fields and invalid record state can raise database exceptions.
- Large query results are fully materialised. The mutable dataset/cursor is not thread-safe and should not be shared with asynchronous work.

### Additional Technical Info
`DATA10` is the tenth of ten independent, host-owned `TvxClientDataSet` objects provided as general working storage for the current action. It has no automatic table, query, field layout or special persistence semantics.

Velox binds this public name to `TvxActionMan.FData84`. The non-sequential internal slot exists because friendly dataset names occupy earlier fields; it does not alias another public dataset or change `DATA10` behaviour.

**Implementation and lifecycle**

The object is created with the action, initially inactive and without a schema. A script must populate it using `CreateData`, a Data query function or an inherited load operation before reading fields. Its `DataSetName` is `DATA10`, but that text is only included in Velox field-lookup errors and never selects a database table.

Velox's `TvxClientDataSet` preserves string whitespace, disables automatic calculated fields/fetch-on-demand and requests the complete provider result. In the normal non-edit mode it copies SQL results into memory, disables constraints/change logging, detaches the provider and closes the server dataset. Action cleanup closes the client dataset; the action remains its owner.

**Edge cases and quirks**

Alphabetical navigation places `DATA10` between `DATA1` and `DATA2`; this is display ordering only. `DATA1`-`DATA10` are individually named variables, not an array, and `DATA10` is a different object from every friendly `DATA_...` variable.

Do not free the object, depend on its records after action cleanup, or infer schema from the name. File load/save methods and SQL functions have their own external side effects and security boundaries.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md)
- [`CreateData`](../../Functions/Data/CreateData.md)
- [`GetData`](../../Functions/Data/GetData.md)
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md)

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet)
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet)
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context, not proof of Delphi/Velox behaviour.

<small>Created 2026-07-15</small>
