---
title: "DATA_CustomerBill"
description: "Provides a billing-oriented alias for the exact same live dataset object as DATA_Customer."
sidebar_position: 29
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - billing
---

```Delphi
DATA_CustomerBill: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_Customer, ['Code,string,100', 'Name,string,100']);
  DATA_Customer.Append;
  DATA_Customer['Code'].AsString := 'CUSTOMER-001';
  DATA_Customer['Name'].AsString := 'Example Billing Customer';
  DATA_Customer.Post;
  Value := DATA_CustomerBill.RecordCount;
end;
```

### Usage

`DATA_CustomerBill` provides a billing-oriented alias for the exact same live dataset object as DATA_Customer.

**Alias and conventional context**

Current customer helpers and VxData conventions described for `DATA_Customer` still apply. The alias does not select billing-address columns, create a BillTo party, copy records or protect the primary cursor. If a flow needs a distinct billing projection, use another dataset object or deliberately materialise separate data.

That convention is guidance for choosing queries and field names, not a guarantee. A configured source/destination or customer extension may expose a different subset or additional columns. Use `FindField` for optional columns and never assume a named field merely because this page describes the current base schema.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Field access, navigation, filtering, indexing, inserts, edits, posts and deletes mutate this shared object. Closing or recreating it invalidates retained fields and record positions.
- `Post` updates the client dataset; it is not proof of an external database write or transaction commit. SQL or file effects belong to the function used to populate or persist it.
- Data helper functions generally catch and log SQL or creation failures, potentially leaving the object inactive or reset. Direct invalid field, conversion or dataset-state operations can raise.
- Action cleanup closes every friendly dataset. Velox owns the object; never free it or depend on records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not hand the reference to asynchronous work or let nested code reposition it without an explicit contract.

**Alias and naming cautions**

Creating, querying or closing `DATA_CustomerBill` changes `DATA_Customer` immediately. Error and diagnostic text can use the primary object's `DATA_Customer` dataset name, which is expected alias behaviour.

The friendly suffix never validates record type, authenticates a party or application, enforces foreign keys or prevents the dataset being reused for unrelated data.

### Additional Technical Info
`DATA_CustomerBill` is a compatibility name for the exact live dataset exposed as `DATA_Customer`; it does not allocate a billing-specific object. It is a live `TvxClientDataSet` reference; its name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox binds `DATA_CustomerBill` and `DATA_Customer` to the same `TvxActionMan.FData14` instance. The object is constructed once with the diagnostic dataset name `DATA_Customer`; errors or logs produced below the alias can therefore name `DATA_Customer`.

The dataset begins inactive and without fields. `CreateData`, the Data query helpers and load methods can each replace its current schema and records. Every script using this action sees the same live cursor, filters, indexes and edits until the dataset is closed or repopulated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA_Customer`](DATA_Customer.md) is the primary name for this exact object.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
