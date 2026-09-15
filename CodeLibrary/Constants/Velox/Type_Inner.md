---
title: Type_Inner
description: Identifies the Inner UOM classification as Uom_Type.Num value 2 for Velox scripts and product metadata.
sidebar_position: 515
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - uom-type
  - constant
---

```Delphi
Type_Inner = 2
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetUomTypeCode(Type_Inner); // 'Inner'
end;
```

### Usage

`Type_Inner` identifies the Inner UOM classification as Uom_Type.Num value 2 for Velox scripts and product metadata.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `2` |
| Paired text | [`Type_Inner_String`](./Type_Inner_String.md) = `Inner` |
| Database domain | `Uom_Type.Num` / `Uom_Type.Description` |
| Referencing fields | `Uom.TypeNum`, `Product_Uom.UomTypeNum`, `Product_Price.UomTypeNum` |

### Additional Technical Info
`Type_Inner` is the script-visible `LongInt` identifier for the **Inner** UOM classification. Its fixed value is `2`, paired with [`Type_Inner_String`](./Type_Inner_String.md).

It classifies a unit-of-measure record; it does not define an actual UOM code, pack size, price, quantity, conversion factor or inventory amount.

**Implementation**

Velox declares and registers fixed value `2`. [`GetUomTypeCode`](../../Functions/Velox/GetUomTypeCode.md) maps it to `Inner`; [`GetUomTypeNum`](../../Functions/Velox/GetUomTypeNum.md) performs the reverse mapping. The numeric name is in the tag map, so `<!Type_Inner!>` expands to `2`.

Fresh-build VxData seeds `Uom_Type` row `2` with Description `Inner`. The database describes the domain as controlling whether UOMs can be used in quantity, tie and pallet contexts; a null `Uom.TypeNum` means the UOM is global.

The converter pair contains a distinct branch for this value and canonical text.

**Behaviour**

Text-to-number conversion is case-insensitive but non-trimming. Unsupported or padded text returns `Null`; number-to-text conversion returns `Null` for `Null` or an unsupported number.

Use this family only for UOM classification. It does not validate `Uom.Code`, `UomCode`, product pack data or price applicability.

**Edge cases and quirks**

- `Type_Quantity` and `Type_Unit` both equal `1`; `Type_Quantity_String` and `Type_Unit_String` both equal `Unit`. After evaluation they are indistinguishable.
- The duplicate value/text is intentional in native source, not a separate database row named Quantity.
- The tag expansion produces the number `2`, not the text `Inner`.
- Text conversion accepts case differences but not leading/trailing whitespace.
- A null `Uom.TypeNum` has database meaning (global UOM); none of these constants represents null/global.
- PascalScript retains no UOM-domain type after evaluation, so same-valued constants from other families are not interchangeable.

**Side effects**

Reading `Type_Inner`, comparing it, expanding its tag or using the fixed converters has no I/O or state-changing effect.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`. Persisting a number outside the seeded/configured UOM type table can fail a foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Access and the short fixed converter cases are constant-time for practical purposes and carry no shared mutable UOM state.

**Remarks**

The example is source-reviewed and non-destructive. It does not load a UOM record or calculate quantities.

**Related entries**

- [`Type_Inner_String`](./Type_Inner_String.md) is the paired canonical text.
- [`GetUomTypeCode`](../../Functions/Velox/GetUomTypeCode.md) converts a supported type number to text.
- [`GetUomTypeNum`](../../Functions/Velox/GetUomTypeNum.md) converts recognised text to a type number.

<small>Created 2026-07-15</small>
