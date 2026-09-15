---
title: Temperature_Chilled_String
description: Provides the exact Chilled temperature-category text paired with Temperature_Chilled for Velox product and transaction metadata.
sidebar_position: 474
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - temperature
  - string-constant
---

```Delphi
Temperature_Chilled_String = 'Chilled'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Temperature_Chilled_String; // 'Chilled'
end;
```

### Usage

`Temperature_Chilled_String` provides the exact Chilled temperature-category text paired with Temperature_Chilled for Velox product and transaction metadata.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Text value | `Chilled` |
| Paired number | [`Temperature_Chilled`](./Temperature_Chilled.md) = `2` |
| Database domain | `Temperature.Num` / `Temperature.Description` |
| Fresh-build DefaultTemp | `2` (measurement unit not declared by the reviewed source/schema) |

### Additional Technical Info
`Temperature_Chilled_String` is the script-visible `String` name for the **Chilled** temperature category. Its exact value is `Chilled`, paired with [`Temperature_Chilled`](./Temperature_Chilled.md) value `2`.

The constant identifies a category only. It does not read or set a measured temperature, apply refrigeration rules, select a product, validate a shipment or convert measurement units.

**Implementation**

Velox declares and registers the exact text `Chilled`. No temperature text/number converter is registered, and the String name is not in the Velox tag map.

Fresh-build VxData seeds `Temperature` row `2` with Description `Chilled` and `DefaultTemp=2`. The reviewed SQL does not label the temperature unit; do not assume Celsius, Fahrenheit or another scale solely from this constant.

Booking, PreAdvice and Shipment header `TemperatureNum` fields have foreign keys to `Temperature`. `Product.TemperatureNum` exists in the current product table script but has no declared foreign key there.

**Behaviour**

Use the numeric identifier where a `TemperatureNum` key is expected and the text only where a category name is expected. There is no automatic conversion between the two exposed by this family.

`DefaultTemp` is database reference data, not the constant's runtime value. Reading the constant does not retrieve that field or a record-specific `TemperatureValue`.

**Edge cases and quirks**

- The measurement unit for `DefaultTemp` and `TemperatureValue` is not declared in the reviewed Pascal or SQL definitions. Confirm the deployment's data contract before calculations or threshold comparisons.
- String matching/conversion is caller-owned because no temperature converter is registered.
- The String identifier is not a tag-map entry.
- `Product.TemperatureNum` is not constrained by a foreign key in the reviewed fresh-build Product script, unlike Booking, PreAdvice and Shipment header fields.
- PascalScript retains no temperature-domain type information after evaluation, and values 1-3 overlap many unrelated constant families.

**Side effects**

Reading `Temperature_Chilled_String`, comparing it has no I/O or state-changing effect. The caller owns database lookup, assignment and temperature control.

**Errors**

Reading the constant does not raise an error. A receiving database field can reject a non-existent key, and caller-written unit conversion or text mapping can fail independently.

**Performance and concurrency**

This is an immutable compiled value. Access is constant-time and carries no shared mutable temperature state.

**Remarks**

The example is source-reviewed and non-destructive. It returns fixed category metadata only and does not test refrigeration or live measurements.

**Related entries**

- [`Temperature_Chilled`](./Temperature_Chilled.md) is the paired numeric identifier.

<small>Created 2026-07-15</small>
