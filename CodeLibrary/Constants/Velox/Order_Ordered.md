---
title: Order_Ordered
description: Identifies the Ordered order lifecycle state as Order_Status.Num value 1 for Velox scripts and order event configuration.
sidebar_position: 402
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
Order_Ordered = 1
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  OrderStatusNum: Integer;
begin
  OrderStatusNum := Order_Ordered;
  Value := GetOrderStatusCode(OrderStatusNum); // 'Ordered'
end;
```

### Usage

`Order_Ordered` identifies the Ordered order lifecycle state as Order_Status.Num value 1 for Velox scripts and order event configuration.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `1` |
| Canonical text | `Ordered` through [`Order_Ordered_String`](./Order_Ordered_String.md) |
| Database domain | `Order_Status.Num` |

### Additional Technical Info
`Order_Ordered` is the script-visible `LongInt` identifier for the **Ordered** order lifecycle state. Its fixed value is `1`. Use it with order `StatusNum` fields, the order-status conversion functions and order status-event configuration.

Reading the constant identifies a state; it does not transition an order, persist a value or dispatch an event.

**Implementation**

Velox declares the native constant as `1` and registers the same `LongInt` value with PascalScript. `GetOrderStatusCode` maps it to `Ordered`; `GetOrderStatusNum` performs the reverse mapping. The numeric name is also registered in the Velox constant tag map, so `<!Order_Ordered!>` expands to `1`.

A fresh VxData database seeds `Order_Status` row `1` with description `Ordered`. The domain is referenced by `Order_Hdr.StatusNum`, `Order_Consignee.StatusNum`, `Order_Event.StatusNum` and `Order_Event_Type.StatusNum`.

**Behaviour**

Use `Order_Ordered` only with a field or API that explicitly uses the order lifecycle-status domain. [`GetOrderStatusCode`](../../Functions/Velox/GetOrderStatusCode.md) returns `Ordered` for this value. [`GetOrderStatusNum`](../../Functions/Velox/GetOrderStatusNum.md) recognises that token case-insensitively but does not trim whitespace.

`Order_Event_Type` can associate an order type/status pair with send or notification event types. Some seeded combinations contain null event columns, particularly for later lifecycle states, so this constant does not guarantee that any event is configured or sent.

**Edge cases and quirks**

- Do not confuse lifecycle `StatusNum` with a general `Status` column. General status uses the separate issue/presentation scale, not values 1-7 from `Order_Status`.
- Numeric values are not type-safe in PascalScript and overlap other type/status families. Use the identifier belonging to the documented field domain.
- `Order_Status` stores the text in `Description`; it has no separate `Code` column.
- The number-to-text converter returns `Null` for `Null` or an unsupported number rather than selecting a default state.

**Side effects**

Reading `Order_Ordered`, expanding its numeric tag or comparing it has no I/O or state-changing side effect. Database writes, lifecycle transitions and event dispatch belong to the caller or module.

**Errors**

Reading the constant does not raise an error. A value from the wrong numeric domain can select incorrect logic, and persistence outside valid `Order_Status` keys can fail a relevant foreign-key constraint.

**Performance and concurrency**

This is an immutable compiled value. Access and comparison are constant-time, allocate no persistent resource and carry no shared mutable state.

**Remarks**

The example is source-reviewed and non-destructive. It exercises only the fixed numeric-to-code converter.

**Related entries**

- [`Order_Ordered_String`](./Order_Ordered_String.md) is the paired canonical text.
- [`GetOrderStatusCode`](../../Functions/Velox/GetOrderStatusCode.md) maps supported numbers to text.
- [`GetOrderStatusNum`](../../Functions/Velox/GetOrderStatusNum.md) maps recognised text to a number.

<small>Created 2026-07-15</small>
