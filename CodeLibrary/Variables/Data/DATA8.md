---
title: "DATA8"
description: "Provides the eighth independent action-owned client dataset for general script working data."
sidebar_position: 102
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
DATA8: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA8, ['Code,string,40', 'Quantity,integer']);
  DATA8.Append;
  DATA8['Code'].AsString := 'SAMPLE-008';
  DATA8['Quantity'].AsInteger := 8;
  DATA8.Post;
  Value := DATA8.RecordCount;
end;
```

### Usage

`DATA8` provides the eighth independent action-owned client dataset for general script working data.

**Behaviour, errors and limits**

- Mutating records, schema, cursor, filters or indexes changes the object seen by later code in the action.
- A client `Post` is not a database commit. Persistence is governed by the operation/transaction used.
- Missing fields and invalid state can raise; query helpers commonly catch/log errors and can leave the dataset inactive.
- Close/recreate/query operations invalidate retained field and record references.
- Full result materialisation uses memory proportional to returned data; the cursor is not thread-safe.
- File and SQL helpers have external effects when called. Never free the Velox-provided object or infer a schema from `DATA8`.

### Additional Technical Info
`DATA8` is the eighth independent, action-owned `TvxClientDataSet` for temporary or query-backed work. It does not have a built-in table, field set or business purpose.

Velox constructs this distinct object as `TvxActionMan.FData82`, gives it diagnostic label `DATA8`, and binds it to the script. The internal slot is non-sequential only because friendly names occupy the intervening action fields.

**Implementation and lifecycle**

The object begins inactive and without fields. Explicit creation/query/load calls define its current schema and rows. Velox preserves whitespace, disables auto-calculated fields/fetch-on-demand and requests all provider records. Default SQL use copies rows into memory, disables constraints/change logging and detaches/closes the provider-side dataset. Cleanup closes every action dataset after execution.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md)
- [`CreateData`](../../Functions/Data/CreateData.md)
- [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md)
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md)

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet)
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet)
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) is compatibility context only.

<small>Created 2026-07-15</small>
