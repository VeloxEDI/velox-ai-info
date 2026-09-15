---
title: Type_Outer_String
description: Provides the exact Outer UOM-type text paired with Type_Outer for Velox unit-of-measure classification.
sidebar_position: 520
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - uom-type
  - string-constant
---

```Delphi
Type_Outer_String = 'Outer'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetUomTypeNum(Type_Outer_String); // 3
end;
```

### Usage

`Type_Outer_String` provides the exact Outer UOM-type text paired with Type_Outer for Velox unit-of-measure classification.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Text value | `Outer` |
| Paired number | [`Type_Outer`](./Type_Outer.md) = `3` |
| Database domain | `Uom_Type.Num` / `Uom_Type.Description` |
| Referencing fields | `Uom.TypeNum`, `Product_Uom.UomTypeNum`, `Product_Price.UomTypeNum` |

### Additional Technical Info
`Type_Outer_String` is the script-visible `String` partner for [`Type_Outer`](./Type_Outer.md). Its exact value is `Outer`.

It classifies a unit-of-measure record; it does not define an actual UOM code, pack size, price, quantity, conversion factor or inventory amount.

**Implementation**

Velox declares and registers exact text `Outer`. [`GetUomTypeNum`](../../Functions/Velox/GetUomTypeNum.md) maps it to `3`; [`GetUomTypeCode`](../../Functions/Velox/GetUomTypeCode.md) performs the reverse mapping. String names are not tag entries.

Fresh-build VxData seeds `Uom_Type` row `3` with Description `Outer`. The database describes the domain as controlling whether UOMs can be used in quantity, tie and pallet contexts; a null `Uom.TypeNum` means the UOM is global.

The converter pair contains a distinct branch for this value and canonical text.

**Behaviour**

Text-to-number conversion is case-insensitive but non-trimming. Unsupported or padded text returns `Null`; number-to-text conversion returns `Null` for `Null` or an unsupported number.

Use this family only for UOM classification. It does not validate `Uom.Code`, `UomCode`, product pack data or price applicability.

**Edge cases and quirks**

- `Type_Quantity` and `Type_Unit` both equal `1`; `Type_Quantity_String` and `Type_Unit_String` both equal `Unit`. After evaluation they are indistinguishable.
- The duplicate value/text is intentional in native source, not a separate database row named Quantity.
- The String identifier is not a tag-map entry.
- Text conversion accepts case differences but not leading/trailing whitespace.
- A null `Uom.TypeNum` has database meaning (global UOM); none of these constants represents null/global.
- PascalScript retains no UOM-domain type after evaluation, so same-valued constants from other families are not interchangeable.

**Side effects**

Reading `Type_Outer_String`, comparing it or using the fixed converters has no I/O or state-changing effect.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`. Persisting a number outside the seeded/configured UOM type table can fail a foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Access and the short fixed converter cases are constant-time for practical purposes and carry no shared mutable UOM state.

**Remarks**

The example is source-reviewed and non-destructive. It does not load a UOM record or calculate quantities.

**Related entries**

- [`Type_Outer`](./Type_Outer.md) is the paired numeric identifier.
- [`GetUomTypeCode`](../../Functions/Velox/GetUomTypeCode.md) converts a supported type number to text.
- [`GetUomTypeNum`](../../Functions/Velox/GetUomTypeNum.md) converts recognised text to a type number.

<small>Created 2026-07-15</small>
