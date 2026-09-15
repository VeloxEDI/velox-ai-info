---
title: jsString
description: Identifies a Deltics JSON string, including its mutable null state and incomplete Unicode/control-character escaping.
sidebar_position: 160
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, json, string, unicode, escaping]
---

```Delphi
jsString = 0
```

### Example

```Delphi
function ReadJSONString(Value: TJSONValue; var Text: String): Boolean;
begin
  Result := (Value.ValueType = jsString) and Value.NotNull;
  if Result then
    Text := Value.AsString;
end;
```

### Usage

`jsString` identifies a Velox JSON string, including its mutable null state and incomplete Unicode/control-character escaping.

### Additional Technical Info
`jsString` is ordinal 0 of [`TJSONValueType`](../../Types/Enumerations/TJSONValueType.md) and identifies a concrete `TJSONString`. `AsString` returns its decoded stored text when not null; empty string and null-marked string are distinct only when `IsNull`/`NotNull` is checked.

The reader decodes `\"`, `\\`, `\/`, `\b`, `\t`, `\n`, `\f` and `\r`. Its `\u` branch is an unimplemented TODO: it does not decode the marker or following four hexadecimal digits as a Unicode code unit. For example, a JSON escape representing `A` is stored as the five text characters `u0041`, not `A`. Prefer literal Unicode input supported by the surrounding stream encoding or a standards-compliant parser when escaped Unicode is possible.

Serialization escapes quote, backslash and the five common control escapes. It deliberately leaves `/` unescaped, which is valid JSON, but it also leaves other control characters below U+0020 unescaped, producing invalid JSON. Object property names have a separate defect and are not passed through this escaping routine at all.

Scalar null state does not change `ValueType`. `Clear` marks a string null without erasing its stored text; setting `IsNull := False` can reveal that old text. While null, `AsString` returns empty. Assigning `AsString`/`Value` makes it non-null.

Several generic accessors parse strings as Boolean, number, date/time, GUID or enum. These conversions can be permissive, locale-sensitive or raise; check the expected kind and validate the text rather than using them as JSON schema validation.

The example is source-reviewed only; no JSON parsing, Unicode, escaping, conversion, runtime or image test ran.

**Related Code Library entries**

- [`jsNumber`](jsNumber.md) and [`jsBoolean`](jsBoolean.md) - typed scalar alternatives.
- [`jsNull`](jsNull.md) - concrete null versus null-marked string.
- [`TJSONValue.AsString`](../../Classes/JSON/TJSONValue/Properties/AsString.md) - scalar accessor.

**External references**

- [RFC 8259 strings and escaping](https://www.rfc-editor.org/rfc/rfc8259#section-7).
- [RFC 8259 Unicode considerations](https://www.rfc-editor.org/rfc/rfc8259#section-8).

<small>Created 2026-07-15</small>
