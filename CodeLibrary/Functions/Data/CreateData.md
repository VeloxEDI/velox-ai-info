---
title: "CreateData"
description: "Recreates a client dataset from Velox comma-delimited field definitions and opens it in memory."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - dataset
  - fields
  - schema
  - in-memory
---

```Delphi
procedure CreateData(const aDataSet: TvxClientDataSet;
  const aFields: array of string);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  CreateData(Data,
    ['OrderNo,string,40',
     'Quantity,integer',
     'UnitPrice,double',
     'RequiredDate,date']);
end;
```

### Usage

`CreateData` recreates a client dataset from Velox comma-delimited field definitions and opens it in memory.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aDataSet` | `TvxClientDataSet` | Existing dataset object to destroy and recreate in place. It must be non-`nil` and suitable for `CreateDataSet`. |
| `aFields` | `array of string` | Field definitions in `name[,type[,size]]` form. |

**Returns**

No status is returned. On success, `aDataSet` is active, empty and has the requested field definitions.

**Errors**

All errors are caught and logged as an error creating a custom dataset in the map. They do not propagate to the script, and there is no Boolean result. If a field definition cannot be parsed, the original dataset has already been cleared and may contain only the definitions processed before the error.

**Usage notes**

Use explicit field sizes for text and validate the resulting schema before loading data. This is a structure-creation helper, not a query helper and not a transaction boundary.

### Additional Technical Info
`CreateData` closes and clears a supplied `TvxClientDataSet`, adds fields from a compact Velox definition grammar, and calls `CreateDataSet` to open a new empty in-memory dataset.

The example uses a context-provided dataset name and fictional fields. Replace `Data` with a dataset available in the current script context. It is source-reviewed and was not executed by the documentation workflow.

**Field-definition grammar**

Definitions are split on commas by the Velox property parser. Type names are case-insensitive.

| Type text | Delphi field type | Size rule |
|---|---|---|
| omitted | `ftString` | Defaults to `255`. |
| `string` | `ftString` | A third integer property is required. |
| `integer` | `ftInteger` | Parsed size is ignored. |
| `double`, `extended` | `ftFMTBcd` | Any trailing properties are ignored. |
| `boolean` | `ftBoolean` | Any trailing properties are ignored. |
| `memo` | `ftMemo` | Any trailing properties are ignored. |
| `datetime`, `tdatetime` | `ftDateTime` | Any trailing properties are ignored. |
| `date` | `ftDate` | Any trailing properties are ignored. |
| `time` | `ftTime` | Any trailing properties are ignored. |

This grammar has an important asymmetry: `NameOnly` creates a default `string(255)` field, but `Name,string` fails because an explicitly supplied `string` type requires the size property. Unknown types fail through the custom invalid-definition exception.

Only the next property is parsed at each required step. Extra text after a string size, and every property after a non-string type, is silently ignored. An integer string size is accepted even when zero or negative; the later Delphi field/dataset operation determines whether it is valid.

The non-integer-size path contains another parser bug: after `TryStrToInt` returns `False`, `GetFieldDef` exits without changing its already-`True` result. Delphi's integer scanner can leave a parsed numeric prefix in the output, so a value such as `12x` can proceed as size `12`; wholly invalid text can proceed with a zero/partial output and fail only in later field/dataset handling. It does not reliably produce the custom “Invalid field definition” error.

An empty definition can reuse the preceding parsed name or leave it empty, normally causing a duplicate/invalid field failure later rather than the custom error.

An empty `aFields` array reaches `CreateDataSet` with no definitions; Delphi raises because neither field definitions nor persistent fields are available, and Velox logs/suppresses that exception.

**Implementation**

The method first sets `Active := False`, clears `FieldDefs`, removes `SQLConnection` and empties `SQLDataSet.CommandText`. For each string it parses a name, optional type and optional size into a `TFieldDef`; it then calls `CreateDataSet`. The dataset object is reused, not replaced.

The helper maps both `double` and `extended` to `ftFMTBcd`, not Delphi floating-point field types. Precision and scale are not explicitly assigned by this routine, so do not assume IEEE `Double` storage from the grammar name.

**Side effects**

The existing dataset is closed and its SQL binding, command, field definitions, cursor and pending edit state are discarded. Any code retaining field objects from the former schema must reacquire them.

**Performance and concurrency**

Creation is linear in the number of field definitions plus Delphi dataset initialisation. The caller receives the same mutable object; do not recreate it while other code is iterating or editing it.

**Related entries**

- [`GetCustomDataSet`](GetCustomDataSet.md) is an exact wrapper around this method.
- [`GetData`](GetData.md) instead rebinds the dataset to a database query.
- [Datasets](../../ScriptingGuide/Datasets.md) explains dataset cursor and edit state.

**External references**

- [Embarcadero `Datasnap.DBClient.TCustomClientDataSet.CreateDataSet`](https://docwiki.embarcadero.com/Libraries/Florence/en/Datasnap.DBClient.TCustomClientDataSet.CreateDataSet) - documents creating an in-memory client dataset from field definitions.
- [Embarcadero `Datasnap.DBClient.TClientDataSet.FieldDefs`](https://docwiki.embarcadero.com/Libraries/Florence/en/Datasnap.DBClient.TClientDataSet.FieldDefs) - describes the field-definition collection used by the implementation.
- [Free Pascal `TFieldDefs`](https://www.freepascal.org/docs-html/fcl/db/tfielddefs.html) - compatible field-definition collection concepts; Velox uses Delphi's client-dataset implementation.

<small>Created 2026-07-15</small>
