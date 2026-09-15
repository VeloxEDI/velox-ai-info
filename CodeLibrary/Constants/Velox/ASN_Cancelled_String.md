---
title: ASN_Cancelled_String
description: Provides the exact canonical Cancelled token paired with Velox ASN status number 3.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, asn, status, cancelled, string]
---

```Delphi
ASN_Cancelled_String = Cancelled
```

### Example

```Delphi
procedure SetCancelledASNCode(var StatusCode: String);
begin
  StatusCode := ASN_Cancelled_String;
end;
```

### Usage

`ASN_Cancelled_String` provides the exact canonical Cancelled token paired with Velox ASN status number 3.

### Additional Technical Info
`ASN_Cancelled_String` is the string literal `'Cancelled'`, paired with numeric [`ASN_Cancelled`](ASN_Cancelled.md) (`3`). The generated declaration omits display quotes, but the compiled value is a Delphi `String`.

Emit the constant instead of retyping the token so configuration and scripts stay aligned with the product vocabulary. It is a canonical machine/application code, not localized display text and not a command that changes ASN state.

[`GetASNStatusNum`](../../Functions/Velox/GetASNStatusNum.md) accepts this token case-insensitively but does not trim: `cancelled` maps to 3, while `' Cancelled'`, `'Cancelled '` and numeric text do not. Unknown input returns Null. [`GetASNStatusCode`](../../Functions/Velox/GetASNStatusCode.md) always emits the exact capitalization shown here for status 3.

Other status families also use the word `Cancelled`; matching text alone does not make their numeric values or business transitions interchangeable. Keep the ASN field context explicit.

Reading the constant performs no I/O or mutation. The example is source-reviewed only.

<small>Created 2026-07-15</small>
