---
title: Order_Delivered
description: Identifies the Delivered order lifecycle state as Order_Status.Num value 5 for Velox scripts and order event configuration.
sidebar_position: 390
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - order
  - lifecycle-status
  - constant
---

```Delphi
Order_Delivered = 5
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  OrderStatusNum: Integer;
begin
  OrderStatusNum := Order_Delivered;
  Value := GetOrderStatusCode(OrderStatusNum); // 'Delivered'
end;
```

### Usage

`Order_Delivered` identifies the Delivered order lifecycle state as Order_Status.Num value 5 for Velox scripts and order event configuration.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `5` |
| Canonical text | `Delivered` through [`Order_Delivered_String`](./Order_Delivered_String.md) |
| Database domain | `Order_Status.Num` |

### Additional Technical Info
`Order_Delivered` is the script-visible `LongInt` identifier for the **Delivered** order lifecycle state. Its fixed value is `5`. Use it with order `StatusNum` fields, the order-status conversion functions and order status-event configuration.

Reading the constant identifies a state; it does not transition an order, persist a value or dispatch an event.

**Implementation**

Velox declares the native constant as `5` and registers the same `LongInt` value with PascalScript. `GetOrderStatusCode` maps it to `Delivered`; `GetOrderStatusNum` performs the reverse mapping. The numeric name is also registered in the Velox constant tag map, so `<!Order_Delivered!>` expands to `5`.

A fresh VxData database seeds `Order_Status` row `5` with description `Delivered`. The domain is referenced by `Order_Hdr.StatusNum`, `Order_Consignee.StatusNum`, `Order_Event.StatusNum` and `Order_Event_Type.StatusNum`.

**Behaviour**

Use `Order_Delivered` only with a field or API that explicitly uses the order lifecycle-status domain. [`GetOrderStatusCode`](../../Functions/Velox/GetOrderStatusCode.md) returns `Delivered` for this value. [`GetOrderStatusNum`](../../Functions/Velox/GetOrderStatusNum.md) recognises that token case-insensitively but does not trim whitespace.

`Order_Event_Type` can associate an order type/status pair with send or notification event types. Some seeded combinations contain null event columns, particularly for later lifecycle states, so this constant does not guarantee that any event is configured or sent.

**Edge cases and quirks**

- Do not confuse lifecycle `StatusNum` with a general `Status` column. General status uses the separate issue/presentation scale, not values 1-7 from `Order_Status`.
- Numeric values are not type-safe in PascalScript and overlap other type/status families. Use the identifier belonging to the documented field domain.
- `Order_Status` stores the text in `Description`; it has no separate `Code` column.
- The number-to-text converter returns `Null` for `Null` or an unsupported number rather than selecting a default state.

**Side effects**

Reading `Order_Delivered`, expanding its numeric tag or comparing it has no I/O or state-changing side effect. Database writes, lifecycle transitions and event dispatch belong to the caller or module.

**Errors**

Reading the constant does not raise an error. A value from the wrong numeric domain can select incorrect logic, and persistence outside valid `Order_Status` keys can fail a relevant foreign-key constraint.

**Performance and concurrency**

This is an immutable compiled value. Access and comparison are constant-time, allocate no persistent resource and carry no shared mutable state.

**Remarks**

The example is source-reviewed and non-destructive. It exercises only the fixed numeric-to-code converter.

**Related entries**

- [`Order_Delivered_String`](./Order_Delivered_String.md) is the paired canonical text.
- [`GetOrderStatusCode`](../../Functions/Velox/GetOrderStatusCode.md) maps supported numbers to text.
- [`GetOrderStatusNum`](../../Functions/Velox/GetOrderStatusNum.md) maps recognised text to a number.

<small>Created 2026-07-15</small>
