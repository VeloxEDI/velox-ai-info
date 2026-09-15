---
title: Order_Line_Changed_String
description: Provides the exact Changed text paired with order-line comparison state value 3 and recognised by its Velox converter.
sidebar_position: 395
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - order
  - order-line-status
  - string-constant
---

```Delphi
Order_Line_Changed_String = 'Changed'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetOrderLineStatusNum(Order_Line_Changed_String); // 3
end;
```

### Usage

`Order_Line_Changed_String` provides the exact Changed text paired with order-line comparison state value 3 and recognised by its Velox converter.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Exact literal | `Changed` |
| Numeric partner | `3` |
| Database representation | `Order_Line_Status.Description` |
| Numeric field | `Order_Line.StatusNum` |

### Additional Technical Info
`Order_Line_Changed_String` is the canonical script-visible text `Changed` paired with order-line comparison state value [`Order_Line_Changed`](./Order_Line_Changed.md) = 3. It is a fixed conversion token, not an instruction to change order data.

**Implementation**

Velox declares and registers the exact string `Changed`. [`GetOrderLineStatusNum`](../../Functions/Velox/GetOrderLineStatusNum.md) uses Delphi `SameText`, so recognised ASCII text is case-insensitive but is not trimmed. [`GetOrderLineStatusCode`](../../Functions/Velox/GetOrderLineStatusCode.md) returns this exact casing for value `3`.

The fresh-build `Order_Line_Status` row `3` stores `Changed` in `Description`. The converter is compiled and does not read that table at runtime.

**Behaviour**

Use `Order_Line_Changed_String` for canonical order-line comparison state output or as input to the matching reverse converter. Different letter casing is recognised; leading or trailing whitespace produces `Null`.

The String name is not registered in the Velox tag map. Use numeric [`Order_Line_Changed`](./Order_Line_Changed.md) in an `<!...!>` configuration tag.

**Edge cases and quirks**

- `Changed` can appear in another order status family. The correct converter and target field determine its domain.
- Line and response `Changed` share number `3` and text `Changed`, but remain distinct identifiers and database domains.
- Response number `2` means `Rejected`; line number `2` means `Same`. Do not infer meaning from the number alone.
- Direct string comparison may not reproduce the converter's case handling; use the converter when normalising external input.

**Side effects**

Reading or comparing `Order_Line_Changed_String` has no I/O or state-changing effect. Conversion does not query or update the database.

**Errors**

Reading the constant does not raise an error. The converter returns `Null` for unknown or whitespace-padded text instead of raising a domain-specific exception.

**Performance and concurrency**

This immutable compiled string and its small fixed mapping require no persistent resource and carry no shared mutable state.

**Remarks**

The example is source-reviewed and non-destructive. Use the exact constant casing when emitting canonical text.

**Related entries**

- [`Order_Line_Changed`](./Order_Line_Changed.md) is the paired number.
- [`GetOrderLineStatusNum`](../../Functions/Velox/GetOrderLineStatusNum.md) performs text-to-number conversion.
- [`GetOrderLineStatusCode`](../../Functions/Velox/GetOrderLineStatusCode.md) performs number-to-text conversion.

<small>Created 2026-07-15</small>
