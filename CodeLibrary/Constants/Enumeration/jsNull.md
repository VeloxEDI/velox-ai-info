---
title: jsNull
description: Identifies a concrete Deltics TJSONNull that always reports null and is serialized as the JSON null literal.
sidebar_position: 157
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, json, 'null', missing, conversion]
---

```Delphi
jsNull = 5
```

### Example

```Delphi
function IsConcreteJSONNull(Value: TJSONValue): Boolean;
begin
  Result := Value.ValueType = jsNull;
end;
```

### Usage

`jsNull` identifies a Velox TJSONNull that always reports null and is serialized as the JSON null literal.

### Additional Technical Info
`jsNull` is ordinal 5 of [`TJSONValueType`](../../Types/Enumerations/TJSONValueType.md) and is assigned only to concrete `TJSONNull` objects. They always return `IsNull = True` and `NotNull = False`; writing the inherited null flag cannot change those overridden getters.

The scalar `AsString` accessor returns an empty string for any value whose `IsNull` is true, including `TJSONNull`. Container serializers special-case null and emit the literal `null`. Consequently, do not use `AsString = 'null'` to detect this kind. Test `ValueType` for concrete syntax kind and `IsNull` when any null-marked scalar should count.

Other conversion accessors deliberately collapse null to defaults: Boolean is false, integer/Int64/double are zero, string is empty, and date/time accessors return the library's null-date value. These defaults do not distinguish null from legitimate zero/false/empty values.

`TJSONObject.Values[Name]` has a Velox-specific side effect: if the name is missing, the getter adds and returns a named `TJSONNull`. A read can therefore increase `ValueCount` and change later serialization. Use `Contains`/`FindValue`-style checks when you must not mutate the document.

The parser accepts `null` case-insensitively, although RFC 8259 requires lowercase. Serializers output lowercase `null`.

The example is source-reviewed only; no JSON parsing, object mutation, conversion, runtime or image test ran.

**Related Code Library entries**

- [`jsString`](jsString.md), [`jsNumber`](jsNumber.md) and [`jsBoolean`](jsBoolean.md) - scalar kinds with separate mutable null state.
- [`jsObject`](jsObject.md) - missing-value lookup behavior.
- [`TJSONValue.IsNull`](../../Classes/JSON/TJSONValue/Properties/IsNull.md) - null-state flag.

**External references**

- [RFC 8259 values and null](https://www.rfc-editor.org/rfc/rfc8259#section-3).

<small>Created 2026-07-15</small>
