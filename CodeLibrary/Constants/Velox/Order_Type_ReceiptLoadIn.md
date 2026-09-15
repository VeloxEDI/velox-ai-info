---
title: Order_Type_ReceiptLoadIn
description: Provides deprecated order-type alias value 4 for compatibility with scripts that predate Type_ReceiptLoadIn.
sidebar_position: 414
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - order
  - order-type
  - deprecated
  - compatibility
---

```Delphi
Order_Type_ReceiptLoadIn = 4
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Existing scripts may still use the compatibility alias.
  if Order_Type_ReceiptLoadIn = Type_ReceiptLoadIn then
    Value := Type_ReceiptLoadIn_String; // 'ReceiptLoadIn'
end;
```

### Usage

`Order_Type_ReceiptLoadIn` provides deprecated order-type alias value 4 for compatibility with scripts that predate Type_ReceiptLoadIn.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `4` |
| Preferred identifier | [`Type_ReceiptLoadIn`](./Type_ReceiptLoadIn.md) |
| Canonical code | [`Type_ReceiptLoadIn_String`](./Type_ReceiptLoadIn_String.md) = `ReceiptLoadIn` |
| Database domain | `Order_Type.Num` and `Order_Hdr.TypeNum` |

### Additional Technical Info
`Order_Type_ReceiptLoadIn` is a deprecated compatibility alias for the receipt/load-in order type. Its fixed `LongInt` value is `4`, identical to [`Type_ReceiptLoadIn`](./Type_ReceiptLoadIn.md). Existing scripts can read it, but new or revised scripts should use the `Type_*` family.

The alias identifies a type; it does not create, validate, route or persist an order.

**Implementation**

Native source places `Order_Type_ReceiptLoadIn` in an explicitly deprecated block and gives it value `4`. The PascalScript importer retains the `LongInt` name for backwards compatibility. The preferred `Type_ReceiptLoadIn` constant is independently registered with the same value.

A fresh VxData database seeds `Order_Type` row `4` with code `ReceiptLoadIn`. Current `GetOrderTypeNum` and `GetOrderTypeCode` implementations use preferred `Type_*` constants and String partners, not the deprecated `Order_Type_*` names.

**Behaviour**

Reading the alias produces the same integer as `Type_ReceiptLoadIn`. The runtime integer does not retain which identifier spelling was used. Current deprecation is advisory: registration remains available and does not itself emit a warning.

The Velox constant tag map exposes `Type_ReceiptLoadIn`, not `Order_Type_ReceiptLoadIn`. Use `<!Type_ReceiptLoadIn!>` for a numeric configuration tag.

**Edge cases and quirks**

- There is no `Order_Type_ReceiptLoadIn_String` compatibility constant. Use `Type_ReceiptLoadIn_String` for the canonical code.
- Numeric values overlap other order/status families and are not type-safe in PascalScript. Use this domain only for order type fields such as `Order_Hdr.TypeNum`.
- The generated index does not carry a deprecation flag even though native source marks this alias deprecated; the source-backed warning is therefore in the Markdown body.
- Current source declares no removal version. Do not infer either permanent support or a scheduled removal.

**Side effects**

Reading or comparing `Order_Type_ReceiptLoadIn` has no I/O or state-changing side effect. Persistence, routing and event selection belong to the caller and configuration.

**Errors**

Reading the alias does not raise an error. A value from the wrong domain can select incorrect processing; persistence outside valid `Order_Type` keys can fail the relevant database constraint.

**Performance and concurrency**

This is an immutable compiled value. Access is constant-time, allocates no persistent resource and carries no shared mutable state.

**Remarks**

The example is source-reviewed and non-destructive. When editing an existing script, replace the deprecated name with `Type_ReceiptLoadIn`; the numeric result remains `4`.

**Related entries**

- [`Type_ReceiptLoadIn`](./Type_ReceiptLoadIn.md) is the preferred numeric identifier.
- [`Type_ReceiptLoadIn_String`](./Type_ReceiptLoadIn_String.md) is the canonical order-type code.
- [`GetOrderTypeNum`](../../Functions/Velox/GetOrderTypeNum.md) converts recognised code text to a number.
- [`GetOrderTypeCode`](../../Functions/Velox/GetOrderTypeCode.md) returns canonical code text.

<small>Created 2026-07-15</small>
