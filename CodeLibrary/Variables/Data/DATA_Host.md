---
title: "DATA_Host"
description: "Provides a host-oriented alias for the exact same live dataset object as DATA_Application."
sidebar_position: 35
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - host
---

```Delphi
DATA_Host: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_Application, ['Code,string,100', 'Description,string,100']);
  DATA_Application.Append;
  DATA_Application['Code'].AsString := 'APP-001';
  DATA_Application['Description'].AsString := 'Example Application';
  DATA_Application.Post;
  Value := DATA_Host.RecordCount;
end;
```

### Usage

`DATA_Host` provides a host-oriented alias for the exact same live dataset object as DATA_Application.

**Alias and conventional context**

The shared object's current convention is the VxData `Application` definition, including configured application identifiers and defaults. The alias neither reads operating-system host identity nor selects a separate host table. A flow needing machine or process information must use the appropriate configuration/runtime values instead.

That convention is guidance for choosing queries and field names, not a guarantee. A configured source/destination or customer extension may expose a different subset or additional columns. Use `FindField` for optional columns and never assume a named field merely because this page describes the current base schema.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Field access, navigation, filtering, indexing, inserts, edits, posts and deletes mutate this shared object. Closing or recreating it invalidates retained fields and record positions.
- `Post` updates the client dataset; it is not proof of an external database write or transaction commit. SQL or file effects belong to the function used to populate or persist it.
- Data helper functions generally catch and log SQL or creation failures, potentially leaving the object inactive or reset. Direct invalid field, conversion or dataset-state operations can raise.
- Action cleanup closes every friendly dataset. Velox owns the object; never free it or depend on records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not hand the reference to asynchronous work or let nested code reposition it without an explicit contract.

**Alias and naming cautions**

All cursor, schema, query, close and edit effects are shared with `DATA_Application`. Application data is configuration context, not proof of authorisation or of the process's physical host.

The friendly suffix never validates record type, authenticates a party or application, enforces foreign keys or prevents the dataset being reused for unrelated data.

### Additional Technical Info
`DATA_Host` is a compatibility name for the exact live dataset exposed as `DATA_Application`; it does not represent the Windows host machine. It is a live `TvxClientDataSet` reference; its name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox binds `DATA_Host` and `DATA_Application` to the same `TvxActionMan.FData38` instance. The object is constructed once with the diagnostic dataset name `DATA_Application`; errors or logs produced below the alias can therefore name `DATA_Application`.

The dataset begins inactive and without fields. `CreateData`, the Data query helpers and load methods can each replace its current schema and records. Every script using this action sees the same live cursor, filters, indexes and edits until the dataset is closed or repopulated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA_Application`](DATA_Application.md) is the primary name for this exact object.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
