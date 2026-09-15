---
title: Type_SupplierASN_String
description: Provides the exact canonical SupplierASN token paired with Velox ASN type number 2.
sidebar_position: 538
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, asn, type, supplier, string]
---

```Delphi
Type_SupplierASN_String = SupplierASN
```

### Example

```Delphi
procedure SetSupplierASNTypeCode(var TypeCode: String);
begin
  TypeCode := Type_SupplierASN_String;
end;
```

### Usage

`Type_SupplierASN_String` provides the exact canonical SupplierASN token paired with Velox ASN type number 2.

### Additional Technical Info
`Type_SupplierASN_String` is the string literal `'SupplierASN'`, paired with numeric [`Type_SupplierASN`](Type_SupplierASN.md) (`2`). The generated declaration omits display quotes, but the compiled value is a Delphi `String`.

Use this constant for the canonical ASN type token. There is no separate string alias for deprecated `ASN_Type_SupplierASN`.

[`GetASNTypeNum`](../../Functions/Velox/GetASNTypeNum.md) compares case-insensitively but without trimming, while [`GetASNTypeCode`](../../Functions/Velox/GetASNTypeCode.md) emits this exact capitalization. Unknown inputs return Null.

The token is a fixed product code, not localized display text or independent evidence of message direction. Reading it causes no I/O or mutation.

The example is source-reviewed only.

<small>Created 2026-07-15</small>
