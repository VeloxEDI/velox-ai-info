---
title: "GetCustomDataSet"
description: "Creates a custom client dataset using the same field-definition grammar as CreateData."
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, dataset, fields, alias]
---

```Delphi
procedure GetCustomDataSet(const aDataSet: TvxClientDataSet;
  const aFields: array of string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  GetCustomDataSet(Data,
    ['Key,string,50', 'Amount,double', 'Processed,boolean']);
end;
```

### Usage

`GetCustomDataSet` creates a custom client dataset using the same field-definition grammar as CreateData.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aDataSet` | `TvxClientDataSet` | Existing dataset object to close, clear and recreate in place. |
| `aFields` | `array of string` | `name[,type[,size]]` definitions accepted by `CreateData`. |

**Returns**

No status. On success the same object is active and empty with the requested schema.

**Usage notes**

Prefer the name that makes intent clearest in existing configuration, but do not treat `GetCustomDataSet` as a different or safer API. See `CreateData` for the complete grammar table and failure analysis.

### Additional Technical Info
`GetCustomDataSet` is an exact wrapper around [`CreateData`](CreateData.md). It recreates a supplied client dataset as an empty in-memory dataset using Velox comma-delimited field definitions; it does not fetch data despite the `Get` prefix.

The field names are fictional. The example is source-reviewed and was not executed.

**Implementation and quirks**

The implementation contains only `CreateData(aDataSet, aFields)`, so every contract and defect of that method applies:

- A name alone creates `string(255)`, but explicit `name,string` requires a third integer size.
- `double` and `extended` both create `ftFMTBcd` fields.
- Unknown types and invalid string sizes fail.
- The prior dataset is already closed and cleared before field parsing completes.
- Exceptions are caught and logged by `CreateData`, with no propagated error or result.

**Side effects, performance and concurrency**

The old cursor, edit state, SQL binding, command and fields are destroyed. Creation is synchronous and approximately linear in the field count. Do not recreate an object while other script code holds its field references or iterates it.

**Related entries**

- [`CreateData`](CreateData.md) is the terminal implementation and full reference.
- [`GetData`](GetData.md) actually opens a database query.

**External references**

- [Embarcadero `Datasnap.DBClient.TCustomClientDataSet.CreateDataSet`](https://docwiki.embarcadero.com/Libraries/Florence/en/Datasnap.DBClient.TCustomClientDataSet.CreateDataSet) - final Delphi dataset creation operation called by the wrapper chain.

<small>Created 2026-07-15</small>
