---
title: ASN_Updated_String
description: Provides the exact canonical Updated token paired with Velox ASN status number 2.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, asn, status, updated, string]
---

```Delphi
ASN_Updated_String = Updated
```

### Example

```Delphi
procedure SetUpdatedASNCode(var StatusCode: String);
begin
  StatusCode := ASN_Updated_String;
end;
```

### Usage

`ASN_Updated_String` provides the exact canonical Updated token paired with Velox ASN status number 2.

### Additional Technical Info
`ASN_Updated_String` is the string literal `'Updated'`, paired with numeric [`ASN_Updated`](ASN_Updated.md) (`2`). The generated declaration omits display quotes, but the compiled value is a Delphi `String`.

Use this exact token for the ASN status vocabulary. It is neither localized display text nor an instruction that mutates an ASN.

[`GetASNStatusNum`](../../Functions/Velox/GetASNStatusNum.md) ignores ASCII letter case but performs no trim, so only an otherwise exact token maps to 2. Unknown text returns Null. [`GetASNStatusCode`](../../Functions/Velox/GetASNStatusCode.md) emits the capitalization shown here.

Other families also expose Updated. Keep the field/family explicit and use the ASN converter rather than assuming global token uniqueness.

Reading the constant is side-effect free. The example is source-reviewed only.

<small>Created 2026-07-15</small>
