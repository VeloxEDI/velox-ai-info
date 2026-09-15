---
title: ASN_Cancelled
description: Identifies Velox ASN status 3, whose canonical code is Cancelled and whose meaning is scoped to the ASN status family.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, asn, status, cancelled]
---

```Delphi
ASN_Cancelled = 3
```

### Example

```Delphi
function IsCancelledASN(const Status: Variant): Boolean;
begin
  Result := (not VarIsNull(Status)) and (Status = ASN_Cancelled);
end;
```

### Usage

`ASN_Cancelled` identifies Velox ASN status 3, whose canonical code is Cancelled and whose meaning is scoped to the ASN status family.

### Additional Technical Info
`ASN_Cancelled` is the Velox ASN status number `3`. Its paired canonical token is [`ASN_Cancelled_String`](ASN_Cancelled_String.md), `Cancelled`.

Use this constant when a field or API explicitly expects the numeric ASN status vocabulary. It does not cancel an ASN, update a database or run an event; it is an immutable script value. The producing flow remains responsible for deciding when cancellation is valid and for performing any state transition.

[`GetASNStatusCode`](../../Functions/Velox/GetASNStatusCode.md) maps this value to `Cancelled`. Unknown numbers and Null return Null. [`GetASNStatusNum`](../../Functions/Velox/GetASNStatusNum.md) performs the reverse mapping from canonical text.

The number `3` is reused by unrelated Velox families. Do not treat an order, invoice, POD, tracking or general status with value 3 as an ASN cancellation. Preserve the semantic field/family in configuration and payload contracts.

Test Null before numeric comparison or assignment to a non-nullable field. No I/O, allocation or side effect occurs when reading this constant.

The example is source-reviewed only; no ASN state was changed.

<small>Created 2026-07-15</small>
