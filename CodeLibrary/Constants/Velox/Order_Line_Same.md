---
title: Order_Line_Same
description: Identifies the Same order-line comparison state as Order_Line_Status.Num value 2 for Velox scripts and mappings.
sidebar_position: 400
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - order
  - order-line-status
  - constant
---

```Delphi
Order_Line_Same = 2
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetOrderLineStatusCode(Order_Line_Same); // 'Same'
end;
```

### Usage

`Order_Line_Same` identifies the Same order-line comparison state as Order_Line_Status.Num value 2 for Velox scripts and mappings.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `2` |
| Canonical text | `Same` |
| Database domain | `Order_Line_Status.Num` |
| Data field | `Order_Line.StatusNum` |

### Additional Technical Info
`Order_Line_Same` is the script-visible `LongInt` identifier for the **Same** order-line comparison state. Its fixed value is `2`, paired with [`Order_Line_Same_String`](./Order_Line_Same_String.md). It describes a comparison outcome and does not prove that every business field is identical outside the owning process.

**Implementation**

Velox declares and registers the fixed `LongInt` value `2`. [`GetOrderLineStatusCode`](../../Functions/Velox/GetOrderLineStatusCode.md) maps it to `Same`; [`GetOrderLineStatusNum`](../../Functions/Velox/GetOrderLineStatusNum.md) performs the reverse mapping. The numeric name is registered in the Velox tag map, so `<!Order_Line_Same!>` expands to `2`.

A fresh VxData database seeds `Order_Line_Status` row `2` with description `Same`, and `Order_Line.StatusNum` references that domain.

**Behaviour**

Use `Order_Line_Same` only in the order-line comparison state domain. The fixed reverse converter recognises the canonical token without querying the database. Reading or comparing the constant does not assign `Order_Line.StatusNum` or run order processing.

**Edge cases and quirks**

- PascalScript stores the value as an untyped integer for domain purposes. `2` also occurs in other order families and can have a different meaning there.
- Line and response value `3` both use text `Changed`, but they belong to different database tables, fields and converters.
- Response value `2` is `Rejected`, while line value `2` is `Same`; the identical number is not semantically interchangeable.
- Number-to-text conversion returns `Null` for `Null` or an unsupported value rather than choosing a default.

**Side effects**

Reading `Order_Line_Same`, expanding its tag or comparing it has no I/O or state-changing side effect. Any persistence or processing effect comes from the caller.

**Errors**

Reading the constant does not raise an error. Passing a value from another numeric domain can silently select the wrong branch before a database constraint or later business rule detects it.

**Performance and concurrency**

This is an immutable compiled value. Access and fixed-case conversion are constant-time for practical purposes and carry no shared mutable state.

**Remarks**

The example is source-reviewed and non-destructive. It performs only fixed numeric-to-text conversion.

**Related entries**

- [`Order_Line_Same_String`](./Order_Line_Same_String.md) is the paired text.
- [`GetOrderLineStatusCode`](../../Functions/Velox/GetOrderLineStatusCode.md) converts a supported number to text.
- [`GetOrderLineStatusNum`](../../Functions/Velox/GetOrderLineStatusNum.md) converts recognised text to a number.

<small>Created 2026-07-15</small>
