---
title: "DATA_Product"
description: "Provides the friendly dataset conventionally used for VxData product-master working data."
sidebar_position: 59
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - product
---

```Delphi
DATA_Product: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_Product, ['Code,string,100', 'Description,string,100', 'Uom,string,20', 'UomUnits,integer']);
  DATA_Product.Append;
  DATA_Product['Code'].AsString := 'PRODUCT-001';
  DATA_Product['Description'].AsString := 'Example Product';
  DATA_Product['Uom'].AsString := 'EA';
  DATA_Product['UomUnits'].AsInteger := 1;
  DATA_Product.Post;
  Value := DATA_Product.RecordCount;
end;
```

### Usage

`DATA_Product` provides the friendly dataset conventionally used for VxData product-master working data.

**Conventional VxData context**

The current `Product` table contains application/owner scope; codes, GTINs and descriptions; activity/status and availability; UOM and dimensions; stock/batch/serial/expiry/catch-weight flags; temperature/freight and high-precision unit price/cost; validity/synchronisation, hash and audit fields. Current helpers explicitly query it by application, code, number or party-specific `Product_Party` mapping.

That convention is guidance for choosing queries and field names, not a guarantee. A configured source/destination or customer extension may expose a different subset or additional columns. Use `FindField` for optional columns and never assume a named field merely because this page describes the current base schema.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Field access, navigation, filtering, indexing, inserts, edits, posts and deletes mutate this shared object. Closing or recreating it invalidates retained fields and record positions.
- `Post` updates the client dataset; it is not proof of an external database write or transaction commit. SQL or file effects belong to the function used to populate or persist it.
- Data helper functions generally catch and log SQL or creation failures, potentially leaving the object inactive or reset. Direct invalid field, conversion or dataset-state operations can raise.
- Action cleanup closes every friendly dataset. Velox owns the object; never free it or depend on records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not hand the reference to asynchronous work or let nested code reposition it without an explicit contract.

**Alias and naming cautions**

A product row does not prove stock availability, ownership or that partner codes match. Check application/owner scope and use `DATA_ProductQty`, UOM and party mappings explicitly where needed.

The friendly suffix never validates record type, authenticates a party or application, enforces foreign keys or prevents the dataset being reused for unrelated data.

### Additional Technical Info
`DATA_Product` is the friendly dataset conventionally used while resolving or mapping a product master. It is a live `TvxClientDataSet` reference; its name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_Product` to `TvxActionMan.FData18`. Its diagnostic dataset name is `DATA_Product`.

The dataset begins inactive and without fields. `CreateData`, the Data query helpers and load methods can each replace its current schema and records. Every script using this action sees the same live cursor, filters, indexes and edits until the dataset is closed or repopulated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA_ProductQty`](DATA_ProductQty.md) is an independent product/location quantity dataset.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
