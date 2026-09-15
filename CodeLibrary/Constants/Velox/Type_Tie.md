---
title: Type_Tie
description: Identifies the Tie UOM classification as Uom_Type.Num value 6 for Velox scripts and product metadata.
sidebar_position: 551
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
Type_Tie = 6
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetUomTypeCode(Type_Tie); // 'Tie'
end;
```

### Usage

`Type_Tie` identifies the Tie UOM classification as Uom_Type.Num value 6 for Velox scripts and product metadata.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `6` |
| Paired text | [`Type_Tie_String`](./Type_Tie_String.md) = `Tie` |
| Database domain | `Uom_Type.Num` / `Uom_Type.Description` |
| Referencing fields | `Uom.TypeNum`, `Product_Uom.UomTypeNum`, `Product_Price.UomTypeNum` |

### Additional Technical Info
`Type_Tie` is the script-visible `LongInt` identifier for the **Tie** UOM classification. Its fixed value is `6`, paired with [`Type_Tie_String`](./Type_Tie_String.md).

It classifies a unit-of-measure record; it does not define an actual UOM code, pack size, price, quantity, conversion factor or inventory amount.

**Implementation**

Velox declares and registers fixed value `6`. [`GetUomTypeCode`](../../Functions/Velox/GetUomTypeCode.md) maps it to `Tie`; [`GetUomTypeNum`](../../Functions/Velox/GetUomTypeNum.md) performs the reverse mapping. The numeric name is in the tag map, so `<!Type_Tie!>` expands to `6`.

Fresh-build VxData seeds `Uom_Type` row `6` with Description `Tie`. The database describes the domain as controlling whether UOMs can be used in quantity, tie and pallet contexts; a null `Uom.TypeNum` means the UOM is global.

The converter pair contains a distinct branch for this value and canonical text.

**Behaviour**

Text-to-number conversion is case-insensitive but non-trimming. Unsupported or padded text returns `Null`; number-to-text conversion returns `Null` for `Null` or an unsupported number.

Use this family only for UOM classification. It does not validate `Uom.Code`, `UomCode`, product pack data or price applicability.

**Edge cases and quirks**

- `Type_Quantity` and `Type_Unit` both equal `1`; `Type_Quantity_String` and `Type_Unit_String` both equal `Unit`. After evaluation they are indistinguishable.
- The duplicate value/text is intentional in native source, not a separate database row named Quantity.
- The tag expansion produces the number `6`, not the text `Tie`.
- Text conversion accepts case differences but not leading/trailing whitespace.
- A null `Uom.TypeNum` has database meaning (global UOM); none of these constants represents null/global.
- PascalScript retains no UOM-domain type after evaluation, so same-valued constants from other families are not interchangeable.

**Side effects**

Reading `Type_Tie`, comparing it, expanding its tag or using the fixed converters has no I/O or state-changing effect.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`. Persisting a number outside the seeded/configured UOM type table can fail a foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Access and the short fixed converter cases are constant-time for practical purposes and carry no shared mutable UOM state.

**Remarks**

The example is source-reviewed and non-destructive. It does not load a UOM record or calculate quantities.

**Related entries**

- [`Type_Tie_String`](./Type_Tie_String.md) is the paired canonical text.
- [`GetUomTypeCode`](../../Functions/Velox/GetUomTypeCode.md) converts a supported type number to text.
- [`GetUomTypeNum`](../../Functions/Velox/GetUomTypeNum.md) converts recognised text to a type number.

<small>Created 2026-07-15</small>
