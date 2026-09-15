---
title: jsNumber
description: Identifies Deltics JSON integer or double subclasses, with important exponent and host-locale parsing limitations.
sidebar_position: 158
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, json, number, integer, double, locale]
---

```Delphi
jsNumber = 1
```

### Example

```Delphi
function ReadJSONDouble(Value: TJSONValue; var Number: Double): Boolean;
begin
  Result := (Value.ValueType = jsNumber) and Value.NotNull;
  if Result then
    Number := Value.AsDouble;
end;
```

### Usage

`jsNumber` identifies a JSON numeric value, with important exponent and Windows-locale limitations in Velox.

#### Parsing and formatting quirks

Velox treats a numeric token as floating point only when it contains `.`. A standards-valid exponent-only token such as `1e3` is therefore treated as an integer and raises an error. Decimal parsing and output use the Windows decimal separator. On a computer using a comma, standard JSON input containing `.` can fail and output can contain `,`, which is not a valid JSON decimal point.

Treat external or cross-locale numbers as untrusted. Use a standards-compliant JSON path when interoperable numeric syntax is required.

### Additional Technical Info
`jsNumber` is ordinal 1 of [`TJSONValueType`](../../Types/Enumerations/TJSONValueType.md). Both `TJSONInteger` (signed Int64 storage) and `TJSONDouble` (Delphi Double storage) receive this kind, so `ValueType` alone does not reveal integer versus floating representation.

#### Conversion boundaries

`AsDouble` converts the textual form and is appropriate for either numeric subclass subject to locale/precision. `AsInt64`/`AsInteger` accept `jsNumber`, but a `TJSONDouble` with a fractional textual form is passed to integer parsing and raises. `AsInteger` can also overflow outside the 32-bit range. Binary Double cannot exactly represent every decimal or 64-bit integer.

A newly constructed numeric object is non-null zero. `Clear` marks it null without erasing stored data; clearing the null flag later can reveal the previous number. Null numeric accessors return zero, which is indistinguishable without checking `IsNull`.

The example is source-reviewed only; no JSON parsing, locale, precision, overflow, runtime or image test ran.

**Related Code Library entries**

- [`jsString`](jsString.md) - textual values accepted by several numeric accessors.
- [`jsNull`](jsNull.md) - null/default conversion boundary.
- [`TJSONValue.AsDouble`](../../Classes/JSON/TJSONValue/Properties/AsDouble.md) - floating conversion accessor.

**External references**

- [RFC 8259 numbers](https://www.rfc-editor.org/rfc/rfc8259#section-6).

<small>Created 2026-07-15</small>
