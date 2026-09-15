---
title: ASN_Delivered
description: Identifies Velox ASN status 1, paired with the canonical Delivered code within the ASN status vocabulary.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, asn, status, delivered]
---

```Delphi
ASN_Delivered = 1
```

### Example

```Delphi
function IsDeliveredASN(const Status: Variant): Boolean;
begin
  Result := (not VarIsNull(Status)) and (Status = ASN_Delivered);
end;
```

### Usage

`ASN_Delivered` identifies Velox ASN status 1, paired with the canonical Delivered code within the ASN status vocabulary.

### Additional Technical Info
`ASN_Delivered` is the Velox ASN status number `1`. Its canonical code is [`ASN_Delivered_String`](ASN_Delivered_String.md), `Delivered`.

The constant labels a value; it does not confirm physical delivery, validate a proof of delivery, change an ASN or persist anything. The flow/module that assigns the status must enforce the integration's event, evidence and sequencing rules.

[`GetASNStatusCode`](../../Functions/Velox/GetASNStatusCode.md) converts 1 to `Delivered`; [`GetASNStatusNum`](../../Functions/Velox/GetASNStatusNum.md) converts the canonical text back. Unknown values return Null rather than a default.

Many other Velox families reuse number 1 and the word Delivered. The ASN family context is part of the type contract even though the script value is only `LongInt`. Do not compare across family fields or infer equivalent workflow state.

Test nullable inputs explicitly. Reading the constant has no side effects, I/O or allocation.

The example is source-reviewed only; no ASN or delivery state was inspected at runtime.

<small>Created 2026-07-15</small>
