---
title: Temperature_Ambient
description: Identifies the Ambient temperature category as Temperature.Num value 1, whose fresh-build default value is 20.
sidebar_position: 471
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - temperature
  - constant
---

```Delphi
Temperature_Ambient = 1
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Temperature_Ambient; // 1
end;
```

### Usage

`Temperature_Ambient` identifies the Ambient temperature category as Temperature.Num value 1, whose fresh-build default value is 20.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `1` |
| Paired text | [`Temperature_Ambient_String`](./Temperature_Ambient_String.md) = `Ambient` |
| Database domain | `Temperature.Num` / `Temperature.Description` |
| Fresh-build DefaultTemp | `20` (measurement unit not declared by the reviewed source/schema) |

### Additional Technical Info
`Temperature_Ambient` is the script-visible `LongInt` identifier for the **Ambient** temperature category. Its fixed value is `1`, paired with [`Temperature_Ambient_String`](./Temperature_Ambient_String.md).

The constant identifies a category only. It does not read or set a measured temperature, apply refrigeration rules, select a product, validate a shipment or convert measurement units.

**Implementation**

Velox declares and registers the fixed `LongInt` value `1`. The numeric name is in the Velox tag map, so `<!Temperature_Ambient!>` expands to `1`. No temperature text/number converter is registered.

Fresh-build VxData seeds `Temperature` row `1` with Description `Ambient` and `DefaultTemp=20`. The reviewed SQL does not label the temperature unit; do not assume Celsius, Fahrenheit or another scale solely from this constant.

Booking, PreAdvice and Shipment header `TemperatureNum` fields have foreign keys to `Temperature`. `Product.TemperatureNum` exists in the current product table script but has no declared foreign key there.

**Behaviour**

Use the numeric identifier where a `TemperatureNum` key is expected and the text only where a category name is expected. There is no automatic conversion between the two exposed by this family.

`DefaultTemp` is database reference data, not the constant's runtime value. Reading the constant does not retrieve that field or a record-specific `TemperatureValue`.

**Edge cases and quirks**

- The measurement unit for `DefaultTemp` and `TemperatureValue` is not declared in the reviewed Pascal or SQL definitions. Confirm the deployment's data contract before calculations or threshold comparisons.
- String matching/conversion is caller-owned because no temperature converter is registered.
- The tag expansion produces the number `1`, not the text `Ambient` or the default temperature `20`.
- `Product.TemperatureNum` is not constrained by a foreign key in the reviewed fresh-build Product script, unlike Booking, PreAdvice and Shipment header fields.
- PascalScript retains no temperature-domain type information after evaluation, and values 1-3 overlap many unrelated constant families.

**Side effects**

Reading `Temperature_Ambient`, comparing it, or expanding its tag has no I/O or state-changing effect. The caller owns database lookup, assignment and temperature control.

**Errors**

Reading the constant does not raise an error. A receiving database field can reject a non-existent key, and caller-written unit conversion or text mapping can fail independently.

**Performance and concurrency**

This is an immutable compiled value. Access is constant-time and carries no shared mutable temperature state.

**Remarks**

The example is source-reviewed and non-destructive. It returns fixed category metadata only and does not test refrigeration or live measurements.

**Related entries**

- [`Temperature_Ambient_String`](./Temperature_Ambient_String.md) is the paired category text.

<small>Created 2026-07-15</small>
