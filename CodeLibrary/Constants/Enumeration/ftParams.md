---
title: ftParams
description: Identifies a live TParams collection in Delphi object-parameter marshalling rather than one parameter value.
sidebar_position: 120
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, dataset, params, parameter, object, ownership]
---

```Delphi
ftParams = 47
```

### Example

```Delphi
function IsParamsObject(DataType: TFieldType): Boolean;
begin
  Result := DataType = ftParams;
end;
```

### Usage

`ftParams` identifies a live TParams collection in object-parameter marshalling rather than one parameter value.

### Additional Technical Info
`ftParams` is ordinal 47 of [`TFieldType`](../../Types/Enumerations/TFieldType.md). It marks a `TParams` object in parameter marshalling; it is not the type of an individual SQL parameter and has no default ordinary field class.

The collection contains named/positional `TParam` objects whose own `DataType`, direction, Null/value and size metadata remain independently significant. The enum does not transfer ownership. Do not free, reorder or retain the collection unless the API explicitly permits it, and never log credential/secret parameter values.

When copying parameters, preserve direction, names, types and Null rather than copying display strings alone.

The example only compares metadata and was source-reviewed; no parameter collection, query, database, runtime or image test ran.

**External references**

- [Embarcadero `TFieldType`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TFieldType) and [`TParams`](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TParams).
- [Free Pascal `TFieldType`](https://www.freepascal.org/docs-html/fcl/db/tfieldtype.html) compatibility reference.

<small>Created 2026-07-15</small>
