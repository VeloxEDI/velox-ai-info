---
title: "DATA1"
description: "Provides the first of ten action-owned general-purpose mutable client datasets."
sidebar_position: 94
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - temporary-data
---

```Delphi
DATA1: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA1, ['Code,string,40', 'Quantity,integer']);
  DATA1.Append;
  DATA1['Code'].AsString := 'SAMPLE-001';
  DATA1['Quantity'].AsInteger := 2;
  DATA1.Post;
  Value := DATA1.RecordCount;
end;
```

### Usage

`DATA1` provides the first of ten action-owned general-purpose mutable client datasets.

**Behaviour and use**

- Use `Active`, `Empty`/`NotEmpty`, `First`, `Next`, `EOF`, `RecordCount` and field access only after establishing the dataset's schema and contents.
- `DATA1['Name']` uses Velox's default `FieldName` property. A missing field raises `EDatabaseError` with `DATA1` added to the message. `FindField` is safer for optional columns.
- Cursor movement and edits are visible to every later script using this same object during the action. `Append`, `Edit`, `Post`, `DeleteAll`, filtering and indexing all mutate shared execution state.
- A successful in-memory `Post` is not proof that data was written or committed to a database. Persistence depends on the function and connection/transaction path used to populate or update the dataset.
- Data helper functions generally catch SQL/creation exceptions and log them, so a failed call can leave this dataset inactive or partly reset without raising into the script. Direct dataset methods can raise normally.

### Additional Technical Info
`DATA1` is an independent, host-owned `TvxClientDataSet` available as general working storage in the current action. Its number is only a name: it has no automatic schema, table, query, business meaning or relationship to the other `DATA` variables.

The reference is always bound to `TvxActionMan.FData1` when the scripter receives an action. The object is constructed with the action and reused by scripts that execute against that action; scripts must not replace or free it.

**Implementation and lifecycle**

The dataset starts inactive and unstructured. `CreateData` can replace it with an empty in-memory schema; `GetData`, `GetConfig`, the source/destination query functions and file-loading methods can replace its schema and records again. None of those operations is implied by reading `DATA1`.

Velox configures the underlying client dataset to preserve string whitespace, disable automatic calculated fields and constraints, avoid fetch-on-demand, and request all rows. In the default non-edit mode, opening from SQL copies the provider result into the client dataset, disables change logging, detaches the provider and closes the server-side dataset. The current records and cursor then live in memory.

At action cleanup Velox sets every action-owned dataset inactive. The object remains owned by the action, but its open records do not form cross-execution storage. SQL connection-user cleanup is managed separately by the Velox connection layer.

**Edge cases and quirks**

- `DATA1` through `DATA10` are ten named objects, not an array; numeric syntax cannot select one dynamically.
- Reusing the variable replaces or mutates its prior schema, command, connection and cursor state. Close/reset it deliberately before giving it a different role.
- Loading a large query materialises all returned rows and can consume substantial memory. Repeated `FieldByName` lookups and conversions add work in large loops.
- The dataset and its cursor are mutable and not thread-safe. Do not retain field references across a close, schema replacement or later query.
- File load/save methods perform real filesystem I/O; SQL helper functions can read external databases or begin transactions. The variable itself performs no I/O until such a method is called.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates a controlled in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) populate a dataset from SQL.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed dataset class.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) describes the Delphi in-memory client dataset inherited by Velox.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and dataset model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) is useful dialect-compatibility context; Velox uses Delphi's implementation and its own descendant.

<small>Created 2026-07-15</small>
