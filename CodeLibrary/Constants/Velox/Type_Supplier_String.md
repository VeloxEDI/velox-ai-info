---
title: Type_Supplier_String
description: Provides the canonical Supplier party-role text paired with Type_Supplier for Velox party conversion and configuration.
sidebar_position: 536
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - party-role
  - string-constant
---

```Delphi
Type_Supplier_String = 'Supplier'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetPartyTypeNum(Type_Supplier_String); // 2
end;
```

### Usage

`Type_Supplier_String` provides the canonical Supplier party-role text paired with Type_Supplier for Velox party conversion and configuration.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Text value | `Supplier` |
| Paired number | [`Type_Supplier`](./Type_Supplier.md) = `2` |
| Deprecated numeric alias | [`Party_Supplier`](./Party_Supplier.md) = `2` |
| Database domain | `Party_Type.Num`; `Party.TypeNum` |
| Reference-table helper result | `Party_Supplier` |
| Issue helper result | `1015` |

### Additional Technical Info
`Type_Supplier_String` is the canonical script-visible `String` for the **Supplier** party role. Its exact value is `Supplier`, paired with [`Type_Supplier`](./Type_Supplier.md) value `2`.

It identifies a party-role domain value. It does not find or create a party, add a `Party_Supplier` reference row, validate a relationship or grant access to party data.

**Implementation**

Velox declares and registers exact text `Supplier`. [`GetPartyTypeNum`](../../Functions/Velox/GetPartyTypeNum.md) compares it with Delphi `SameText` and returns `2`; [`GetPartyTypeCode`](../../Functions/Velox/GetPartyTypeCode.md) performs the reverse mapping. The String name is not in the tag map.

Fresh-build VxData seeds `Party_Type` row `2` as `Supplier`, and `Party.TypeNum` references that domain. The role-specific reference table is `Party_Supplier`.

[`GetReferenceTableForPartyType`](../../Functions/Velox/GetReferenceTableForPartyType.md) returns fixed text `Party_Supplier`. [`GetIssueForPartyType`](../../Functions/Velox/GetIssueForPartyType.md) returns integer `1015`. Their case statements use the numerically identical deprecated `Party_Supplier` label, so this preferred value selects the same branch.

**Behaviour**

Text-to-number conversion is case-insensitive but non-trimming; unsupported text returns `Null`. Number-to-text conversion returns `Null` for a `Null` or unsupported number.

The reference-table helper returns a name only and does not open a table or dataset. The issue helper returns a number only and does not create, log or persist an issue.

**Edge cases and quirks**

- `Type_Supplier` and deprecated `Party_Supplier` are numerically indistinguishable after evaluation. Use the preferred `Type_*` name in new or revised scripts.
- Current helpers retain deprecated `Party_*` labels internally. This does not make the preferred identifier unsupported; the equal integer selects the branch.
- Party-role values overlap many unrelated numeric families; PascalScript does not retain the role domain.
- Text conversion accepts case differences but not leading/trailing whitespace.
- The String identifier is not a tag-map entry.
- `GetIssueForPartyType` returns an integer, whereas exposed `Ixxxx` issue-code constants are strings. Check the receiving API before substituting representations.
- Unsupported role numbers make the table helper return `Unknown` and the issue helper return generic fallback `1029`.

**Side effects**

Reading `Type_Supplier_String`, comparing it or using the converters/helpers has no database or state-changing side effect.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`; helpers use their documented fallbacks. Persisting a role not present in `Party_Type` can fail a foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Access and fixed-case conversion/helper lookup are constant-time for practical purposes and carry no shared mutable party state.

**Remarks**

The example is source-reviewed and non-destructive. A returned table name is metadata, not SQL authorisation or proof that a matching row exists.

**Related entries**

- [`Type_Supplier`](./Type_Supplier.md) is the paired numeric identifier.
- [`Party_Supplier`](./Party_Supplier.md) is the deprecated numeric alias.
- [`GetPartyTypeCode`](../../Functions/Velox/GetPartyTypeCode.md) converts a supported role number to text.
- [`GetPartyTypeNum`](../../Functions/Velox/GetPartyTypeNum.md) converts recognised role text to a number.
- [`GetReferenceTableForPartyType`](../../Functions/Velox/GetReferenceTableForPartyType.md) and [`GetIssueForPartyType`](../../Functions/Velox/GetIssueForPartyType.md) expose fixed role metadata.

<small>Created 2026-07-15</small>
