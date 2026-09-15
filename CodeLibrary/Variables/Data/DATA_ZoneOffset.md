---
title: "DATA_ZoneOffset"
description: "Provides a friendly general-purpose dataset convention for configured zone-offset working data."
sidebar_position: 93
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - zone-offset
---

```Delphi
DATA_ZoneOffset: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_ZoneOffset, ['ZoneCode,string,50', 'OffsetMinutes,integer', 'Description,string,100']);
  DATA_ZoneOffset.Append;
  DATA_ZoneOffset['ZoneCode'].AsString := 'EXAMPLE';
  DATA_ZoneOffset['OffsetMinutes'].AsInteger := 720;
  DATA_ZoneOffset['Description'].AsString := 'Example fixed offset';
  DATA_ZoneOffset.Post;
  Value := DATA_ZoneOffset.RecordCount;
end;
```

### Usage

`DATA_ZoneOffset` provides a friendly general-purpose dataset convention for configured zone-offset working data.

**Conventional VxData context**

No single current base table or built-in time-zone schema is bound to this public name. A script or configured query must define whether an offset is minutes, hours, text, effective-dated data or another representation.

This convention guides queries and field names; it is not a runtime schema contract. Custom SQL, configuration and customer extensions may return a different subset, aliases or additional columns. Use `FindField` for optional fields and validate types at the integration boundary.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Navigation, filtering, indexing and edits mutate the shared object. Closing or recreating it invalidates retained fields, bookmarks and record positions.
- `Post` updates the client dataset; it does not prove an external database write or transaction commit. Persistence belongs to the function or SQL used for that purpose.
- Data helpers commonly catch and log SQL or creation failures, potentially leaving the object inactive or reset. Invalid field, conversion and dataset-state operations can still raise.
- Action cleanup closes friendly datasets. Velox owns the object; scripts must not free it or rely on its records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not pass the reference to asynchronous work or allow nested code to reposition it without an explicit contract.

### Additional Technical Info
`DATA_ZoneOffset` is an action-owned friendly dataset intended for the role described below. It is a live `TvxClientDataSet` reference; its name does not load data, select a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_ZoneOffset` to `TvxActionMan.FData93`. Its diagnostic dataset name is `DATA_ZoneOffset`.

The dataset begins inactive and without fields. `CreateData`, Data query helpers and load methods can each replace its schema and records. Every script using the action observes the same live cursor, filters, indexes and edits until it is closed or repopulated.

**Implementation and naming cautions**

A fixed UTC offset is not a civil time-zone definition: daylight-saving changes, historical transitions and ambiguous/non-existent local times require a named-zone and effective-date policy. Never infer units or sign convention from the field name alone.

The friendly suffix does not validate record type, authenticate a user or party, enforce application/tenant scope, apply foreign keys or prevent reuse for unrelated data.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA_Zone`](DATA_Zone.md) is a separate geographic/business-zone workspace and does not establish a time-zone relation.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
