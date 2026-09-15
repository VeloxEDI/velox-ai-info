---
title: "DATA_ASN"
description: "Provides the friendly dataset conventionally used for advance shipping notice header working data."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - asn
---

```Delphi
DATA_ASN: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_ASN, ['ASNNo,string,50', 'OrderNo,string,50', 'Code,string,100']);
  DATA_ASN.Append;
  DATA_ASN['ASNNo'].AsString := 'ASN-001';
  DATA_ASN['OrderNo'].AsString := 'ORDER-001';
  DATA_ASN.Post;
  Value := DATA_ASN.RecordCount;
end;
```

### Usage

`DATA_ASN` provides the friendly dataset conventionally used for advance shipping notice header working data.

**Conventional VxData context**

The current VxData header convention is `ASN_Hdr`, with transaction/application/party/source references, identifiers and dates, shipping address/contact details, status/revision and audit data. Consignees, packages, lines, batches, events and issues are separate tables. `DATA_ASNIN` is an exact alternate name for this same runtime object.

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
`DATA_ASN` is the friendly dataset conventionally used for advance shipping notice header data. It is a live `TvxClientDataSet` reference; the friendly name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_ASN` to `TvxActionMan.FData21`. Its diagnostic dataset name is `DATA_ASN`.

The dataset begins inactive and without fields. `CreateData`, the Data query helpers and load methods can each replace its current schema/records. All scripts using this action see the same live cursor, filters, indexes and edits until the dataset is closed or repopulated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA_ASNIN`](DATA_ASNIN.md) is the exact alias.
- [`DATA_ASNConsignee`](DATA_ASNConsignee.md), [`DATA_ASNPackage`](DATA_ASNPackage.md) and [`DATA_ASNLine`](DATA_ASNLine.md) are distinct child working datasets.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor/edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
