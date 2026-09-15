---
title: "DATA3"
description: "Provides the third independent action-owned client dataset for general script working data."
sidebar_position: 97
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
DATA3: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA3, ['Code,string,40', 'Quantity,integer']);
  DATA3.Append;
  DATA3['Code'].AsString := 'SAMPLE-003';
  DATA3['Quantity'].AsInteger := 3;
  DATA3.Post;
  Value := DATA3.RecordCount;
end;
```

### Usage

`DATA3` provides the third independent action-owned client dataset for general script working data.

**Behaviour, errors and limits**

- Record position, fields, schema, filter and index changes affect later code using `DATA3` in the same action.
- Missing fields and invalid edit/cursor state can raise. Velox query helpers normally log and swallow their own exceptions, potentially leaving this dataset inactive.
- `Post` records a client-dataset change only; it is not evidence of an external commit.
- Recreating, loading or querying invalidates retained field/cursor assumptions. Never retain references after a schema change.
- All query rows are materialised, so large results use memory. Dataset access is mutable and not thread-safe.
- Load/save and SQL helpers perform their documented external side effects. Never free the action-owned object.

### Additional Technical Info
`DATA3` is the third independent `TvxClientDataSet` supplied as mutable working storage by the current action. It is a live object, not an array element or a predefined VxData table.

The scripter binds it to `TvxActionMan.FData3`. It begins inactive with no field definitions. Its `DATA3` dataset label improves missing-field errors but does not select a connection, command or schema.

**Implementation and lifecycle**

Population is explicit through `CreateData`, Data query helpers or load methods. Velox preserves field whitespace, disables auto-calculated fields/fetch-on-demand and requests all rows. Normal SQL opens detach the provider after copying data into memory and disable constraints/change logging. Cleanup closes every action dataset after execution; ownership remains with the action.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md)
- [`CreateData`](../../Functions/Data/CreateData.md)
- [`GetDataFromSource`](../../Functions/Data/GetDataFromSource.md)
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md)

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet)
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet)
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) is compatibility context only.

<small>Created 2026-07-15</small>
