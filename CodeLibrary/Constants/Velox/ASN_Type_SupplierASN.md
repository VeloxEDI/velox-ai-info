---
title: ASN_Type_SupplierASN
description: Retains deprecated ASN-type value 2 for compatibility; new scripts should use Type_SupplierASN.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, asn, type, supplier, deprecated]
---

```Delphi
ASN_Type_SupplierASN = 2
```

### Example

```Delphi
procedure MigrateLegacyASNType(var ASNType: LongInt);
begin
  ASNType := Type_SupplierASN; // Preferred name; same value as ASN_Type_SupplierASN.
end;
```

### Usage

`ASN_Type_SupplierASN` retains deprecated ASN-type value 2 for compatibility; new scripts should use Type_SupplierASN.

### Additional Technical Info
`ASN_Type_SupplierASN` is a deprecated compatibility alias for [`Type_SupplierASN`](Type_SupplierASN.md). Both compile to numeric ASN type `2`.

Velox preserves the legacy registration for existing scripts, but source explicitly marks the `ASN_Type_*` pair deprecated. Use the canonical identifier in all new or touched configuration. Compiled values carry no alias metadata, so no runtime warning or behavioral difference exists.

The paired canonical token is [`Type_SupplierASN_String`](Type_SupplierASN_String.md), `SupplierASN`. The approved ASN type conversion functions map number 2 and that token regardless of which numeric identifier was used in source.

Migration only changes the script symbol, not stored data. Verify the field's semantic family because number 2 is reused by many Velox type/status vocabularies.

Reading either alias is side-effect free. The example is source-reviewed only.

<small>Created 2026-07-15</small>
