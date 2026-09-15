---
title: Order_Response_Rejected
description: Identifies the Rejected order-response outcome as Order_Response_Status.Num value 2 for Velox scripts and mappings.
sidebar_position: 410
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - order
  - order-response-status
  - constant
---

```Delphi
Order_Response_Rejected = 2
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetOrderResponseStatusCode(Order_Response_Rejected); // 'Rejected'
end;
```

### Usage

`Order_Response_Rejected` identifies the Rejected order-response outcome as Order_Response_Status.Num value 2 for Velox scripts and mappings.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `2` |
| Canonical text | `Rejected` |
| Database domain | `Order_Response_Status.Num` |
| Data field | `Order_Hdr.ResponseStatusNum` |

### Additional Technical Info
`Order_Response_Rejected` is the script-visible `LongInt` identifier for the **Rejected** order-response outcome. Its fixed value is `2`, paired with [`Order_Response_Rejected_String`](./Order_Response_Rejected_String.md). It is supplementary response detail and does not reject, cancel or otherwise transition an order by itself.

**Implementation**

Velox declares and registers the fixed `LongInt` value `2`. [`GetOrderResponseStatusCode`](../../Functions/Velox/GetOrderResponseStatusCode.md) maps it to `Rejected`; [`GetOrderResponseStatusNum`](../../Functions/Velox/GetOrderResponseStatusNum.md) performs the reverse mapping. The numeric name is registered in the Velox tag map, so `<!Order_Response_Rejected!>` expands to `2`.

A fresh VxData database seeds `Order_Response_Status` row `2` with description `Rejected`, and `Order_Hdr.ResponseStatusNum` references that domain.

**Behaviour**

Use `Order_Response_Rejected` only in the order-response outcome domain. The fixed reverse converter recognises the canonical token without querying the database. Reading or comparing the constant does not assign `Order_Hdr.ResponseStatusNum` or run order processing.

**Edge cases and quirks**

- PascalScript stores the value as an untyped integer for domain purposes. `2` also occurs in other order families and can have a different meaning there.
- Line and response value `3` both use text `Changed`, but they belong to different database tables, fields and converters.
- Response value `2` is `Rejected`, while line value `2` is `Same`; the identical number is not semantically interchangeable.
- Number-to-text conversion returns `Null` for `Null` or an unsupported value rather than choosing a default.

**Side effects**

Reading `Order_Response_Rejected`, expanding its tag or comparing it has no I/O or state-changing side effect. Any persistence or processing effect comes from the caller.

**Errors**

Reading the constant does not raise an error. Passing a value from another numeric domain can silently select the wrong branch before a database constraint or later business rule detects it.

**Performance and concurrency**

This is an immutable compiled value. Access and fixed-case conversion are constant-time for practical purposes and carry no shared mutable state.

**Remarks**

The example is source-reviewed and non-destructive. It performs only fixed numeric-to-text conversion.

**Related entries**

- [`Order_Response_Rejected_String`](./Order_Response_Rejected_String.md) is the paired text.
- [`GetOrderResponseStatusCode`](../../Functions/Velox/GetOrderResponseStatusCode.md) converts a supported number to text.
- [`GetOrderResponseStatusNum`](../../Functions/Velox/GetOrderResponseStatusNum.md) converts recognised text to a number.

<small>Created 2026-07-15</small>
