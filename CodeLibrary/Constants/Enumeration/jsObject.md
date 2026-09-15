---
title: jsObject
description: Identifies an owned Deltics JSONObject whose name lookup and compact serialization have Velox-specific side effects and defects.
sidebar_position: 159
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, json, object, property, serialization]
---

```Delphi
jsObject = 4
```

### Example

```Delphi
function HasCustomer(Value: TJSONValue): Boolean;
begin
  Result := (Value.ValueType = jsObject) and
            Value.AsObject.Contains('customer');
end;
```

### Usage

`jsObject` identifies an owned Velox JSONObject whose name lookup and compact serialisation have Velox-specific side effects and defects.

### Additional Technical Info
`jsObject` is ordinal 4 of [`TJSONValueType`](../../Types/Enumerations/TJSONValueType.md). The base constructor assigns it to `TJSONObject`. Check it before [`TJSONValue.AsObject`](../../Classes/JSON/TJSONValue/Properties/AsObject.md), which is a checked class cast.

Objects own their child values; delete, clear and destruction free them. Lookup is case-insensitive and returns the first matching name, while `Add` permits duplicate names. This differs from systems that require case-sensitive or unique member names. Preserve insertion order only when the downstream contract permits it; JSON consumers can handle duplicates differently.

Reading `Values[Name]` is mutating: a missing name causes the object to add and return a named `TJSONNull`. Use `Contains` before indexed lookup when a read must not create data. Arrays and objects always report non-null, including empty containers.

#### Serialization defects

The compiled compact `AsString` implementation returns only `}` for an empty object: it removes the opening brace as if it were a trailing comma. For nonempty objects it wraps property names in quotes but does not JSON-escape quotes, backslashes or control characters in those names. Duplicate members are all emitted. Child values also inherit numeric locale and string-escape limitations.

Do not use this serializer for an empty object or arbitrary external property names without validating/correcting the output. A standards-compliant serializer is safer for public interchange.

The example uses `Contains` specifically to avoid the missing-value mutation and was source-reviewed; no JSON parsing, serialization, ownership, runtime or image test ran.

**Related Code Library entries**

- [`jsArray`](jsArray.md) - ordered container.
- [`jsNull`](jsNull.md) - value inserted by missing-name lookup.
- [`TJSONObject`](../../Classes/JSON/TJSONObject.md) - object class reference.

**External references**

- [RFC 8259 objects](https://www.rfc-editor.org/rfc/rfc8259#section-4).
- [RFC 8259 string escaping](https://www.rfc-editor.org/rfc/rfc8259#section-7).

<small>Created 2026-07-15</small>
