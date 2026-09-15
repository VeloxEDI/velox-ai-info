---
title: "DATA_SelfLine"
description: "Provides an independent general-purpose line workspace associated by convention with DATA_Self."
sidebar_position: 69
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - self-line
---

```Delphi
DATA_SelfLine: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_SelfLine, ['ParentCode,string,100', 'LineNo,integer', 'Description,string,200']);
  DATA_SelfLine.Append;
  DATA_SelfLine['ParentCode'].AsString := 'SELF-001';
  DATA_SelfLine['LineNo'].AsInteger := 1;
  DATA_SelfLine['Description'].AsString := 'Fictional line';
  DATA_SelfLine.Post;
  Value := DATA_SelfLine.RecordCount;
end;
```

### Usage

`DATA_SelfLine` provides an independent general-purpose line workspace associated by convention with DATA_Self.

**Naming boundary**

The name supplies no parent key, table, schema, master/detail link or cursor synchronisation. Any relationship to `DATA_Self` must be created by the flow's explicit fields, query or processing loop.

That convention is guidance for choosing queries and field names, not a guarantee. A configured source/destination or customer extension may expose a different subset or additional columns. Use `FindField` for optional columns and never assume a named field merely because this page describes the current base schema.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Field access, navigation, filtering, indexing, inserts, edits, posts and deletes mutate this shared object. Closing or recreating it invalidates retained fields and record positions.
- `Post` updates the client dataset; it is not proof of an external database write or transaction commit. SQL or file effects belong to the function used to populate or persist it.
- Data helper functions generally catch and log SQL or creation failures, potentially leaving the object inactive or reset. Direct invalid field, conversion or dataset-state operations can raise.
- Action cleanup closes every friendly dataset. Velox owns the object; never free it or depend on records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not hand the reference to asynchronous work or let nested code reposition it without an explicit contract.

**Alias and naming cautions**

Moving `DATA_Self` never positions this dataset and closing either one does not close the other. Preserve a stable parent key when multiple header rows or nested calls are possible.

The friendly suffix never validates record type, authenticates a party or application, enforces foreign keys or prevents the dataset being reused for unrelated data.

### Additional Technical Info
`DATA_SelfLine` is an independent dataset conventionally used for line rows related to a flow-defined `DATA_Self` entity. It is a live `TvxClientDataSet` reference; its name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_SelfLine` to `TvxActionMan.FData8`. Its diagnostic dataset name is `DATA_SelfLine`.

The dataset begins inactive and without fields. `CreateData`, the Data query helpers and load methods can each replace its current schema and records. Every script using this action sees the same live cursor, filters, indexes and edits until the dataset is closed or repopulated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA_Self`](DATA_Self.md) is a separate conventionally related workspace.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
