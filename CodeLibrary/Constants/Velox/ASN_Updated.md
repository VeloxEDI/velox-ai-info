---
title: ASN_Updated
description: Identifies Velox ASN status 2, paired with the canonical Updated token within the ASN status vocabulary.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, asn, status, updated]
---

```Delphi
ASN_Updated = 2
```

### Example

```Delphi
function IsUpdatedASN(const Status: Variant): Boolean;
begin
  Result := (not VarIsNull(Status)) and (Status = ASN_Updated);
end;
```

### Usage

`ASN_Updated` identifies Velox ASN status 2, paired with the canonical Updated token within the ASN status vocabulary.

### Additional Technical Info
`ASN_Updated` is the Velox ASN status number `2`. Its canonical code is [`ASN_Updated_String`](ASN_Updated_String.md), `Updated`.

The value labels an ASN status; it does not perform an update, prove which fields changed or persist any record. A mapping/flow must decide when the status is appropriate and separately execute the required changes.

[`GetASNStatusCode`](../../Functions/Velox/GetASNStatusCode.md) maps 2 to `Updated`, while [`GetASNStatusNum`](../../Functions/Velox/GetASNStatusNum.md) maps canonical text back to 2. Unknown inputs return Null.

Number 2 and token Updated recur in other Velox vocabularies. Keep the ASN family context and do not treat equal representation as equal workflow semantics.

Test Null explicitly before comparison. Reading the constant causes no I/O or mutation.

The example is source-reviewed only; no ASN was updated.

<small>Created 2026-07-15</small>
