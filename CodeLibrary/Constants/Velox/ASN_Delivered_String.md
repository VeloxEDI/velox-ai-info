---
title: ASN_Delivered_String
description: Provides the exact canonical Delivered token paired with Velox ASN status number 1.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, asn, status, delivered, string]
---

```Delphi
ASN_Delivered_String = Delivered
```

### Example

```Delphi
procedure SetDeliveredASNCode(var StatusCode: String);
begin
  StatusCode := ASN_Delivered_String;
end;
```

### Usage

`ASN_Delivered_String` provides the exact canonical Delivered token paired with Velox ASN status number 1.

### Additional Technical Info
`ASN_Delivered_String` is the string literal `'Delivered'`, paired with numeric [`ASN_Delivered`](ASN_Delivered.md) (`1`). The generated declaration omits display quotes, but the compiled value is a Delphi `String`.

Use it as the canonical ASN status token in Velox configuration and mappings. It is not proof that a shipment or order was delivered, and assigning it to a variable does not update product state.

[`GetASNStatusNum`](../../Functions/Velox/GetASNStatusNum.md) uses full-string case-insensitive comparison, so `delivered` is accepted but leading/trailing whitespace and numeric text are not. Unknown text returns Null. The reverse [`GetASNStatusCode`](../../Functions/Velox/GetASNStatusCode.md) emits this exact spelling for number 1.

The same token appears in other status domains. Always retain the ASN field/family context and use that family's converter instead of global text matching.

Reading the constant is side-effect free. The example is source-reviewed only.

<small>Created 2026-07-15</small>
