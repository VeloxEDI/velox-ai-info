---
title: "DATA_OrderConsignee"
description: "Provides the friendly dataset conventionally used for order-level consignee and ship-to working data."
sidebar_position: 45
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - order-consignee
---

```Delphi
DATA_OrderConsignee: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_OrderConsignee, ['Code,string,100', 'OrderNo,string,50', 'ShipToName,string,100']);
  DATA_OrderConsignee.Append;
  DATA_OrderConsignee['Code'].AsString := 'CONSIGNEE-001';
  DATA_OrderConsignee['OrderNo'].AsString := 'EXAMPLE-001';
  DATA_OrderConsignee['ShipToName'].AsString := 'Example Destination';
  DATA_OrderConsignee.Post;
  Value := DATA_OrderConsignee.RecordCount;
end;
```

### Usage

`DATA_OrderConsignee` provides the friendly dataset conventionally used for order-level consignee and ship-to working data.

**Conventional VxData context**

The current `Order_Consignee` table requires `OrderHdrNum`, can reference status and consignee Party rows, and contains code/order number, ship-to address/suburb and copied ship-to details, instructions, revision/status, hash and audit fields. The required database header relationship exists only when the populated schema and persistence path use that table.

That convention is guidance for choosing queries and field names, not a guarantee. A configured source/destination or customer extension may expose a different subset or additional columns. Use `FindField` for optional columns and never assume a named field merely because this page describes the current base schema.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Field access, navigation, filtering, indexing, inserts, edits, posts and deletes mutate this shared object. Closing or recreating it invalidates retained fields and record positions.
- `Post` updates the client dataset; it is not proof of an external database write or transaction commit. SQL or file effects belong to the function used to populate or persist it.
- Data helper functions generally catch and log SQL or creation failures, potentially leaving the object inactive or reset. Direct invalid field, conversion or dataset-state operations can raise.
- Action cleanup closes every friendly dataset. Velox owns the object; never free it or depend on records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not hand the reference to asynchronous work or let nested code reposition it without an explicit contract.

**Alias and naming cautions**

This object is separate from both the order header and line-consignee allocation datasets. Establish keys and cursor coordination explicitly; moving one dataset never positions another.

The friendly suffix never validates record type, authenticates a party or application, enforces foreign keys or prevents the dataset being reused for unrelated data.

### Additional Technical Info
`DATA_OrderConsignee` is the friendly dataset conventionally used for order-level consignee allocations and ship-to details. It is a live `TvxClientDataSet` reference; its name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_OrderConsignee` to `TvxActionMan.FData70`. Its diagnostic dataset name is `DATA_OrderConsignee`.

The dataset begins inactive and without fields. `CreateData`, the Data query helpers and load methods can each replace its current schema and records. Every script using this action sees the same live cursor, filters, indexes and edits until the dataset is closed or repopulated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA_Order`](DATA_Order.md) is the independent header dataset.
- [`DATA_OrderLineConsignee`](DATA_OrderLineConsignee.md) represents line-level allocation rows.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
