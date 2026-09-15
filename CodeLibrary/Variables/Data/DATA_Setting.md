---
title: "DATA_Setting"
description: "Provides the friendly client dataset conventionally used for explicitly queried Setting rows."
sidebar_position: 72
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataset
  - setting
---

```Delphi
DATA_Setting: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA_Setting, ['Code,string,100', 'Description,string,255', 'Value,string,255', 'ValueType,string,20']);
  DATA_Setting.Append;
  DATA_Setting['Code'].AsString := 'EXAMPLE_SETTING';
  DATA_Setting['Description'].AsString := 'Fictional setting';
  DATA_Setting['Value'].AsString := 'Example';
  DATA_Setting['ValueType'].AsString := 'String';
  DATA_Setting.Post;
  Value := DATA_Setting.RecordCount;
end;
```

### Usage

`DATA_Setting` provides the friendly client dataset conventionally used for explicitly queried Setting rows.

**Conventional VxData context**

The current `Setting` table has identity `Num`, required code, description, textual value, value type and system-setting flag. This object is distinct from the shared `Settings` configuration variable/cache and does not perform typed conversion, caching or lookup automatically.

That convention is guidance for choosing queries and field names, not a guarantee. A configured source/destination or customer extension may expose a different subset or additional columns. Use `FindField` for optional columns and never assume a named field merely because this page describes the current base schema.

**Behaviour, lifecycle and side effects**

- Velox loads all returned rows into memory and preserves fetched string whitespace. Large results can use substantial memory.
- Field access, navigation, filtering, indexing, inserts, edits, posts and deletes mutate this shared object. Closing or recreating it invalidates retained fields and record positions.
- `Post` updates the client dataset; it is not proof of an external database write or transaction commit. SQL or file effects belong to the function used to populate or persist it.
- Data helper functions generally catch and log SQL or creation failures, potentially leaving the object inactive or reset. Direct invalid field, conversion or dataset-state operations can raise.
- Action cleanup closes every friendly dataset. Velox owns the object; never free it or depend on records surviving another action execution.
- The mutable dataset and cursor are not thread-safe. Do not hand the reference to asynchronous work or let nested code reposition it without an explicit contract.

**Alias and naming cautions**

Setting values can influence sensitive behaviour and may contain confidential configuration. Select and log only what is required, validate `ValueType`, and never confuse a mutable row with the governed live configuration authority.

The friendly suffix never validates record type, authenticates a party or application, enforces foreign keys or prevents the dataset being reused for unrelated data.

### Additional Technical Info
`DATA_Setting` is a mutable client dataset conventionally used for rows from the VxData `Setting` table or another explicit setting projection. It is a live `TvxClientDataSet` reference; its name does not load data, choose a connection, execute SQL or impose a field layout.

**Runtime binding and identity**

Velox constructs the object with the action and binds `DATA_Setting` to `TvxActionMan.FData50`. Its diagnostic dataset name is `DATA_Setting`.

The dataset begins inactive and without fields. `CreateData`, the Data query helpers and load methods can each replace its current schema and records. Every script using this action sees the same live cursor, filters, indexes and edits until the dataset is closed or repopulated.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md) explains cursor, field, edit and ownership rules.
- [`CreateData`](../../Functions/Data/CreateData.md) creates an explicit in-memory schema.
- [`GetData`](../../Functions/Data/GetData.md) and [`GetDataFromDB`](../../Functions/Data/GetDataFromDB.md) explicitly populate a dataset.
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) is the exposed class.
- [`Settings`](../Config/Settings.md) is the separate shared configuration accessor.

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet) documents the inherited Delphi in-memory dataset.
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the inherited cursor and edit model.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
