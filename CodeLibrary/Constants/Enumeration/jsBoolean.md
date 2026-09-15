---
title: jsBoolean
description: Identifies a concrete Deltics TJSONBoolean whose stored value is true or false independently of its mutable null flag.
sidebar_position: 156
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, json, boolean, 'true', 'false']
---

```Delphi
jsBoolean = 2
```

### Example

```Delphi
function ReadStrictBoolean(Value: TJSONValue): Boolean;
begin
  Result := (Value.ValueType = jsBoolean) and
            Value.NotNull and
            Value.AsBoolean;
end;
```

### Usage

`jsBoolean` identifies a Velox TJSONBoolean whose stored value is true or false independently of its mutable null flag.

### Additional Technical Info
`jsBoolean` is ordinal 2 of [`TJSONValueType`](../../Types/Enumerations/TJSONValueType.md). It is assigned to concrete `TJSONBoolean` objects; their `AsString` form is lowercase `true` or `false` when not null.

Check `ValueType` when Boolean syntax matters. `TJSONValue.AsBoolean` is deliberately permissive for other scalar classes: it compares their string case-insensitively with `true`, and every other non-Boolean text becomes false without an invalid-value error. Null also becomes false. Without a kind/null check, malformed text, JSON false and null collapse to the same result.

The Deltics parser accepts `true` and `false` case-insensitively, although RFC 8259 requires those literals to be lowercase. Serialization normalizes a concrete Boolean to lowercase. A newly constructed `TJSONBoolean` is non-null false by default.

Scalar null state is separate from the enum. `Clear` sets `IsNull` but does not erase the stored Boolean. Assigning `Value`/`AsBoolean` clears null state, and manually setting `IsNull := False` can reveal the old stored value. Use both `ValueType` and `IsNull`/`NotNull` when input provenance matters.

The example is source-reviewed only; no JSON parsing, Boolean conversion, runtime or image test ran.

**Related Code Library entries**

- [`jsNull`](jsNull.md) - concrete JSON null.
- [`jsString`](jsString.md) - text that permissive `AsBoolean` can convert.
- [`TJSONValue.AsBoolean`](../../Classes/JSON/TJSONValue/Properties/AsBoolean.md) - conversion accessor.

**External references**

- [RFC 8259 literal names](https://www.rfc-editor.org/rfc/rfc8259#section-3).

<small>Created 2026-07-15</small>
