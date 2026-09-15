---
title: TJSONValueType
description: Reports the concrete JSON value class as string, number, Boolean, array, object or null.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, json, value, type, conversion]
---

```Delphi
TJSONValueType = (jsString, jsNumber, jsBoolean, jsArray, jsObject, jsNull)
```

### Example

```Delphi
procedure ReadJSONValue(Item: TJSONValue; var Value: Variant);
begin
  if Item.ValueType = jsNull then
    Value := Null
  else if Item.ValueType = jsString then
    Value := Item.AsString
  else
    Value := Item.AsInfo;
end;
```

### Usage

`TJSONValueType` reports the JSON value class as string, number, Boolean, array, object or null.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| [`jsString`](../../Constants/Enumeration/jsString.md) | 0 | A `TJSONString`, with separate mutable null state and incomplete escape handling. |
| [`jsNumber`](../../Constants/Enumeration/jsNumber.md) | 1 | A `TJSONInteger` or `TJSONDouble`, with exponent/locale limitations. |
| [`jsBoolean`](../../Constants/Enumeration/jsBoolean.md) | 2 | A `TJSONBoolean`. |
| [`jsArray`](../../Constants/Enumeration/jsArray.md) | 3 | An owned ordered `TJSONArray`. |
| [`jsObject`](../../Constants/Enumeration/jsObject.md) | 4 | An owned named-value `TJSONObject`, including lookup/serialization quirks. |
| [`jsNull`](../../Constants/Enumeration/jsNull.md) | 5 | A `TJSONNull` that always reports null. |

#### Behavior and boundaries

- `ValueType` is class-derived and read-only. Assigning `IsNull := True` on an ordinary value does not change its `ValueType` to `jsNull`; test both when null-state provenance matters.
- `AsArray` and `AsObject` use Velox checked class casts and raise for the wrong kind.
- Several scalar accessors accept more than one kind by converting `AsString`; locale, format, overflow and invalid-text errors can still occur.
- `AsBoolean` returns false for null; non-Boolean values compare their text case-insensitively with `true`. This can conceal malformed Boolean input unless `ValueType` is checked first.
- Objects and arrays require traversal; do not serialize or compare them as if `AsString` were a normalized scalar representation.

#### Parser and serializer limits

- Literal `true`, `false` and `null` input is accepted case-insensitively, outside RFC 8259's lowercase grammar.
- `\u` escapes are not decoded: the `u` and four hexadecimal digits all remain text.
- Exponent-only numbers are misclassified as integers; double parsing/formatting uses host-locale `StrToFloat`/`FloatToStr`.
- Empty-object compact `AsString` returns `}` and property names are not JSON-escaped. Other uncommon control characters can also be emitted unescaped.
- `TJSONObject.Values[missing]` adds a named null, so a lookup can mutate the object. Lookup is case-insensitive first-match and duplicate names are permitted.
- Scalar `Clear` marks null without erasing stored data; arrays/objects always report non-null.

### Additional Technical Info
`TJSONValueType` is assigned by the base `TJSONValue` constructor from the concrete runtime class. It identifies JSON syntax kind, allowing scripts to select a compatible accessor before conversion.

The constructor recognizes array, string, Boolean, null, number and object subclasses. An unknown direct subclass raises `EJSONError` rather than receiving a fallback enum value.

**Related Code Library entries**

- [TJSONValue.ValueType](../../Classes/JSON/TJSONValue/Properties/ValueType.md) - exact constructor-derived property.
- [TJSONValue.IsNull](../../Classes/JSON/TJSONValue/Properties/IsNull.md) - separate mutable null flag.
- [TJSONValue.AsArray](../../Classes/JSON/TJSONValue/Properties/AsArray.md) - checked array cast.
- [TJSONValue.AsObject](../../Classes/JSON/TJSONValue/Properties/AsObject.md) - checked object cast.

**External references**

- [RFC 8259 JSON values](https://www.rfc-editor.org/rfc/rfc8259#section-3) - standard JSON value kinds.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration concepts.

<small>Created 2026-07-15</small>
