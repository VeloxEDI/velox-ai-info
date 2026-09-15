---
title: "DATA_Order"
description: "Provides the friendly dataset conventionally used for order-header working data."
sidebar_position: 44
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - order
---

```Delphi
DATA_Order: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_Order, ['Code,string,100', 'OrderNo,string,50', 'CurrencyCode,string,3', 'TranTotal,double']);
  DATA_Order.Append;
  DATA_Order['Code'].AsString := 'ORDER-001';
  DATA_Order['OrderNo'].AsString := 'EXAMPLE-001';
  DATA_Order['CurrencyCode'].AsString := 'NZD';
  DATA_Order['TranTotal'].AsFloat := 125.5;
  DATA_Order.Post;
  Value := DATA_Order.RecordCount;
end;
```

### Usage

`DATA_Order` provides the friendly dataset conventionally used for order-header working data.

**Conventional VxData context**

The current `Order_Hdr` table contains partner/application/type/status and party references, transaction and delivery dates, order/job/booking identifiers, ship-from/contact details, currency and high-precision totals, verification, revision/status, hashes and audit dates. Consignees, lines, events and issues are separate tables and client objects.

That convention is guidance for choosing queries and field names, not a guarantee. A configured source/destination or customer extension may expose a different subset or additional columns. Use `FindField` for optional columns and never assume a named field merely because this page describes the current base schema.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Field access, navigation, filtering, indexing, inserts, edits, posts and deletes mutate this shared object. Closing or recreating it invalidates retained fields and record positions.
- `Post` updates the client dataset; it is not proof of an external database write or transaction commit. SQL or file effects belong to the function used to populate or persist it.
- Data helper functions generally catch and log SQL or creation failures, potentially leaving the object inactive or reset. Direct invalid field, conversion or dataset-state operations can raise.
- Action cleanup closes every friendly dataset. Velox owns the object; never free it or depend on records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not hand the reference to asynchronous work or let nested code reposition it without an explicit contract.

**Alias and naming cautions**

`DATA_PO` and the later `DATA_SO` are exact aliases. The alias name does not set `TypeNum`, validate purchase/sales direction or isolate cursor state. Transaction totals and dates require an explicit business and precision contract.

The friendly suffix never validates record type, authenticates a party or application, enforces foreign keys or prevents the dataset being reused for unrelated data.

### Additional Technical Info
`DATA_Order` is the friendly dataset conventionally used for order header data. It is a live `TvxClientDataSet` reference; its name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_Order` to `TvxActionMan.FData25`. Its diagnostic dataset name is `DATA_Order`.

The dataset begins inactive and without fields. `CreateData`, the Data query helpers and load methods can each replace its current schema and records. Every script using this action sees the same live cursor, filters, indexes and edits until the dataset is closed or repopulated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA_PO`](DATA_PO.md) is a purchase-order name for this exact object.
- [`DATA_OrderLine`](DATA_OrderLine.md) is an independent line dataset.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
