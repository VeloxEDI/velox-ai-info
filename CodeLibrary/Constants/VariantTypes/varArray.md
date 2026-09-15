---
title: varArray
description: Marks a Variant as Automation array storage whose element base code remains in the low 12 type bits.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, array, safearray, flag]
---

```Delphi
varArray = 8192
```

### Example

```Delphi
function IsIntegerArray(const Value: Variant): Boolean;
var
  Code: TVarType;
begin
  Code := VarType(Value);
  Result := ((Code and varArray) <> 0) and
            ((Code and varTypeMask) = varInteger);
end;
```

### Usage

`varArray` marks a Variant as Automation array storage whose element base code remains in the low 12 type bits.

### Additional Technical Info
`varArray` is the [`TVarType`](../../Types/DataTypes/TVarType.md) flag `$2000`. It indicates that a Variant owns or references Automation `SAFEARRAY` storage. The low 12 bits identify the element base type, so an Integer array normally reports `varArray or varInteger`, not `varArray` by itself.

Test the flag with `and`; do not compare the complete [`VarType`](../../Functions/Variant/VarType.md) result to `varArray`. Velox's [`VarArrayCreate`](../../Functions/Variant/VarArrayCreate.md) wrapper creates one zero-based dimension and returns the requested element code combined with this flag.

**What the flag does not tell you**

- It does not provide dimension count, lower/upper bounds, element count or allocation size.
- It does not say whether `varByRef` is also present or whether another Variant aliases the array.
- It does not validate an index, element conversion or the array's current lock state.
- It is not a `TBytes` dynamic array. `varArray or varByte` is the preferred Automation representation for binary octets.

Pass only an allowed base code—not `varArray` or [`varByRef`](varByRef.md)—as the element type to `VarArrayCreate`. Use `varOleStr` for Automation-compatible string arrays and [`varVariant`](varVariant.md) when elements must have different types. Fixed-type arrays convert each assigned value and can raise conversion, range, allocation, lock or bounds exceptions.

Arrays are managed mutable storage. Copying an ordinary Variant array follows Delphi/Automation ownership rules; by-reference forms can share a live array. Bound externally supplied lengths, avoid concurrent mutation and never infer safe memory usage from this bit alone.

The example is source-reviewed only; no array was allocated or read.

**External references**

- [Embarcadero `VarArrayCreate`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarArrayCreate)
- [Embarcadero `VarArrayRef`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarArrayRef)
- [Free Pascal `varArray`](https://www.freepascal.org/docs-html/rtl/system/vararray.html)

<small>Created 2026-07-15</small>
