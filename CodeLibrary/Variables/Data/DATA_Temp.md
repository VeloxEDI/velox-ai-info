---
title: "DATA_Temp"
description: "Provides the shared temporary dataset reused internally by several Velox helper implementations."
sidebar_position: 82
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - temp
---

```Delphi
DATA_Temp: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_Temp, ['Code,string,100', 'Value,string,250']);
  DATA_Temp.Append;
  DATA_Temp['Code'].AsString := 'WORK';
  DATA_Temp['Value'].AsString := 'short-lived';
  DATA_Temp.Post;
  Value := DATA_Temp.RecordCount;
end;
```

### Usage

**Conventional VxData context**

`DATA_Temp` has no stable VxData table or field contract. Current product helpers reuse the same object for mutually incompatible results, including a Source description lookup, a Shipment Status description lookup, Party Interface existence checks and last-run time retrieval.

This convention guides queries and field names; it is not a runtime schema contract. Custom SQL, configuration and customer extensions may return a different subset, aliases or additional columns. Use `FindField` for optional fields and validate types at the integration boundary.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Navigation, filtering, indexing and edits mutate the shared object. Closing or recreating it invalidates retained fields, bookmarks and record positions.
- `Post` updates the client dataset; it does not prove an external database write or transaction commit. Persistence belongs to the function or SQL used for that purpose.
- Data helpers commonly catch and log SQL or creation failures, potentially leaving the object inactive or reset. Invalid field, conversion and dataset-state operations can still raise.
- Action cleanup closes friendly datasets. Velox owns the object; scripts must not free it or rely on its records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not pass the reference to asynchronous work or allow nested code to reposition it without an explicit contract.

### Additional Technical Info
`DATA_Temp` is an action-owned friendly dataset intended for the role described below. It is a live `TvxClientDataSet` reference; its name does not load data, select a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_Temp` to `TvxActionMan.FData47`. Its diagnostic dataset name is `DATA_Temp`.

The dataset begins inactive and without fields. `CreateData`, Data query helpers and load methods can each replace its schema and records. Every script using the action observes the same live cursor, filters, indexes and edits until it is closed or repopulated.

**Implementation and naming cautions**

Treat this dataset as volatile scratch state. A helper called directly or by nested script code can close, recreate, repopulate or reposition it without mentioning `DATA_Temp` in the public call. Copy required scalar values immediately and never retain fields or rows across helper calls.

The friendly suffix does not validate record type, authenticate a user or party, enforce application/tenant scope, apply foreign keys or prevent reuse for unrelated data.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA1`](DATA1.md) is a better general-purpose workspace when nested helper reuse would be unsafe.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
