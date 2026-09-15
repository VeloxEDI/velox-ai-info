---
title: "GetReferenceTableForPartyType"
description: "Returns Velox's fixed reference-table identifier for a party type, or Unknown for an unsupported number."
sidebar_position: 40
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - party-type
  - reference-table
  - mapping
---

```Delphi
Function GetReferenceTableForPartyType(const aPartyType : integer) : string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetReferenceTableForPartyType(2); // 'Party_Supplier'
end;
```

### Usage

`GetReferenceTableForPartyType` returns Velox's fixed reference-table identifier for a party type, or Unknown for an unsupported number.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aPartyType` | `integer`, `const` | Velox party type number. |
| Result | `string` | Fixed `Party_...` identifier for a recognized type; otherwise exactly `Unknown`. |

**Complete mapping**

| Party type | Party code | Result |
|---:|---|---|
| `1` | `Customer` | `Party_Customer` |
| `2` | `Supplier` | `Party_Supplier` |
| `3` | `Consignor` | `Party_Consignor` |
| `4` | `Consignee` | `Party_Consignee` |
| `5` | `Location` | `Party_Location` |
| `6` | `Carrier` | `Party_Carrier` |
| `7` | `Shipper` | `Party_Shipper` |
| `8` | `Agent` | `Party_Agent` |
| `100` | `Company` | `Party_Company` |
| any other integer | unsupported/custom | `Unknown` |

### Additional Technical Info
`GetReferenceTableForPartyType` maps a numeric Velox party type to the fixed prefixed identifier used for that party's reference-table family. It returns text for every integer; an unrecognized value becomes the literal `Unknown`.

The function only selects an identifier. It does not query a reference table, resolve a party, test whether a record exists or validate access to any database object.

**Implementation**

The scripting import binds directly to `vxVeloxEDI.GetReferenceTableForPartyType`. Its fixed integer `case` returns one string literal per public party constant; the `else` branch returns `Unknown`.

**Behaviour and edge cases**

- The function never returns `Null` or an empty string for an integer input.
- `0`, negative numbers, gaps between `8` and `100`, and values above `100` all return `Unknown`.
- Company is deliberately type `100`, not `9`.
- These results differ from [`GetPartyTypeCode`](GetPartyTypeCode.md): that function returns `Customer`, `Supplier` and so on, without the `Party_` prefix, and returns `Null` for an unknown value.
- A non-`Unknown` result says only that the number is in this compiled mapping. It does not prove that a configured table/record exists or that the caller can use it in the current execution context.
- If a result is later used to select SQL or configuration behavior, compare it against the known fixed outputs and reject `Unknown`; do not concatenate arbitrary replacement text into SQL.

**Side effects, errors and performance**

The function is pure, constant-time and performs no I/O. Every integer has a defined return value and there is no ordinary domain-specific error path.

**Related entries**

- [`GetPartyTypeCode`](GetPartyTypeCode.md) converts a party number to its unprefixed canonical code.
- [`GetPartyTypeNum`](GetPartyTypeNum.md) converts an unprefixed party code to its number.
- [`GetIssueForPartyType`](GetIssueForPartyType.md) selects the corresponding party-not-found issue number and uses a different fallback contract.

<small>Created 2026-07-15</small>
