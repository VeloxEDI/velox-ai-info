---
title: "DATA2"
description: "Provides the second independent action-owned client dataset for general script working data."
sidebar_position: 96
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
DATA2: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA2, ['Code,string,40', 'Quantity,integer']);
  DATA2.Append;
  DATA2['Code'].AsString := 'SAMPLE-002';
  DATA2['Quantity'].AsInteger := 2;
  DATA2.Post;
  Value := DATA2.RecordCount;
end;
```

### Usage

`DATA2` provides the second independent action-owned client dataset for general script working data.

**Behaviour and risks**

- Schema, records, filters, indexes and cursor are mutable state shared by later scripts using `DATA2` in the same action execution.
- `DATA2['Field']` raises a dataset-labelled database error when the field is absent. Use `FindField` for optional columns and do not retain fields across a close/schema replacement.
- `Post` changes the in-memory record. Database persistence/commit depends on the separate function and transaction path used.
- Query/create helpers usually catch and log failures; direct dataset operations can raise. A logged failure can leave the object inactive or reset.
- Results are fully materialised and the cursor is not thread-safe. Bound large queries and do not share the object with asynchronous work.
- File operations and query helpers can perform filesystem, database, network or transaction side effects; the variable alone performs none.

`DATA1`-`DATA10` are individually named objects, not array elements. Never free `DATA2`, infer a table from its number, or rely on records after action cleanup.

### Additional Technical Info
`DATA2` is the second of ten independent, action-owned `TvxClientDataSet` instances for script working data. The name supplies no schema, table, query or business meaning.

Velox creates the object as `TvxActionMan.FData2`, labels lookup errors `DATA2`, and binds that same live object into scripters for the action. It starts inactive and unstructured. Use `CreateData`, a Data query helper or a load method before reading fields; simply referencing it does not fetch data.

**Implementation and lifecycle**

The Velox descendant preserves string whitespace, disables calculated fields/fetch-on-demand and requests all provider rows. In normal non-edit mode an SQL open copies rows into memory, disables constraints/change logging, detaches the provider and closes the server dataset. Action cleanup closes the dataset, while the object remains owned by the action until destruction.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md)
- [`CreateData`](../../Functions/Data/CreateData.md)
- [`GetData`](../../Functions/Data/GetData.md)
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md)

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet)
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet)
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) is compatibility context; Velox uses Delphi and its own descendant.

<small>Created 2026-07-15</small>
