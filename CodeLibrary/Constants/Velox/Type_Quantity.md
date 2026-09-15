---
title: Type_Quantity
description: Provides Type_Quantity as a duplicate name for UOM type value 1, the same value as Type_Unit.
sidebar_position: 527
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
Type_Quantity = 1
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetUomTypeCode(Type_Quantity); // 'Unit'
end;
```

### Usage

Provides Type_Quantity as a duplicate name for UOM type value 1, the same value as Type_Unit.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `1` |
| Paired text | [`Type_Quantity_String`](./Type_Quantity_String.md) = `Unit` |
| Database domain | `Uom_Type.Num` / `Uom_Type.Description` |
| Referencing fields | `Uom.TypeNum`, `Product_Uom.UomTypeNum`, `Product_Price.UomTypeNum` |

### Additional Technical Info
`Type_Quantity` is a script-visible duplicate name for the **Unit** UOM classification. Its fixed value is `1`, paired with [`Type_Quantity_String`](./Type_Quantity_String.md).

It classifies a unit-of-measure record; it does not define an actual UOM code, pack size, price, quantity, conversion factor or inventory amount.

**Implementation**

Velox declares and registers fixed value `1`. [`GetUomTypeCode`](../../Functions/Velox/GetUomTypeCode.md) maps it to `Unit`; [`GetUomTypeNum`](../../Functions/Velox/GetUomTypeNum.md) performs the reverse mapping. The numeric name is in the tag map, so `<!Type_Quantity!>` expands to `1`.

Fresh-build VxData seeds `Uom_Type` row `1` with Description `Unit`. The database describes the domain as controlling whether UOMs can be used in quantity, tie and pallet contexts; a null `Uom.TypeNum` means the UOM is global.

The text-to-number converter checks `Type_Quantity_String` before `Type_Unit_String`. Because both text values are `Unit`, the later Unit branch is unreachable; both branches would return the same integer 1. The number-to-text converter handles value 1 through `Type_Unit` and returns `Type_Unit_String`.

**Behaviour**

Text-to-number conversion is case-insensitive but non-trimming. Unsupported or padded text returns `Null`; number-to-text conversion returns `Null` for `Null` or an unsupported number.

`Type_Quantity` and `Type_Unit` both equal `1`; `Type_Quantity_String` and `Type_Unit_String` both equal `Unit`. After evaluation they are indistinguishable.

**Edge cases and quirks**

- `Type_Quantity` and `Type_Unit` both equal `1`; `Type_Quantity_String` and `Type_Unit_String` both equal `Unit`. After evaluation they are indistinguishable.
- The duplicate value/text is intentional in native source, not a separate database row named Quantity.
- The tag expansion produces the number `1`, not the text `Unit`.
- Text conversion accepts case differences but not leading/trailing whitespace.
- A null `Uom.TypeNum` has database meaning (global UOM); none of these constants represents null/global.
- PascalScript retains no UOM-domain type after evaluation, so same-valued constants from other families are not interchangeable.

**Side effects**

Reading `Type_Quantity`, comparing it, expanding its tag or using the fixed converters has no I/O or state-changing effect.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`. Persisting a number outside the seeded/configured UOM type table can fail a foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Access and the short fixed converter cases are constant-time for practical purposes and carry no shared mutable UOM state.

**Remarks**

The example is source-reviewed and non-destructive. It does not load a UOM record or calculate quantities.

**Related entries**

- [`Type_Quantity_String`](./Type_Quantity_String.md) is the paired canonical text.
- [`GetUomTypeCode`](../../Functions/Velox/GetUomTypeCode.md) converts a supported type number to text.
- [`GetUomTypeNum`](../../Functions/Velox/GetUomTypeNum.md) converts recognised text to a type number.
- [`Type_Unit`](./Type_Unit.md) is the numerically identical canonical Unit identifier.
- [`Type_Unit_String`](./Type_Unit_String.md) is its identical `Unit` text.

<small>Created 2026-07-15</small>
