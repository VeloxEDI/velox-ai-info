---
title: "DATA_Consignor"
description: "Provides the friendly dataset conventionally used for consignor Party master and parent-specific code mapping data."
sidebar_position: 24
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - consignor
---

```Delphi
DATA_Consignor: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_Consignor, ['Code,string,100', 'Name,string,100', 'TypeNum,integer']);
  DATA_Consignor.Append;
  DATA_Consignor['Code'].AsString := 'CONSIGNOR-001';
  DATA_Consignor['Name'].AsString := 'Example Consignor';
  DATA_Consignor['TypeNum'].AsInteger := 3;
  DATA_Consignor.Post;
  Value := DATA_Consignor.RecordCount;
end;
```

### Usage

`DATA_Consignor` provides the friendly dataset conventionally used for consignor Party master and parent-specific code mapping data.

**Conventional VxData context**

Current helper functions load `Party` master rows for party type 3. `Party_Consignor` separately relates a parent customer or supplier (`ParentNum`) and a consignor `PartyNum` to `TheirCode`; its uniqueness is parent/party/code specific. The variable can hold either shape only through an explicit query or schema.

That convention is guidance for choosing queries and field names, not a guarantee. A configured source/destination or customer extension may expose a different subset or additional columns. Use `FindField` for optional columns and never assume a named field merely because this page describes the current base schema.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Field access, navigation, filtering, indexing, inserts, edits, posts and deletes mutate this shared object. Closing or recreating it invalidates retained fields and record positions.
- `Post` updates the client dataset; it is not proof of an external database write or transaction commit. SQL or file effects belong to the function used to populate or persist it.
- Data helper functions generally catch and log SQL or creation failures, potentially leaving the object inactive or reset. Direct invalid field, conversion or dataset-state operations can raise.
- Action cleanup closes every friendly dataset. Velox owns the object; never free it or depend on records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not hand the reference to asynchronous work or let nested code reposition it without an explicit contract.

**Alias and naming cautions**

`DATA_CustomerShip` is an exact alias of this object despite its customer-oriented name. A query, close, filter, cursor movement or edit through either identifier immediately affects the other.

The friendly suffix never validates record type, authenticates a party or application, enforces foreign keys or prevents the dataset being reused for unrelated data.

### Additional Technical Info
`DATA_Consignor` is the friendly dataset conventionally used while resolving or mapping a consignor party. It is a live `TvxClientDataSet` reference; its name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_Consignor` to `TvxActionMan.FData16`. Its diagnostic dataset name is `DATA_Consignor`.

The dataset begins inactive and without fields. `CreateData`, the Data query helpers and load methods can each replace its current schema and records. Every script using this action sees the same live cursor, filters, indexes and edits until the dataset is closed or repopulated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`DATA_CustomerShip`](DATA_CustomerShip.md) is the exact compatibility alias for this object.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
