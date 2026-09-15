---
title: "DATA7"
description: "Provides the seventh independent action-owned client dataset for general script working data."
sidebar_position: 101
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
DATA7: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA7, ['Code,string,40', 'Quantity,integer']);
  DATA7.Append;
  DATA7['Code'].AsString := 'SAMPLE-007';
  DATA7['Quantity'].AsInteger := 7;
  DATA7.Post;
  Value := DATA7.RecordCount;
end;
```

### Usage

`DATA7` provides the seventh independent action-owned client dataset for general script working data.

**Behaviour, errors and limits**

- Current schema, rows, cursor, filters, indexes and edit state are shared within the action.
- `Post` updates the client dataset but is not proof of remote persistence or commit.
- Helper boundaries often log/swallow SQL and creation failures; direct methods can raise and invalid fields receive the `DATA7` diagnostic label.
- A close, load, query or schema recreation invalidates retained field references and record-position assumptions.
- Complete result materialisation can be expensive and the mutable cursor is not thread-safe.
- SQL/file operations have real external effects only when invoked. Do not free or retain the object beyond execution.

### Additional Technical Info
`DATA7` is the seventh general-purpose, action-owned `TvxClientDataSet`. It is an empty capability until script code explicitly creates a schema, loads a packet or executes a query into it.

The public name binds to the distinct object `TvxActionMan.FData81`; the high internal slot follows the block of friendly datasets and has no public semantic effect.

**Implementation and lifecycle**

The dataset starts inactive/unstructured and its `DATA7` name is diagnostic only. The Velox descendant preserves whitespace, disables auto-calculated fields/fetch-on-demand, requests complete results and normally detaches its provider after copying SQL rows into memory. Constraints and change logging are disabled in the ordinary read-oriented path. Action cleanup closes it; Velox owns its lifetime.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md)
- [`CreateData`](../../Functions/Data/CreateData.md)
- [`GetDataSetFromDest`](../../Functions/Data/GetDataSetFromDest.md)
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md)

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet)
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet)
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) is compatibility context only.

<small>Created 2026-07-15</small>
