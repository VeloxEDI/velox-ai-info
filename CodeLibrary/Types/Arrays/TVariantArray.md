---
title: TVariantArray
description: Stores a zero-based managed sequence whose elements can carry independent Variant types and null states.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, array, variant, 'null', empty, dynamic]
---

```Delphi
TVariantArray = array of Variant
```

### Example

```Delphi
procedure BuildValues(var Values: TVariantArray);
begin
  SetLength(Values, 4);
  Values[0] := 42;
  Values[1] := 'ready';
  Values[2] := Null;
  Values[3] := True;
end;
```

### Usage

`TVariantArray` stores a zero-based managed sequence whose elements can carry independent Variant types and null states.

#### Element state

Each element can have a different type and state:

- a newly grown element is initialized as an empty/unassigned Variant;
- `Null` represents an explicitly missing or database-null value and propagates through many expressions;
- strings, Boolean values and numeric widths retain their own Variant type codes;
- an element can itself contain an array or another supported managed value;
- conversion can raise when the actual state cannot be converted to the requested type.

Use [`VarIsEmpty`](../../Functions/Variant/VarIsEmpty.md), [`VarIsNull`](../../Functions/Variant/VarIsNull.md) and [`VarType`](../../Functions/Variant/VarType.md) before strict conversion when the producer is not fully controlled. Define whether Empty, Null and `''` are distinct in the receiving configuration or flow.

#### Array state, copying and interop

`SetLength(Values, N)` changes the element count, not the type of any retained element. Shrinking finalizes removed Variants; growing initializes new Empty elements. A negative requested length is silently clamped to zero by the current runtime.

Array assignment does not immediately copy all elements. Changing an element through one variable can affect the other. Changing the length can separate the arrays, but `SetLength(A, Length(A))` does not. Copy elements explicitly when independent editing is required, and decide whether nested values also need their own copies.

When a Velox function returns a Variant array, the runtime can convert its first dimension into a Velox scripting dynamic array. Lower bounds are normalized into the script's zero-based result, and each element is converted to the destination element type. Multidimensional or provider-specific Variant-array behavior must be confirmed at the function boundary rather than assumed from this type declaration.

### Additional Technical Info
`TVariantArray` is a standard type created by the modified PascalScript compiler. It is a PascalScript dynamic array whose elements are independent [`Variant`](../DataTypes/Variant.md) values. This is not the same representation as a single COM/Delphi Variant that happens to contain a `VarArray`.

**Related Code Library entries**

- [Variant](../DataTypes/Variant.md) - element type tags, Empty, Null and conversion rules.
- [Arrays](../Arrays.md) - shared dynamic-array behavior and size controls.

**External references**

- [Embarcadero structured types](https://docwiki.embarcadero.com/RADStudio/Athens/en/Structured_Types_%28Delphi%29) - dynamic-array assignment and bounds.
- [Embarcadero System.SetLength](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.SetLength) - resizing managed arrays.
- [Free Pascal dynamic arrays](https://www.freepascal.org/docs-html/ref/refsu14.html) - compatible zero-based dynamic arrays.
- [Free Pascal managed types](https://www.freepascal.org/docs-html/ref/refse20.html) - compatible managed-type lifetime concepts.

<small>Created 2026-07-15</small>
