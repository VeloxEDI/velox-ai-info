---
title: "DATA_Voyage"
description: "Provides the friendly dataset conventionally used for VxData voyage working data."
sidebar_position: 91
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - voyage
---

```Delphi
DATA_Voyage: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_Voyage, ['Code,string,50', 'Description,string,100', 'VesselNum,integer', 'LoadPortNum,integer']);
  DATA_Voyage.Append;
  DATA_Voyage['Code'].AsString := 'VOYAGE-001';
  DATA_Voyage['Description'].AsString := 'Example voyage';
  DATA_Voyage['VesselNum'].AsInteger := 1001;
  DATA_Voyage['LoadPortNum'].AsInteger := 2001;
  DATA_Voyage.Post;
  Value := DATA_Voyage.RecordCount;
end;
```

### Usage

`DATA_Voyage` provides the friendly dataset conventionally used for VxData voyage working data.

**Conventional VxData context**

The current `Voyage` table is application scoped and can reference a vessel, agent and three ports. It stores code/description, ETA/ETD, copied vessel identifiers, validity, synchronisation and audit data.

This convention guides queries and field names; it is not a runtime schema contract. Custom SQL, configuration and customer extensions may return a different subset, aliases or additional columns. Use `FindField` for optional fields and validate types at the integration boundary.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Navigation, filtering, indexing and edits mutate the shared object. Closing or recreating it invalidates retained fields, bookmarks and record positions.
- `Post` updates the client dataset; it does not prove an external database write or transaction commit. Persistence belongs to the function or SQL used for that purpose.
- Data helpers commonly catch and log SQL or creation failures, potentially leaving the object inactive or reset. Invalid field, conversion and dataset-state operations can still raise.
- Action cleanup closes friendly datasets. Velox owns the object; scripts must not free it or rely on its records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not pass the reference to asynchronous work or allow nested code to reposition it without an explicit contract.

### Additional Technical Info
`DATA_Voyage` is an action-owned friendly dataset intended for the role described below. It is a live `TvxClientDataSet` reference; its name does not load data, select a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_Voyage` to `TvxActionMan.FData61`. Its diagnostic dataset name is `DATA_Voyage`.

The dataset begins inactive and without fields. `CreateData`, Data query helpers and load methods can each replace its schema and records. Every script using the action observes the same live cursor, filters, indexes and edits until it is closed or repopulated.

**Implementation and naming cautions**

Foreign-key numbers do not load related vessel, agent or port rows into this object. ETA/ETD require an explicit time-zone/precision contract, and copied vessel identifiers can become stale relative to the master.

The friendly suffix does not validate record type, authenticate a user or party, enforce application/tenant scope, apply foreign keys or prevent reuse for unrelated data.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA_Vessel`](DATA_Vessel.md) and [`DATA_Port`](DATA_Port.md) are independent workspaces; no automatic join or cursor synchronisation occurs.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
