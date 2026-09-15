---
title: Type_CustomerASN
description: Identifies canonical Velox ASN type 1 for an ASN in the customer-direction vocabulary.
sidebar_position: 495
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, asn, type, customer]
---

```Delphi
Type_CustomerASN = 1
```

### Example

```Delphi
function IsCustomerASN(const ASNType: Variant): Boolean;
begin
  Result := (not VarIsNull(ASNType)) and (ASNType = Type_CustomerASN);
end;
```

### Usage

`Type_CustomerASN` identifies canonical Velox ASN type 1 for an ASN in the customer-direction vocabulary.

### Additional Technical Info
`Type_CustomerASN` is the canonical Velox ASN type number `1`, paired with [`Type_CustomerASN_String`](Type_CustomerASN_String.md), `CustomerASN`.

Use the constant instead of its deprecated alias [`ASN_Type_CustomerASN`](ASN_Type_CustomerASN.md). Both values are identical, but the canonical naming matches the other Velox `Type_*` vocabularies and is the supported choice for new configuration.

[`GetASNTypeCode`](../../Functions/Velox/GetASNTypeCode.md) converts this value to `CustomerASN`; [`GetASNTypeNum`](../../Functions/Velox/GetASNTypeNum.md) performs the reverse mapping. Unknown or Null inputs return Null under the documented Variant boundaries.

“Customer” is a Velox directional/business classification, not evidence of a particular EDI standard message, trading-party role, document validity or transport direction by itself. Use the surrounding flow and data contract to establish those facts.

Value 1 is not globally unique. Do not substitute order, invoice, party, POD or other type constants solely because their numbers match.

Reading the constant has no side effects. The example is source-reviewed only.

<small>Created 2026-07-15</small>
