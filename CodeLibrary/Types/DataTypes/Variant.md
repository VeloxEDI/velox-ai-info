---
title: Variant
description: Stores a dynamically tagged scalar, Null, Empty or array value whose conversions are validated at runtime.
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, variant, 'null', empty, dynamic, array]
---

```Delphi
Variant
```

### Example

```Delphi
procedure NormalizeValue(Input: Variant; var Output: String);
begin
  if VarIsNull(Input) or VarIsEmpty(Input) then
    Output := ''
  else
    Output := VarToStr(Input);
end;
```

### Usage

`Variant` stores a dynamically tagged scalar, Null, Empty or array value whose conversions are validated at runtime.

### Additional Technical Info
`Variant` is PascalScript's dynamically tagged value type (`btVariant`), backed by Delphi Variant interoperability. It can hold supported numeric, Boolean, date, String/interface values, arrays, `Empty` or `Null`.

`Empty` means uninitialized/no value assigned. `Null` is an explicit unknown/database-null value. They are distinct from each other, numeric zero, Boolean False and String `''`. Test with [`VarIsEmpty`/`VarIsNull`](../../Functions/Variant.md) before strict conversion.

Conversions occur at runtime and can be locale-dependent or raise for incompatible content. Use VarType/VarAsType or a purpose-specific conversion once at the boundary, then keep strongly typed locals. Do not repeatedly rely on implicit coercion in business logic.

Null participates in Variant expressions with propagation/error rules that differ from ordinary values. The modified PascalScript runtime makes one ANSI-string extraction path call `VarToStr` to avoid a Null conversion exception, but that implementation convenience does not redefine Null as empty. Use explicit Null handling.

Variant arrays have their own bounds and element tags. Use VarArrayCreate/Get/Set and validate dimensions/bounds. A Variant assignment manages/copies its dynamic value; object/interface lifetime still follows the contained type and host boundary.

The example is source-reviewed only; no Variant was converted.

**External references**

- [Embarcadero Variant types](https://docwiki.embarcadero.com/RADStudio/en/Variant_Types_(Delphi)) - Delphi dynamic value, Empty/Null and conversion model.
- [Free Pascal Variants](https://www.freepascal.org/docs-html/ref/refch14.html) - compatible Variant model and comparison reference.

<small>Created 2026-07-15</small>
