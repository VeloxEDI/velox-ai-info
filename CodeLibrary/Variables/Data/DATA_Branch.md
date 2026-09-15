---
title: "DATA_Branch"
description: "Provides an alternate branch name for the exact same dataset object as DATA_Location."
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - branch
---

```Delphi
DATA_Branch: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_Location, ['TheirCode,string,255', 'PartyNum,integer']);
  DATA_Location.Append;
  DATA_Location['TheirCode'].AsString := 'BRANCH-001';
  DATA_Location['PartyNum'].AsInteger := 201;
  DATA_Location.Post;
  Value := DATA_Branch.RecordCount;
end;
```

### Usage

`DATA_Branch` provides an alternate branch name for the exact same dataset object as DATA_Location.

**Conventional VxData context**

`DATA_Branch` and `DATA_Location` are two names for the same dataset, so changes and cursor movement through either name affect the other. Error messages can refer to `DATA_Location`. In the usual VxData model, `Party_Location` maps partner-specific `TheirCode` values to a party; it is not automatically the complete branch or party master. Add any required master-data join explicitly.

That convention is guidance for choosing queries and field names, not a guarantee. A configured source/destination or customer extension may expose a different subset or additional columns. Use `FindField` for optional columns and never assume a named field merely because this page describes the current base schema.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Field access, navigation, filtering, indexing, inserts, edits, posts and deletes mutate this shared object. Closing or recreating it invalidates retained fields and record positions.
- `Post` updates the client dataset; it is not proof of an external database write or transaction commit. SQL/file effects belong to the function used to populate or persist it.
- Data helper functions generally catch and log SQL/creation failures, potentially leaving the object inactive or reset. Direct invalid field, conversion or dataset-state operations can raise.
- Action cleanup closes every friendly dataset. Velox owns the object; never free it or depend on records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not hand the reference to asynchronous work or let nested code reposition it without an explicit contract.

**Alias and naming cautions**

Because `DATA_Branch` and `DATA_Location` share object identity, a query, `CreateData`, `Close`, cursor move, filter or edit through either name immediately changes the other. Choose one name consistently within a script to make ownership and intent clear.

### Additional Technical Info
`DATA_Branch` is an alternate branch-oriented name for the current action's `DATA_Location` object. It is a live `TvxClientDataSet` reference; the friendly name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_Branch` to `TvxActionMan.FData12`. It is the exact same object as [`DATA_Location`](DATA_Location.md), not a copy or linked view.

The dataset begins inactive and without fields. `CreateData`, the Data query helpers and load methods can each replace its current schema/records. All scripts using this action see the same live cursor, filters, indexes and edits until the dataset is closed or repopulated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA_Location`](DATA_Location.md) is the primary friendly name for this object.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor/edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
