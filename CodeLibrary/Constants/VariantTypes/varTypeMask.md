---
title: varTypeMask
description: Selects the low 12 bits of a raw Variant type code so array and by-reference flags can be interpreted separately.
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, vartype, mask, flags]
---

```Delphi
varTypeMask = 4095
```

### Example

```Delphi
function BaseVariantType(const Value: Variant): TVarType;
begin
  Result := VarType(Value) and varTypeMask;
end;
```

### Usage

`varTypeMask` selects the low 12 bits of a raw Variant type code so array and by-reference flags can be interpreted separately.

### Additional Technical Info
`varTypeMask` is the [`TVarType`](../../Types/DataTypes/TVarType.md) bit mask `$0FFF`. Applying it to [`VarType`](../../Functions/Variant/VarType.md) preserves the low 12-bit base/custom type number and removes the public representation flags [`varArray`](varArray.md) (`$2000`) and [`varByRef`](varByRef.md) (`$4000`).

Use separate expressions for separate questions:

```Delphi
Code := VarType(Value);
Base := Code and varTypeMask;
IsArray := (Code and varArray) <> 0;
IsByRef := (Code and varByRef) <> 0;
```

Do not compare `Code and varTypeMask` to `varArray` or `varByRef`: the mask deliberately removes those flags. Conversely, exact `Code = varInteger` is false for an Integer array even though its element base type is Integer.

**Interpretation limits**

- The base number can identify a built-in or custom Variant type; it does not prove that a malformed/borrowed payload is valid.
- Masking a by-reference code does not dereference it. Current Delphi's `FindVarData`-based predicates resolve only the special Variant indirection path before testing.
- For arrays, the base normally describes element storage but says nothing about dimensions, bounds, locks or size.
- Do not persist masked numeric codes as a language-independent schema. Velox exposes a subset of current Delphi's constants, and providers can use custom type numbers.

The mask operation is constant-time and side-effect free. It cannot make concurrent mutation or an expired reference safe.

The example is source-reviewed only; no Variant representation was inspected.

**External references**

- [Embarcadero `VarType`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarType)
- [Embarcadero Variant type-code table](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variant.Type)
- [Free Pascal `TVarType`](https://www.freepascal.org/docs-html/rtl/system/tvartype.html)

<small>Created 2026-07-15</small>
