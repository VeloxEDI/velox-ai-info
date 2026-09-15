---
title: "GetOrderTypeNumForASNType"
description: "Maps a Velox ASN type code to its corresponding numeric order type."
sidebar_position: 32
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mapping
  - asn-type
  - order-type
---

```Delphi
Function GetOrderTypeNumForASNType(const aASNTypeCode : string) : Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetOrderTypeNumForASNType('CustomerASN'); // 1
end;
```

### Usage

`GetOrderTypeNumForASNType` maps a Velox ASN type code to its corresponding numeric order type.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aASNTypeCode` | `string`, `const` | Canonical ASN type code. Matching is case-insensitive but otherwise exact. |
| Result | `Variant` | Order type integer for a recognized input, otherwise `Null`. |

**Behaviour and edge cases**

- Customer versus supplier direction selects SalesOrder versus PurchaseOrder.
- Matching ignores ASCII letter case but does not trim. Whitespace, punctuation differences, empty text and unknown/custom type codes return `Null`.
- The function recognizes source-family codes only. Passing `SalesOrder`, `PurchaseOrder` or numeric text is not an identity conversion and returns `Null`.
- The result describes type/direction only; it does not copy, create, validate or change an order.
- The mapping is not extensible through customer configuration.
- Test `VarIsNull` before treating the result as a valid order type.

### Additional Technical Info
`GetOrderTypeNumForASNType` converts a ASN type code into the order type number that represents the same customer/supplier direction. It is a compiled business mapping; it does not inspect a document, order record, trading party or database configuration.

**Complete transformation**

| Input ASN type code | Order type code | Order type number |
|---|---|---:|
| `CustomerASN` | `SalesOrder` | `1` |
| `SupplierASN` | `PurchaseOrder` | `2` |

**Implementation**

The function tests each supported input with installed Delphi `SameText`. It returns the integer `Type_SalesOrder` or `Type_PurchaseOrder` constant. The final branch returns `Null`. There is no intermediate call to another public conversion function.

**Side effects, errors and performance**

The function is pure, performs no I/O and runs over a small fixed comparison chain. Ordinary unmatched string input returns `Null`.

**Related entries**

- [`GetOrderTypeForASNType`](GetOrderTypeForASNType.md) returns the same directional mapping as a code.
- [`GetASNTypeCode`](GetASNTypeCode.md) documents the reciprocal ASN type number/code domain accepted here.
- [`GetOrderTypeCode`](GetOrderTypeCode.md) and [`GetOrderTypeNum`](GetOrderTypeNum.md) convert within the output order-type domain.
- [Embarcadero: `System.SysUtils.SameText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.SameText)
- [Free Pascal: `SameText`](https://www.freepascal.org/docs-html/rtl/sysutils/sametext.html)

<small>Created 2026-07-15</small>
