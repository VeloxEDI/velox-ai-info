---
title: "DATA_PreAdvice"
description: "Provides the friendly dataset conventionally used for pre-advice transport transaction working data."
sidebar_position: 57
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - pre-advice
---

```Delphi
DATA_PreAdvice: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_PreAdvice, ['Code,string,100', 'BookingNo,string,50', 'VoyageNo,string,50', 'Qty,double']);
  DATA_PreAdvice.Append;
  DATA_PreAdvice['Code'].AsString := 'PREADVICE-001';
  DATA_PreAdvice['BookingNo'].AsString := 'BOOKING-001';
  DATA_PreAdvice['VoyageNo'].AsString := 'VOYAGE-001';
  DATA_PreAdvice['Qty'].AsFloat := 10;
  DATA_PreAdvice.Post;
  Value := DATA_PreAdvice.RecordCount;
end;
```

### Usage

`DATA_PreAdvice` provides the friendly dataset conventionally used for pre-advice transport transaction working data.

**Conventional VxData context**

The current `PreAdvice` table contains interchange/partner/application and party references; voyage and three port roles; transaction and transport/container identifiers; product/commodity, quantity/weight/cubic and dangerous-goods data; verification, power/temperature fields; revision/status, hashes and audit dates. Every related row remains an explicit query/join concern.

That convention is guidance for choosing queries and field names, not a guarantee. A configured source/destination or customer extension may expose a different subset or additional columns. Use `FindField` for optional columns and never assume a named field merely because this page describes the current base schema.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Field access, navigation, filtering, indexing, inserts, edits, posts and deletes mutate this shared object. Closing or recreating it invalidates retained fields and record positions.
- `Post` updates the client dataset; it is not proof of an external database write or transaction commit. SQL or file effects belong to the function used to populate or persist it.
- Data helper functions generally catch and log SQL or creation failures, potentially leaving the object inactive or reset. Direct invalid field, conversion or dataset-state operations can raise.
- Action cleanup closes every friendly dataset. Velox owns the object; never free it or depend on records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not hand the reference to asynchronous work or let nested code reposition it without an explicit contract.

**Alias and naming cautions**

The broad schema mixes identifiers, operational measurements and reference keys. Preserve units, temperature/date semantics and party/port roles explicitly; a populated client row does not reserve transport capacity or persist an advice.

The friendly suffix never validates record type, authenticates a party or application, enforces foreign keys or prevents the dataset being reused for unrelated data.

### Additional Technical Info
`DATA_PreAdvice` is the friendly dataset conventionally used for pre-advice transaction rows. It is a live `TvxClientDataSet` reference; its name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_PreAdvice` to `TvxActionMan.FData62`. Its diagnostic dataset name is `DATA_PreAdvice`.

The dataset begins inactive and without fields. `CreateData`, the Data query helpers and load methods can each replace its current schema and records. Every script using this action sees the same live cursor, filters, indexes and edits until the dataset is closed or repopulated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
