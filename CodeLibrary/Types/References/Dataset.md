---
title: Dataset
description: "Aliases TvxClientDataSet without copying its host-owned records, schema, cursor, or mutable state."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, reference, alias, dataset, cursor, ownership]
---

```Delphi
Dataset = TvxClientDataSet
```

### Example

```Delphi
procedure ReadCustomer(const Source: Dataset; var Value: Variant);
begin
  if Source.Find('CustomerCode', 'ABC') then
    Value := Source['CustomerName'].AsString
  else
    Value := Null;
end;
```

### Usage

Aliases TvxClientDataSet without copying its Velox-provided records, schema, cursor, or mutable state.

#### Identity, cursor and lifetime

Assigning a `Dataset` variable copies only the object reference. Both variables see the same fields, rows, indexes, filter/edit state and current record. A `Find`, navigation, load, delete, sort/index or close operation through either reference can move or rebuild the shared cursor. A borrowed field object also follows that current record and can become invalid when the schema or buffers are rebuilt.

The normal `DATA*`, view and query objects supplied to a script are created and owned by Velox. Do not call `Free` on them. Scripts cannot construct a `TvxClientDataSet` directly, and the alias does not add one. If a future function returns a Dataset, that function's page must define whether the object is borrowed, Velox-provided or transferred; the alias alone cannot answer ownership.

Class references can be `nil`. A nil value has no dataset state, and calling a member through it fails. Check the producer's nullable contract or use [`Assigned`](../../Functions/Comparison/Assigned.md) when nil is possible.

#### Data and transaction boundary

The object is an in-memory client-dataset instance. Assignment does not duplicate records or create a stable snapshot. Ordinary edits affect the shared in-memory instance, while external database/file persistence depends on the surrounding Velox flow or an explicit operation. The alias neither opens the dataset nor commits a transaction.

One instance is mutable and unsynchronised. Keep it within its owning action/thread, snapshot scalar values before calls that can navigate, and prefer business keys over transient record positions.

### Additional Technical Info
`Dataset` is installed during every Velox script compilation with `AddTypeCopyN('Dataset', 'TvxClientDataSet')`. The modified PascalScript compiler resolves the target and creates a type link to it. This is compile-time identity: it is not a wrapper, subclass, dataset factory, packet conversion or copy operation.

The alias exposes exactly the [`TvxClientDataSet`](../../Classes/Data/TvxClientDataSet.md) object reference accepted by the compiled function or property. All visible Velox-specific members, inherited dataset members, and their implementation quirks are unchanged.

**Related Code Library entries**

- [TvxClientDataSet](../../Classes/Data/TvxClientDataSet.md) - complete public class behavior and ownership rules.
- [Datasets guide](../../ScriptingGuide/Datasets.md) - dataset use within Velox scripts and flows.

**External references**

- [Embarcadero TClientDataSet](https://docwiki.embarcadero.com/Libraries/Florence/en/Datasnap.DBClient.TClientDataSet) - underlying Delphi client-dataset model.
- [Free Pascal TDataSet](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) - compatible generic dataset concepts; Velox executes its custom Delphi client-dataset descendant.

<small>Created 2026-07-15</small>
