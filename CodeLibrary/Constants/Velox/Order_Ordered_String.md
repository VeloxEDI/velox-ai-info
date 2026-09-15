---
title: Order_Ordered_String
description: Provides the exact Ordered text paired with order lifecycle-status value 1 and recognised by Velox order-status conversion.
sidebar_position: 403
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - order
  - lifecycle-status
  - string-constant
---

```Delphi
Order_Ordered_String = 'Ordered'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetOrderStatusNum(Order_Ordered_String); // 1
end;
```

### Usage

`Order_Ordered_String` provides the exact Ordered text paired with order lifecycle-status value 1 and recognised by Velox order-status conversion.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Exact literal | `Ordered` |
| Numeric partner | `1` through [`Order_Ordered`](./Order_Ordered.md) |
| Database representation | `Order_Status.Description` for row `1` |

### Additional Technical Info
`Order_Ordered_String` is the canonical script-visible text `Ordered` paired with order lifecycle-status value [`Order_Ordered`](./Order_Ordered.md) = 1. Use it for canonical output or as an input to the order-status converter.

The string names a lifecycle state. It does not transition, validate or persist an order.

**Implementation**

Velox declares and registers the exact `String` literal `Ordered`. [`GetOrderStatusNum`](../../Functions/Velox/GetOrderStatusNum.md) compares input with it using Delphi `SameText`, so recognised ASCII status text is case-insensitive. [`GetOrderStatusCode`](../../Functions/Velox/GetOrderStatusCode.md) returns this exact casing for value `1`.

The fresh-build `Order_Status` table stores `Ordered` in `Description`; it has no separate `Code` column.

**Behaviour**

Pass `Order_Ordered_String` to `GetOrderStatusNum` for deterministic conversion. Different letter casing is recognised, but surrounding whitespace is not removed and produces `Null`.

Unlike numeric `Order_Ordered`, `Order_Ordered_String` is not registered in the Velox constant tag map. Use `<!Order_Ordered!>` for configuration-tag expansion.

**Edge cases and quirks**

- Direct script string comparisons can have different case/coercion behaviour from `GetOrderStatusNum`; use the converter when normalising external status text.
- `Order_Hdr.StatusNum` and related `StatusNum` fields use the numeric lifecycle key. General `Status` columns use the separate issue/presentation scale.
- The same word can occur in another family. For example, `Changed` has distinct order lifecycle, order-response and order-line identifiers even where their numbers happen to match.
- Unknown or whitespace-padded input returns `Null`; there is no fallback lifecycle state.

**Side effects**

Reading or comparing `Order_Ordered_String` has no I/O or state-changing side effect. Conversion uses a fixed in-process mapping and does not query `Order_Status`.

**Errors**

Reading the constant does not raise an error. The converter returns `Null` for unknown text rather than raising an order-specific exception.

**Performance and concurrency**

This is an immutable compiled string. Access and the fixed seven-value converter are constant-time for practical purposes and carry no shared mutable Velox state.

**Remarks**

The example is source-reviewed and non-destructive. Use the constant's exact casing for canonical output even though reverse conversion is case-insensitive.

**Related entries**

- [`Order_Ordered`](./Order_Ordered.md) is the paired numeric lifecycle value.
- [`GetOrderStatusNum`](../../Functions/Velox/GetOrderStatusNum.md) performs text-to-number conversion.
- [`GetOrderStatusCode`](../../Functions/Velox/GetOrderStatusCode.md) returns canonical text.

<small>Created 2026-07-15</small>
