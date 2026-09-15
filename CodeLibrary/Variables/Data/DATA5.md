---
title: "DATA5"
description: "Provides the fifth independent action-owned client dataset for general script working data."
sidebar_position: 99
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
DATA5: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA5, ['Code,string,40', 'Quantity,integer']);
  DATA5.Append;
  DATA5['Code'].AsString := 'SAMPLE-005';
  DATA5['Quantity'].AsInteger := 5;
  DATA5.Post;
  Value := DATA5.RecordCount;
end;
```

### Usage

`DATA5` provides the fifth independent action-owned client dataset for general script working data.

**Behaviour, errors and limits**

- Cursor, schema, filter, index and edit changes remain visible to later scripts using `DATA5` in this action execution.
- `Post` only updates the client dataset; external persistence and commit are separate operations.
- Query helpers generally catch/log exceptions and can leave an inactive/reset object. Direct access can raise field/state/conversion exceptions.
- Closing or replacing the schema invalidates current-record and field references.
- Full result materialisation consumes memory and the mutable dataset is not thread-safe.
- Loading/saving files or issuing SQL has real side effects governed by the called function. Do not free this Velox-provided variable or treat it as durable storage.

### Additional Technical Info
`DATA5` is the fifth independent action-owned `TvxClientDataSet` for temporary or query-backed script data. Its public number conveys no table, connection or schema.

The runtime object is `TvxActionMan.FData5`. It is created once with the action, starts inactive/unstructured and carries `DATA5` only as its diagnostic dataset name.

**Implementation and lifecycle**

Use `CreateData`, Data query functions or load methods to define its current contents. Velox preserves string whitespace, turns off automatic calculated fields/fetch-on-demand and requests complete provider results. In normal non-edit mode it holds copied rows in memory after detaching/closing the provider-side dataset and disables constraints/change logging. Action cleanup closes it regardless of how it was populated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md)
- [`CreateData`](../../Functions/Data/CreateData.md)
- [`GetConfig`](../../Functions/Data/GetConfig.md)
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md)

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet)
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet)
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) is compatibility context only.

<small>Created 2026-07-15</small>
