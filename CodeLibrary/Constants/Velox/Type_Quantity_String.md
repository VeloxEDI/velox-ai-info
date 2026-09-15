---
title: Type_Quantity_String
description: Provides the duplicate Unit text paired with Type_Quantity in Velox UOM classification.
sidebar_position: 528
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
Type_Quantity_String = 'Unit'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetUomTypeNum(Type_Quantity_String); // 1
end;
```

### Usage

`Type_Quantity_String` provides the duplicate Unit text paired with Type_Quantity in Velox UOM classification.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Text value | `Unit` |
| Paired number | [`Type_Quantity`](./Type_Quantity.md) = `1` |
| Database domain | `Uom_Type.Num` / `Uom_Type.Description` |
| Referencing fields | `Uom.TypeNum`, `Product_Uom.UomTypeNum`, `Product_Price.UomTypeNum` |

### Additional Technical Info
`Type_Quantity_String` is the script-visible `String` partner for [`Type_Quantity`](./Type_Quantity.md). Its exact value is `Unit`, deliberately the same as `Type_Unit_String`.

It classifies a unit-of-measure record; it does not define an actual UOM code, pack size, price, quantity, conversion factor or inventory amount.

**Implementation**

Velox declares and registers exact text `Unit`. [`GetUomTypeNum`](../../Functions/Velox/GetUomTypeNum.md) maps it to `1`; [`GetUomTypeCode`](../../Functions/Velox/GetUomTypeCode.md) performs the reverse mapping. String names are not tag entries.

Fresh-build VxData seeds `Uom_Type` row `1` with Description `Unit`. The database describes the domain as controlling whether UOMs can be used in quantity, tie and pallet contexts; a null `Uom.TypeNum` means the UOM is global.

The text-to-number converter checks `Type_Quantity_String` before `Type_Unit_String`. Because both text values are `Unit`, the later Unit branch is unreachable; both branches would return the same integer 1. The number-to-text converter handles value 1 through `Type_Unit` and returns `Type_Unit_String`.

**Behaviour**

Text-to-number conversion is case-insensitive but non-trimming. Unsupported or padded text returns `Null`; number-to-text conversion returns `Null` for `Null` or an unsupported number.

`Type_Quantity` and `Type_Unit` both equal `1`; `Type_Quantity_String` and `Type_Unit_String` both equal `Unit`. After evaluation they are indistinguishable.

**Edge cases and quirks**

- `Type_Quantity` and `Type_Unit` both equal `1`; `Type_Quantity_String` and `Type_Unit_String` both equal `Unit`. After evaluation they are indistinguishable.
- The duplicate value/text is intentional in native source, not a separate database row named Quantity.
- The String identifier is not a tag-map entry.
- Text conversion accepts case differences but not leading/trailing whitespace.
- A null `Uom.TypeNum` has database meaning (global UOM); none of these constants represents null/global.
- PascalScript retains no UOM-domain type after evaluation, so same-valued constants from other families are not interchangeable.

**Side effects**

Reading `Type_Quantity_String`, comparing it or using the fixed converters has no I/O or state-changing effect.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`. Persisting a number outside the seeded/configured UOM type table can fail a foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Access and the short fixed converter cases are constant-time for practical purposes and carry no shared mutable UOM state.

**Remarks**

The example is source-reviewed and non-destructive. It does not load a UOM record or calculate quantities.

**Related entries**

- [`Type_Quantity`](./Type_Quantity.md) is the paired numeric identifier.
- [`GetUomTypeCode`](../../Functions/Velox/GetUomTypeCode.md) converts a supported type number to text.
- [`GetUomTypeNum`](../../Functions/Velox/GetUomTypeNum.md) converts recognised text to a type number.
- [`Type_Unit`](./Type_Unit.md) is numerically identical to `Type_Quantity`.
- [`Type_Unit_String`](./Type_Unit_String.md) is the identical `Unit` text.

<small>Created 2026-07-15</small>
