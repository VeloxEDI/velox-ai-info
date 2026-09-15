---
title: "DATA_ASNLine"
description: "Provides the friendly dataset conventionally used for advance shipping notice line working data."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - asn-line
---

```Delphi
DATA_ASNLine: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_ASNLine, ['ProductCode,string,100', 'GTIN,string,14', 'Qty,double']);
  DATA_ASNLine.Append;
  DATA_ASNLine['ProductCode'].AsString := 'ITEM-001';
  DATA_ASNLine['Qty'].AsFloat := 3;
  DATA_ASNLine.Post;
  Value := DATA_ASNLine.RecordCount;
end;
```

### Usage

`DATA_ASNLine` provides the friendly dataset conventionally used for advance shipping notice line working data.

**Conventional VxData context**

The current VxData `ASN_Line` convention links a line to header, consignee and package records, optionally links an order line/product, and stores item, batch, UOM, quantity, dimensions, revision/status/hash and audit data. None of those relations is created by the variable. `DATA_ASNINL` is an exact alias of this object.

That convention is guidance for choosing queries and field names, not a guarantee. A configured source/destination or customer extension may expose a different subset or additional columns. Use `FindField` for optional columns and never assume a named field merely because this page describes the current base schema.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Field access, navigation, filtering, indexing, inserts, edits, posts and deletes mutate this shared object. Closing or recreating it invalidates retained fields and record positions.
- `Post` updates the client dataset; it is not proof of an external database write or transaction commit. SQL/file effects belong to the function used to populate or persist it.
- Data helper functions generally catch and log SQL/creation failures, potentially leaving the object inactive or reset. Direct invalid field, conversion or dataset-state operations can raise.
- Action cleanup closes every friendly dataset. Velox owns the object; never free it or depend on records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not hand the reference to asynchronous work or let nested code reposition it without an explicit contract.

**Alias and naming cautions**

The friendly suffix communicates intended use only. It does not validate record type, authenticate a party/application, enforce foreign keys or protect the dataset from being reused for unrelated data.

### Additional Technical Info
`DATA_ASNLine` is the friendly dataset conventionally used for advance shipping notice line data. It is a live `TvxClientDataSet` reference; the friendly name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_ASNLine` to `TvxActionMan.FData22`. Its diagnostic dataset name is `DATA_ASNLine`.

The dataset begins inactive and without fields. `CreateData`, the Data query helpers and load methods can each replace its current schema/records. All scripts using this action see the same live cursor, filters, indexes and edits until the dataset is closed or repopulated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA_ASNINL`](DATA_ASNINL.md) is the exact alias.
- [`DATA_ASN`](DATA_ASN.md), [`DATA_ASNConsignee`](DATA_ASNConsignee.md) and [`DATA_ASNPackage`](DATA_ASNPackage.md) are separate objects.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor/edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
