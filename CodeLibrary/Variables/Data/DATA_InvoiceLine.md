---
title: "DATA_InvoiceLine"
description: "Provides the friendly dataset conventionally used for invoice-line working data."
sidebar_position: 39
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - invoice-line
---

```Delphi
DATA_InvoiceLine: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_InvoiceLine, ['LineNo,integer', 'ProductCode,string,100', 'Qty,double', 'UnitPrice,double']);
  DATA_InvoiceLine.Append;
  DATA_InvoiceLine['LineNo'].AsInteger := 1;
  DATA_InvoiceLine['ProductCode'].AsString := 'PRODUCT-001';
  DATA_InvoiceLine['Qty'].AsFloat := 2;
  DATA_InvoiceLine['UnitPrice'].AsFloat := 10.5;
  DATA_InvoiceLine.Post;
  Value := DATA_InvoiceLine.RecordCount;
end;
```

### Usage

`DATA_InvoiceLine` provides the friendly dataset conventionally used for invoice-line working data.

**Conventional VxData context**

The current `Invoice_Line` table requires `InvoiceHdrNum` and can reference an order line, location and product. It contains line/code/product identifiers, quantities, order/job references, discount, currency, tax, unit and extended monetary values, notes, revision/status, hash and audit dates. The required database header relationship applies only when the populated schema and persistence operation use that table.

That convention is guidance for choosing queries and field names, not a guarantee. A configured source/destination or customer extension may expose a different subset or additional columns. Use `FindField` for optional columns and never assume a named field merely because this page describes the current base schema.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Field access, navigation, filtering, indexing, inserts, edits, posts and deletes mutate this shared object. Closing or recreating it invalidates retained fields and record positions.
- `Post` updates the client dataset; it is not proof of an external database write or transaction commit. SQL or file effects belong to the function used to populate or persist it.
- Data helper functions generally catch and log SQL or creation failures, potentially leaving the object inactive or reset. Direct invalid field, conversion or dataset-state operations can raise.
- Action cleanup closes every friendly dataset. Velox owns the object; never free it or depend on records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not hand the reference to asynchronous work or let nested code reposition it without an explicit contract.

**Alias and naming cautions**

This is an independent object from `DATA_Invoice`; moving or filtering one does not position the other. Establish the header/line key and ordering explicitly, and preserve decimal precision when calculating quantities, prices or tax.

The friendly suffix never validates record type, authenticates a party or application, enforces foreign keys or prevents the dataset being reused for unrelated data.

### Additional Technical Info
`DATA_InvoiceLine` is the friendly dataset conventionally used for invoice line data. It is a live `TvxClientDataSet` reference; its name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_InvoiceLine` to `TvxActionMan.FData24`. Its diagnostic dataset name is `DATA_InvoiceLine`.

The dataset begins inactive and without fields. `CreateData`, the Data query helpers and load methods can each replace its current schema and records. Every script using this action sees the same live cursor, filters, indexes and edits until the dataset is closed or repopulated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA_Invoice`](DATA_Invoice.md) is the independent header working dataset.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
