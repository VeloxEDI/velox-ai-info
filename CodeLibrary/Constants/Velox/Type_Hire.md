---
title: Type_Hire
description: Identifies the Hire UOM classification as Uom_Type.Num value 5 for Velox scripts and product metadata.
sidebar_position: 513
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
Type_Hire = 5
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetUomTypeCode(Type_Hire); // 'Hire'
end;
```

### Usage

`Type_Hire` identifies the Hire UOM classification as Uom_Type.Num value 5 for Velox scripts and product metadata.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `5` |
| Paired text | [`Type_Hire_String`](./Type_Hire_String.md) = `Hire` |
| Database domain | `Uom_Type.Num` / `Uom_Type.Description` |
| Referencing fields | `Uom.TypeNum`, `Product_Uom.UomTypeNum`, `Product_Price.UomTypeNum` |

### Additional Technical Info
`Type_Hire` is the script-visible `LongInt` identifier for the **Hire** UOM classification. Its fixed value is `5`, paired with [`Type_Hire_String`](./Type_Hire_String.md).

It classifies a unit-of-measure record; it does not define an actual UOM code, pack size, price, quantity, conversion factor or inventory amount.

**Implementation**

Velox declares and registers fixed value `5`. [`GetUomTypeCode`](../../Functions/Velox/GetUomTypeCode.md) maps it to `Hire`; [`GetUomTypeNum`](../../Functions/Velox/GetUomTypeNum.md) performs the reverse mapping. The numeric name is in the tag map, so `<!Type_Hire!>` expands to `5`.

Fresh-build VxData seeds `Uom_Type` row `5` with Description `Hire`. The database describes the domain as controlling whether UOMs can be used in quantity, tie and pallet contexts; a null `Uom.TypeNum` means the UOM is global.

The converter pair contains a distinct branch for this value and canonical text.

**Behaviour**

Text-to-number conversion is case-insensitive but non-trimming. Unsupported or padded text returns `Null`; number-to-text conversion returns `Null` for `Null` or an unsupported number.

Use this family only for UOM classification. It does not validate `Uom.Code`, `UomCode`, product pack data or price applicability.

**Edge cases and quirks**

- `Type_Quantity` and `Type_Unit` both equal `1`; `Type_Quantity_String` and `Type_Unit_String` both equal `Unit`. After evaluation they are indistinguishable.
- The duplicate value/text is intentional in native source, not a separate database row named Quantity.
- The tag expansion produces the number `5`, not the text `Hire`.
- Text conversion accepts case differences but not leading/trailing whitespace.
- A null `Uom.TypeNum` has database meaning (global UOM); none of these constants represents null/global.
- PascalScript retains no UOM-domain type after evaluation, so same-valued constants from other families are not interchangeable.

**Side effects**

Reading `Type_Hire`, comparing it, expanding its tag or using the fixed converters has no I/O or state-changing effect.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`. Persisting a number outside the seeded/configured UOM type table can fail a foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Access and the short fixed converter cases are constant-time for practical purposes and carry no shared mutable UOM state.

**Remarks**

The example is source-reviewed and non-destructive. It does not load a UOM record or calculate quantities.

**Related entries**

- [`Type_Hire_String`](./Type_Hire_String.md) is the paired canonical text.
- [`GetUomTypeCode`](../../Functions/Velox/GetUomTypeCode.md) converts a supported type number to text.
- [`GetUomTypeNum`](../../Functions/Velox/GetUomTypeNum.md) converts recognised text to a type number.

<small>Created 2026-07-15</small>
