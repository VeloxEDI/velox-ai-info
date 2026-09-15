---
title: Order_Response_Accepted_String
description: Provides the exact Accepted text paired with order-response outcome value 1 and recognised by its Velox converter.
sidebar_position: 407
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - order
  - order-response-status
  - string-constant
---

```Delphi
Order_Response_Accepted_String = 'Accepted'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetOrderResponseStatusNum(Order_Response_Accepted_String); // 1
end;
```

### Usage

`Order_Response_Accepted_String` provides the exact Accepted text paired with order-response outcome value 1 and recognised by its Velox converter.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Exact literal | `Accepted` |
| Numeric partner | `1` |
| Database representation | `Order_Response_Status.Description` |
| Numeric field | `Order_Hdr.ResponseStatusNum` |

### Additional Technical Info
`Order_Response_Accepted_String` is the canonical script-visible text `Accepted` paired with order-response outcome value [`Order_Response_Accepted`](./Order_Response_Accepted.md) = 1. It is a fixed conversion token, not an instruction to change order data.

**Implementation**

Velox declares and registers the exact string `Accepted`. [`GetOrderResponseStatusNum`](../../Functions/Velox/GetOrderResponseStatusNum.md) uses Delphi `SameText`, so recognised ASCII text is case-insensitive but is not trimmed. [`GetOrderResponseStatusCode`](../../Functions/Velox/GetOrderResponseStatusCode.md) returns this exact casing for value `1`.

The fresh-build `Order_Response_Status` row `1` stores `Accepted` in `Description`. The converter is compiled and does not read that table at runtime.

**Behaviour**

Use `Order_Response_Accepted_String` for canonical order-response outcome output or as input to the matching reverse converter. Different letter casing is recognised; leading or trailing whitespace produces `Null`.

The String name is not registered in the Velox tag map. Use numeric [`Order_Response_Accepted`](./Order_Response_Accepted.md) in an `<!...!>` configuration tag.

**Edge cases and quirks**

- `Accepted` can appear in another order status family. The correct converter and target field determine its domain.
- Line and response `Changed` share number `3` and text `Changed`, but remain distinct identifiers and database domains.
- Response number `2` means `Rejected`; line number `2` means `Same`. Do not infer meaning from the number alone.
- Direct string comparison may not reproduce the converter's case handling; use the converter when normalising external input.

**Side effects**

Reading or comparing `Order_Response_Accepted_String` has no I/O or state-changing effect. Conversion does not query or update the database.

**Errors**

Reading the constant does not raise an error. The converter returns `Null` for unknown or whitespace-padded text instead of raising a domain-specific exception.

**Performance and concurrency**

This immutable compiled string and its small fixed mapping require no persistent resource and carry no shared mutable state.

**Remarks**

The example is source-reviewed and non-destructive. Use the exact constant casing when emitting canonical text.

**Related entries**

- [`Order_Response_Accepted`](./Order_Response_Accepted.md) is the paired number.
- [`GetOrderResponseStatusNum`](../../Functions/Velox/GetOrderResponseStatusNum.md) performs text-to-number conversion.
- [`GetOrderResponseStatusCode`](../../Functions/Velox/GetOrderResponseStatusCode.md) performs number-to-text conversion.

<small>Created 2026-07-15</small>
