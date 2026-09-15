---
title: "DATA6"
description: "Provides the sixth independent action-owned client dataset for general script working data."
sidebar_position: 100
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
DATA6: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA6, ['Code,string,40', 'Quantity,integer']);
  DATA6.Append;
  DATA6['Code'].AsString := 'SAMPLE-006';
  DATA6['Quantity'].AsInteger := 6;
  DATA6.Post;
  Value := DATA6.RecordCount;
end;
```

### Usage

`DATA6` provides the sixth independent action-owned client dataset for general script working data.

**Behaviour, errors and limits**

- All schema, record, cursor, filter and index mutations affect later users in the action.
- Missing fields and invalid state can raise; query/create helpers often catch/log errors and may leave the object inactive.
- Client-dataset `Post` is not an external database commit.
- Re-querying, closing or recreating the schema invalidates retained fields and record positions.
- Returned rows are fully materialised; memory use scales with result size and the mutable cursor is not thread-safe.
- SQL and file operations have the called helper's external effects. Never free `DATA6` or treat it as cross-execution persistence.

### Additional Technical Info
`DATA6` is the sixth independent `TvxClientDataSet` made available as mutable working data for the current action. It does not automatically target a table or inherit the meaning of another Data variable.

Velox binds it to `TvxActionMan.FData80`; slots 6-79 are used by friendly dataset names. That internal numbering is an implementation detail: `DATA6` is a distinct object and not an alias.

**Implementation and lifecycle**

It starts inactive with no fields and must be populated by `CreateData`, a Data query helper or a load operation. `DataSetName = 'DATA6'` only labels field lookup errors. Velox preserves string whitespace, disables auto-calculated fields/fetch-on-demand and requests all rows. Normal SQL results are copied into memory; provider/change-log/constraint behaviour is disabled or detached for the default non-edit path. Action cleanup closes the object, which remains action-owned.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md)
- [`CreateData`](../../Functions/Data/CreateData.md)
- [`GetDataSetFromSource`](../../Functions/Data/GetDataSetFromSource.md)
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md)

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet)
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet)
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) is compatibility context only.

<small>Created 2026-07-15</small>
