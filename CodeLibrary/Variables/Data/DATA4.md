---
title: "DATA4"
description: "Provides the fourth independent action-owned client dataset for general script working data."
sidebar_position: 98
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
DATA4: TvxClientDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(DATA4, ['Code,string,40', 'Quantity,integer']);
  DATA4.Append;
  DATA4['Code'].AsString := 'SAMPLE-004';
  DATA4['Quantity'].AsInteger := 4;
  DATA4.Post;
  Value := DATA4.RecordCount;
end;
```

### Usage

`DATA4` provides the fourth independent action-owned client dataset for general script working data.

**Behaviour, errors and limits**

- Field values, cursor, filters, indexes and edit state are shared with subsequent code using `DATA4` during the action.
- Reusing it for another query/schema replaces prior assumptions and can invalidate field references.
- Missing fields and invalid dataset state can raise; Data helper boundaries typically log/swallow their own errors and may leave it inactive.
- In-memory `Post` does not prove database persistence or transaction commit.
- Complete result materialisation can be expensive, and the mutable cursor is not thread-safe.
- SQL/file helper calls have real external side effects; merely reading the variable does not.

The retained connection/command metadata can change between helper calls even though normal result browsing is detached. Always initialise `DATA4` for the current role instead of relying on stale state.

### Additional Technical Info
`DATA4` is the fourth general-purpose `TvxClientDataSet` owned by the active action. It is independent of every other Data variable and has no automatic schema, database table or persistence rule.

Velox constructs `TvxActionMan.FData4`, assigns its diagnostic name `DATA4`, and binds the instance to the script. The object is initially inactive and empty of field definitions; a script must explicitly create/load/query it.

**Implementation and lifecycle**

The Velox client dataset preserves string whitespace, disables auto-calculated fields and fetch-on-demand, and requests all provider records. A default SQL open copies data into memory, disables constraints/change logging, detaches the provider and closes the server dataset. Action cleanup later closes `DATA4`; scripts do not own or free it.

**Related entries**

- [`Datasets`](../../ScriptingGuide/Datasets.md)
- [`CreateData`](../../Functions/Data/CreateData.md)
- [`GetDataFromDest`](../../Functions/Data/GetDataFromDest.md)
- [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md)

**External references**

- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Datasnap.DBClient.TClientDataSet)
- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet)
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) is compatibility context only.

<small>Created 2026-07-15</small>
