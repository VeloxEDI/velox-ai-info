---
title: ASN_Type_CustomerASN
description: Retains deprecated ASN-type value 1 for compatibility; new scripts should use Type_CustomerASN.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, asn, type, customer, deprecated]
---

```Delphi
ASN_Type_CustomerASN = 1
```

### Example

```Delphi
procedure MigrateLegacyASNType(var ASNType: LongInt);
begin
  ASNType := Type_CustomerASN; // Preferred name; same value as ASN_Type_CustomerASN.
end;
```

### Usage

`ASN_Type_CustomerASN` retains deprecated ASN-type value 1 for compatibility; new scripts should use Type_CustomerASN.

### Additional Technical Info
`ASN_Type_CustomerASN` is a deprecated compatibility alias for [`Type_CustomerASN`](Type_CustomerASN.md). Both compile to numeric ASN type `1`.

Velox still registers the legacy name so existing scripts continue to compile. Product source explicitly places both `ASN_Type_*` declarations under a `Deprecated` comment; new and modified configuration should use the canonical `Type_CustomerASN` name. There is no runtime warning because the values are indistinguishable after compilation.

The paired canonical token is [`Type_CustomerASN_String`](Type_CustomerASN_String.md), `CustomerASN`. [`GetASNTypeCode`](../../Functions/Velox/GetASNTypeCode.md) and [`GetASNTypeNum`](../../Functions/Velox/GetASNTypeNum.md) operate on the canonical family, not on identifier names.

Deprecation concerns the symbol name, not the Customer ASN business concept. Migration is a source-only replacement and does not require changing stored value 1. Still verify that the field is an ASN type, because other families reuse the same number.

Reading either alias is side-effect free. The example is source-reviewed only.

<small>Created 2026-07-15</small>
