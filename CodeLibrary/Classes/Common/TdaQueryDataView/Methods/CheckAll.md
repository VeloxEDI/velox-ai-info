---
title: CheckAll
description: Concatenates every pipeline field's AsString value in field order as a fast change hint, without names, lengths, separators or null markers.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, query-dataview, change-detection, concatenation]
---

```Delphi
function CheckAll: string;
```

### Example

```Delphi
function CurrentChangeInput(const View: TdaCDSQueryDataView): string;
begin
  Result := View.CheckAll;
end;
```

### Usage

`CheckAll` concatenates every pipeline field's AsString value in field order as a fast change hint, without names, lengths, separators or null markers.

- Use only as a fast, process-local change input where collision risk is acceptable.
- For durable identity or audit, serialize field names, types, null markers and lengths canonically before hashing.
- Ensure the view has a pipeline and active fields; missing pipeline/index/conversion errors propagate.

### Additional Technical Info
`CheckAll` builds the string used as input by some `Hash.HasChanged` workflows. It is not itself a cryptographic hash or an unambiguous record serialization.

#### Source-backed behaviour

The base implementation lazily creates one `TvxStringAppend` with initial capacity 400, resets its position, reads `DataPipelines[0].FieldCount`, and appends `FieldByIndex(i).AsString` for every field in collection order. It returns the builder's current data. Concrete descendants inherit this implementation while overriding `FieldByIndex` to read their client dataset.

There is no field name, delimiter, length, type or null marker. Values `('AB','C')` and `('A','BC')` therefore produce the same text; null and empty string commonly both contribute nothing. Numeric/date string conversion can be locale- or descendant-dependent. Field reordering changes the result. The cached builder is mutable view state and is not synchronized for concurrent calls.

#### Official terminal references

- [Embarcadero: TField.AsString](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.AsString)
- [Free Pascal: TField.AsString](https://www.freepascal.org/docs-html/current/fcl/db/tfield.asstring.html)

<small>Created 2026-07-15</small>
