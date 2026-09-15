---
title: Type_CustomerASN_String
description: Provides the exact canonical CustomerASN token paired with Velox ASN type number 1.
sidebar_position: 496
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, asn, type, customer, string]
---

```Delphi
Type_CustomerASN_String = CustomerASN
```

### Example

```Delphi
procedure SetCustomerASNTypeCode(var TypeCode: String);
begin
  TypeCode := Type_CustomerASN_String;
end;
```

### Usage

`Type_CustomerASN_String` provides the exact canonical CustomerASN token paired with Velox ASN type number 1.

### Additional Technical Info
`Type_CustomerASN_String` is the string literal `'CustomerASN'`, paired with numeric [`Type_CustomerASN`](Type_CustomerASN.md) (`1`). The generated declaration omits display quotes, but the compiled value is a Delphi `String`.

Use it for the canonical ASN type token rather than constructing text from UI labels or legacy symbol names. There is no separate `ASN_Type_CustomerASN_String` compatibility constant.

[`GetASNTypeNum`](../../Functions/Velox/GetASNTypeNum.md) accepts case variants such as `customerasn` but does not trim or parse numeric text. [`GetASNTypeCode`](../../Functions/Velox/GetASNTypeCode.md) emits the exact spelling shown here for number 1. Unknown values return Null.

The token is a product vocabulary value, not a localized caption or proof of document direction. Reading it performs no I/O or mutation.

The example is source-reviewed only.

<small>Created 2026-07-15</small>
