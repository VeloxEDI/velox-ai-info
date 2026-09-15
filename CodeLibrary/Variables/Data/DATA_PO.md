---
title: "DATA_PO"
description: "Provides a purchase-order-oriented alias for the exact same live dataset object as DATA_Order."
sidebar_position: 53
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - purchase-order
---

```Delphi
DATA_PO: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_Order, ['Code,string,100', 'OrderNo,string,50']);
  DATA_Order.Append;
  DATA_Order['Code'].AsString := 'PO-001';
  DATA_Order['OrderNo'].AsString := 'EXAMPLE-PO-001';
  DATA_Order.Post;
  Value := DATA_PO.RecordCount;
end;
```

### Usage

`DATA_PO` provides a purchase-order-oriented alias for the exact same live dataset object as DATA_Order.

**Alias and conventional context**

The shared object's current convention is the `Order_Hdr` transaction shape. The alias does not set `TypeNum`, validate that a row is a purchase order, create a copy or isolate it from `DATA_Order` and the later `DATA_SO` name.

That convention is guidance for choosing queries and field names, not a guarantee. A configured source/destination or customer extension may expose a different subset or additional columns. Use `FindField` for optional columns and never assume a named field merely because this page describes the current base schema.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Field access, navigation, filtering, indexing, inserts, edits, posts and deletes mutate this shared object. Closing or recreating it invalidates retained fields and record positions.
- `Post` updates the client dataset; it is not proof of an external database write or transaction commit. SQL or file effects belong to the function used to populate or persist it.
- Data helper functions generally catch and log SQL or creation failures, potentially leaving the object inactive or reset. Direct invalid field, conversion or dataset-state operations can raise.
- Action cleanup closes every friendly dataset. Velox owns the object; never free it or depend on records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not hand the reference to asynchronous work or let nested code reposition it without an explicit contract.

**Alias and naming cautions**

Creating, querying, filtering, moving or closing `DATA_PO` immediately changes `DATA_Order`. Diagnostic text can use the primary `DATA_Order` name. Test the actual order type rather than relying on the variable spelling.

The friendly suffix never validates record type, authenticates a party or application, enforces foreign keys or prevents the dataset being reused for unrelated data.

### Additional Technical Info
`DATA_PO` is a compatibility name for the exact live dataset exposed as `DATA_Order`; it does not allocate a purchase-order-specific object. It is a live `TvxClientDataSet` reference; its name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox binds `DATA_PO` and `DATA_Order` to the same `TvxActionMan.FData25` instance. The object is constructed once with diagnostic dataset name `DATA_Order`; lower-level errors or logs can therefore use the primary name.

The dataset begins inactive and without fields. `CreateData`, the Data query helpers and load methods can each replace its current schema and records. Every script using this action sees the same live cursor, filters, indexes and edits until the dataset is closed or repopulated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA_Order`](DATA_Order.md) is the primary name for this exact object.
- [`DATA_POL`](DATA_POL.md) is the corresponding line alias, but its object is separate from the header.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
