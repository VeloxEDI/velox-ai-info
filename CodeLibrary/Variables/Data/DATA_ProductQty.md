---
title: "DATA_ProductQty"
description: "Provides the friendly dataset conventionally used for product quantity by party, batch and status working data."
sidebar_position: 60
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - product-quantity
---

```Delphi
DATA_ProductQty: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_ProductQty, ['ProductNum,integer', 'PartyNum,integer', 'Qty,double', 'BatchCode,string,50', 'Status,string,50']);
  DATA_ProductQty.Append;
  DATA_ProductQty['ProductNum'].AsInteger := 1001;
  DATA_ProductQty['PartyNum'].AsInteger := 2001;
  DATA_ProductQty['Qty'].AsFloat := 25;
  DATA_ProductQty['BatchCode'].AsString := '';
  DATA_ProductQty['Status'].AsString := 'Available';
  DATA_ProductQty.Post;
  Value := DATA_ProductQty.RecordCount;
end;
```

### Usage

`DATA_ProductQty` provides the friendly dataset conventionally used for product quantity by party, batch and status working data.

**Conventional VxData context**

The current `Product_Qty` table requires product and Party references and stores quantity, batch code, expiry, status, row hash and audit dates. It has a composite uniqueness constraint on product/party/batch/status; the schema comment expects a location-type Party in normal use. Product and Party deletes cascade to these database rows.

That convention is guidance for choosing queries and field names, not a guarantee. A configured source/destination or customer extension may expose a different subset or additional columns. Use `FindField` for optional columns and never assume a named field merely because this page describes the current base schema.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Field access, navigation, filtering, indexing, inserts, edits, posts and deletes mutate this shared object. Closing or recreating it invalidates retained fields and record positions.
- `Post` updates the client dataset; it is not proof of an external database write or transaction commit. SQL or file effects belong to the function used to populate or persist it.
- Data helper functions generally catch and log SQL or creation failures, potentially leaving the object inactive or reset. Direct invalid field, conversion or dataset-state operations can raise.
- Action cleanup closes every friendly dataset. Velox owns the object; never free it or depend on records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not hand the reference to asynchronous work or let nested code reposition it without an explicit contract.

**Alias and naming cautions**

Client rows do not enforce the database uniqueness, Party type or cascade rules. Quantity units come from the product/UOM contract, and empty batch/status values participate in the current database key.

The friendly suffix never validates record type, authenticates a party or application, enforces foreign keys or prevents the dataset being reused for unrelated data.

### Additional Technical Info
`DATA_ProductQty` is the friendly dataset conventionally used for product quantity records. It is a live `TvxClientDataSet` reference; its name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_ProductQty` to `TvxActionMan.FData19`. Its diagnostic dataset name is `DATA_ProductQty`.

The dataset begins inactive and without fields. `CreateData`, the Data query helpers and load methods can each replace its current schema and records. Every script using this action sees the same live cursor, filters, indexes and edits until the dataset is closed or repopulated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA_Product`](DATA_Product.md) is the independent product-master dataset.
- [`DATA_Location`](DATA_Location.md) is commonly used for location Party data.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
