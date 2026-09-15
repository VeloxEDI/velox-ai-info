---
title: "DATA_Tracking"
description: "Provides the friendly dataset conventionally used for VxData shipment-tracking events."
sidebar_position: 85
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - tracking
---

```Delphi
DATA_Tracking: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_Tracking, ['ShipmentHdrNum,integer', 'EventCode,string,50', 'EventDate,datetime', 'Location,string,250']);
  DATA_Tracking.Append;
  DATA_Tracking['ShipmentHdrNum'].AsInteger := 1001;
  DATA_Tracking['EventCode'].AsString := 'ARRIVED';
  DATA_Tracking['EventDate'].AsDateTime := Now;
  DATA_Tracking['Location'].AsString := 'Example depot';
  DATA_Tracking.Post;
  Value := DATA_Tracking.RecordCount;
end;
```

### Usage

`DATA_Tracking` provides the friendly dataset conventionally used for VxData shipment-tracking events.

**Conventional VxData context**

The current `Shipment_Tracking` table requires a shipment-header reference and can reference tracking type, status, user and source. It stores code, event time and ETA, event code, location, latitude/longitude, vehicle, person, description, status, hashes and audit fields. Deleting the parent shipment currently cascades to database tracking rows.

This convention guides queries and field names; it is not a runtime schema contract. Custom SQL, configuration and customer extensions may return a different subset, aliases or additional columns. Use `FindField` for optional fields and validate types at the integration boundary.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Navigation, filtering, indexing and edits mutate the shared object. Closing or recreating it invalidates retained fields, bookmarks and record positions.
- `Post` updates the client dataset; it does not prove an external database write or transaction commit. Persistence belongs to the function or SQL used for that purpose.
- Data helpers commonly catch and log SQL or creation failures, potentially leaving the object inactive or reset. Invalid field, conversion and dataset-state operations can still raise.
- Action cleanup closes friendly datasets. Velox owns the object; scripts must not free it or rely on its records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not pass the reference to asynchronous work or allow nested code to reposition it without an explicit contract.

### Additional Technical Info
`DATA_Tracking` is an action-owned friendly dataset intended for the role described below. It is a live `TvxClientDataSet` reference; its name does not load data, select a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_Tracking` to `TvxActionMan.FData78`. Its diagnostic dataset name is `DATA_Tracking`.

The dataset begins inactive and without fields. `CreateData`, Data query helpers and load methods can each replace its schema and records. Every script using the action observes the same live cursor, filters, indexes and edits until it is closed or repopulated.

**Implementation and naming cautions**

An event is source-reported operational data, not guaranteed real-time position, proof of delivery or verified identity. Preserve source and event-time semantics, define time-zone handling, validate coordinate representation and avoid exposing personal or vehicle details unnecessarily.

The friendly suffix does not validate record type, authenticate a user or party, enforce application/tenant scope, apply foreign keys or prevent reuse for unrelated data.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA_Shipment`](DATA_Shipment.md) is the independent shipment-header workspace.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
