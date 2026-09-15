---
title: Type_SupplierASN
description: Identifies canonical Velox ASN type 2 for an ASN in the supplier-direction vocabulary.
sidebar_position: 537
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, asn, type, supplier]
---

```Delphi
Type_SupplierASN = 2
```

### Example

```Delphi
function IsSupplierASN(const ASNType: Variant): Boolean;
begin
  Result := (not VarIsNull(ASNType)) and (ASNType = Type_SupplierASN);
end;
```

### Usage

`Type_SupplierASN` identifies canonical Velox ASN type 2 for an ASN in the supplier-direction vocabulary.

### Additional Technical Info
`Type_SupplierASN` is the canonical Velox ASN type number `2`, paired with [`Type_SupplierASN_String`](Type_SupplierASN_String.md), `SupplierASN`.

Prefer it to the deprecated alias [`ASN_Type_SupplierASN`](ASN_Type_SupplierASN.md). The compiled numeric value is the same; replacing the legacy name is a source-maintenance change.

[`GetASNTypeCode`](../../Functions/Velox/GetASNTypeCode.md) converts 2 to `SupplierASN`; [`GetASNTypeNum`](../../Functions/Velox/GetASNTypeNum.md) maps the canonical text back. Unknown and Null inputs follow the documented Null behavior.

The classification does not by itself establish an EDI message standard, transport, trading-party identity or validation result. Those come from the containing Velox flow/data contract.

Number 2 is reused by many unrelated type/status families. Never infer interchangeability from the integer alone.

Reading the constant has no side effects. The example is source-reviewed only.

<small>Created 2026-07-15</small>
