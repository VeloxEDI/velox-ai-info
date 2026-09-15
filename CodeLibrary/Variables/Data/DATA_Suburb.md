---
title: "DATA_Suburb"
description: "Provides the friendly dataset conventionally used for application-scoped suburb reference and mapping data."
sidebar_position: 79
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - suburb
---

```Delphi
DATA_Suburb: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_Suburb, ['Code,string,100', 'Suburb,string,100', 'PostCode,string,20', 'CityNum,integer']);
  DATA_Suburb.Append;
  DATA_Suburb['Code'].AsString := 'SUBURB-001';
  DATA_Suburb['Suburb'].AsString := 'Example Suburb';
  DATA_Suburb['PostCode'].AsString := '0000';
  DATA_Suburb['CityNum'].AsInteger := 1;
  DATA_Suburb.Post;
  Value := DATA_Suburb.RecordCount;
end;
```

### Usage

`DATA_Suburb` provides the friendly dataset conventionally used for application-scoped suburb reference and mapping data.

**Conventional VxData context**

The current `Suburb` table is application-scoped and can reference region, zone and city; it contains code, suburb, postcode, hash and audit fields. Product helpers explicitly query it and sometimes join `Suburb_Map` for external text matching. The mapping table is not loaded automatically.

That convention is guidance for choosing queries and field names, not a guarantee. A configured source/destination or customer extension may expose a different subset or additional columns. Use `FindField` for optional columns and never assume a named field merely because this page describes the current base schema.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Field access, navigation, filtering, indexing, inserts, edits, posts and deletes mutate this shared object. Closing or recreating it invalidates retained fields and record positions.
- `Post` updates the client dataset; it is not proof of an external database write or transaction commit. SQL or file effects belong to the function used to populate or persist it.
- Data helper functions generally catch and log SQL or creation failures, potentially leaving the object inactive or reset. Direct invalid field, conversion or dataset-state operations can raise.
- Action cleanup closes every friendly dataset. Velox owns the object; never free it or depend on records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not hand the reference to asynchronous work or let nested code reposition it without an explicit contract.

**Alias and naming cautions**

Suburb/city strings and postcodes are not globally unique and helper matching can be configured/permissive. Preserve application and geographic scope and inspect the actual query before relying on returned cardinality.

The friendly suffix never validates record type, authenticates a party or application, enforces foreign keys or prevents the dataset being reused for unrelated data.

### Additional Technical Info
`DATA_Suburb` is the friendly dataset conventionally used for suburb reference rows and explicit suburb-map lookup results. It is a live `TvxClientDataSet` reference; its name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_Suburb` to `TvxActionMan.FData42`. Its diagnostic dataset name is `DATA_Suburb`.

The dataset begins inactive and without fields. `CreateData`, the Data query helpers and load methods can each replace its current schema and records. Every script using this action sees the same live cursor, filters, indexes and edits until the dataset is closed or repopulated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
