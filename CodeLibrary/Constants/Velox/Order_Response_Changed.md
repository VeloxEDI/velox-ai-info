---
title: Order_Response_Changed
description: Identifies the Changed order-response outcome as Order_Response_Status.Num value 3 for Velox scripts and mappings.
sidebar_position: 408
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
Order_Response_Changed = 3
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetOrderResponseStatusCode(Order_Response_Changed); // 'Changed'
end;
```

### Usage

`Order_Response_Changed` identifies the Changed order-response outcome as Order_Response_Status.Num value 3 for Velox scripts and mappings.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `3` |
| Canonical text | `Changed` |
| Database domain | `Order_Response_Status.Num` |
| Data field | `Order_Hdr.ResponseStatusNum` |

### Additional Technical Info
`Order_Response_Changed` is the script-visible `LongInt` identifier for the **Changed** order-response outcome. Its fixed value is `3`, paired with [`Order_Response_Changed_String`](./Order_Response_Changed_String.md). It is supplementary response detail and does not apply changes or set the order lifecycle by itself.

**Implementation**

Velox declares and registers the fixed `LongInt` value `3`. [`GetOrderResponseStatusCode`](../../Functions/Velox/GetOrderResponseStatusCode.md) maps it to `Changed`; [`GetOrderResponseStatusNum`](../../Functions/Velox/GetOrderResponseStatusNum.md) performs the reverse mapping. The numeric name is registered in the Velox tag map, so `<!Order_Response_Changed!>` expands to `3`.

A fresh VxData database seeds `Order_Response_Status` row `3` with description `Changed`, and `Order_Hdr.ResponseStatusNum` references that domain.

**Behaviour**

Use `Order_Response_Changed` only in the order-response outcome domain. The fixed reverse converter recognises the canonical token without querying the database. Reading or comparing the constant does not assign `Order_Hdr.ResponseStatusNum` or run order processing.

**Edge cases and quirks**

- PascalScript stores the value as an untyped integer for domain purposes. `3` also occurs in other order families and can have a different meaning there.
- Line and response value `3` both use text `Changed`, but they belong to different database tables, fields and converters.
- Response value `2` is `Rejected`, while line value `2` is `Same`; the identical number is not semantically interchangeable.
- Number-to-text conversion returns `Null` for `Null` or an unsupported value rather than choosing a default.

**Side effects**

Reading `Order_Response_Changed`, expanding its tag or comparing it has no I/O or state-changing side effect. Any persistence or processing effect comes from the caller.

**Errors**

Reading the constant does not raise an error. Passing a value from another numeric domain can silently select the wrong branch before a database constraint or later business rule detects it.

**Performance and concurrency**

This is an immutable compiled value. Access and fixed-case conversion are constant-time for practical purposes and carry no shared mutable state.

**Remarks**

The example is source-reviewed and non-destructive. It performs only fixed numeric-to-text conversion.

**Related entries**

- [`Order_Response_Changed_String`](./Order_Response_Changed_String.md) is the paired text.
- [`GetOrderResponseStatusCode`](../../Functions/Velox/GetOrderResponseStatusCode.md) converts a supported number to text.
- [`GetOrderResponseStatusNum`](../../Functions/Velox/GetOrderResponseStatusNum.md) converts recognised text to a number.

<small>Created 2026-07-15</small>
