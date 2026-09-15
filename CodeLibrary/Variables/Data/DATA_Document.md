---
title: "DATA_Document"
description: "Provides a general friendly dataset for explicitly defined document metadata or document-row working data."
sidebar_position: 31
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - document
---

```Delphi
DATA_Document: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_Document, ['Code,string,100', 'FileName,string,255', 'Description,string,200']);
  DATA_Document.Append;
  DATA_Document['Code'].AsString := 'DOC-001';
  DATA_Document['FileName'].AsString := 'example.txt';
  DATA_Document['Description'].AsString := 'Fictional document metadata';
  DATA_Document.Post;
  Value := DATA_Document.RecordCount;
end;
```

### Usage

`DATA_Document` provides a general friendly dataset for explicitly defined document metadata or document-row working data.

**Naming boundary**

The current base VxData schema has transaction, event and file-related fields but no universal `Document` table bound to this name. The object can hold metadata, identifiers or a custom projection, but the identifier does not load file content, choose a storage system or establish a document lifecycle.

That convention is guidance for choosing queries and field names, not a guarantee. A configured source/destination or customer extension may expose a different subset or additional columns. Use `FindField` for optional columns and never assume a named field merely because this page describes the current base schema.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Field access, navigation, filtering, indexing, inserts, edits, posts and deletes mutate this shared object. Closing or recreating it invalidates retained fields and record positions.
- `Post` updates the client dataset; it is not proof of an external database write or transaction commit. SQL or file effects belong to the function used to populate or persist it.
- Data helper functions generally catch and log SQL or creation failures, potentially leaving the object inactive or reset. Direct invalid field, conversion or dataset-state operations can raise.
- Action cleanup closes every friendly dataset. Velox owns the object; never free it or depend on records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not hand the reference to asynchronous work or let nested code reposition it without an explicit contract.

**Alias and naming cautions**

Keep binary or large text payloads out of an ad hoc dataset unless the flow deliberately accounts for their memory cost. A document identifier or path is data only; validate access and ownership in the operation that consumes it.

The friendly suffix never validates record type, authenticates a party or application, enforces foreign keys or prevents the dataset being reused for unrelated data.

### Additional Technical Info
`DATA_Document` is a general friendly dataset for document-related rows whose schema and source are supplied explicitly by the current flow. It is a live `TvxClientDataSet` reference; its name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_Document` to `TvxActionMan.FData79`. Its diagnostic dataset name is `DATA_Document`.

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
