---
title: "DATA9"
description: "Provides the ninth independent action-owned client dataset for general script working data."
sidebar_position: 103
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
DATA9: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA9, ['Code,string,40', 'Quantity,integer']);
  DATA9.Append;
  DATA9['Code'].AsString := 'SAMPLE-009';
  DATA9['Quantity'].AsInteger := 9;
  DATA9.Post;
  Value := DATA9.RecordCount;
end;
```

### Usage

`DATA9` provides the ninth independent action-owned client dataset for general script working data.

**Behaviour, errors and limits**

- Schema, records, cursor, filters, indexes and edit state remain visible to later users during the action.
- In-memory `Post` does not prove a remote write or commit.
- Direct invalid field/state operations can raise. Data helper failures are often logged/swallowed and may leave the object inactive/reset.
- Loading, closing, querying or recreating the schema invalidates retained fields and record positions.
- Complete result materialisation can consume significant memory and the mutable cursor is not thread-safe.
- File and SQL helpers have real external effects. Do not free `DATA9` or depend on its rows after action cleanup.

### Additional Technical Info
`DATA9` is the ninth distinct `TvxClientDataSet` supplied as general mutable storage by the active action. Its numeric name does not prescribe a table, schema, query or persistence path.

The script instance is `TvxActionMan.FData83`. It begins inactive/unstructured and carries `DATA9` only as an error-reporting dataset label.

**Implementation and lifecycle**

Scripts explicitly populate it through `CreateData`, Data query helpers or load methods. The Velox descendant preserves string whitespace, disables auto-calculated fields/fetch-on-demand and requests complete results. Normal read-oriented SQL use copies rows into memory, disables constraints/change logging and detaches the provider. Action cleanup closes it, and the action remains its sole owner.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md)
- [`CreateData`](../../Functions/Data/CreateData.md)
- [`ExecSQLData`](../../Functions/Data/ExecSQLData.md)
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md)

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet)
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet)
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) is compatibility context only.

<small>Created 2026-07-15</small>
