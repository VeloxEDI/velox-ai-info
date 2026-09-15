---
title: jsArray
description: Identifies a Deltics TJSONArray containing an owned, ordered sequence of JSON child values.
sidebar_position: 155
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, json, array, collection, ownership]
---

```Delphi
jsArray = 3
```

### Example

```Delphi
function ArrayItemCount(Value: TJSONValue): Integer;
begin
  if Value.ValueType = jsArray then
    Result := Value.AsArray.Count
  else
    Result := 0;
end;
```

### Usage

`jsArray` identifies a Velox TJSONArray containing an owned, ordered sequence of JSON child values.

### Additional Technical Info
`jsArray` is ordinal 3 of [`TJSONValueType`](../../Types/Enumerations/TJSONValueType.md). The base constructor assigns it when the concrete object is `TJSONArray`. Check it before using [`TJSONValue.AsArray`](../../Classes/JSON/TJSONValue/Properties/AsArray.md), which performs a checked Delphi class cast and raises for another kind.

A `TJSONArray` stores children in an owning `TObjectList`: order and duplicates are preserved, and deleting, clearing or destroying the array frees the removed/contained child objects. Do not retain a child reference after its owner removes or destroys it. `Clone`/`CopyFrom` clone children rather than sharing them.

Arrays derive from `TJSONText` and always report `IsNull = False`, including an empty array. Setting their inherited null flag does not change that getter or their `ValueType`; use an actual [`jsNull`](jsNull.md) child to represent JSON null. Empty and null are therefore distinct: empty `AsString` is `[]`.

Compact `AsString` serializes children in order. String children are escaped/quoted, null children become `null`, and nested arrays/objects use their own serialization. This means array output inherits the numeric locale, string escaping and object serialization limitations documented on [`jsNumber`](jsNumber.md), [`jsString`](jsString.md) and [`jsObject`](jsObject.md). Do not treat output as standards-safe until those constraints are acceptable or independently validated.

The example is source-reviewed only; no JSON parsing, serialization, ownership, runtime or image test ran.

**Related Code Library entries**

- [`jsObject`](jsObject.md) - named JSON container.
- [`jsNull`](jsNull.md) - concrete null child.
- [`TJSONArray`](../../Classes/JSON/TJSONArray.md) - array class reference.

**External references**

- [RFC 8259 arrays](https://www.rfc-editor.org/rfc/rfc8259#section-5).

<small>Created 2026-07-15</small>
