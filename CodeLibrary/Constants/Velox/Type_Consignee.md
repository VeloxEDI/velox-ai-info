---
title: Type_Consignee
description: Identifies the preferred Consignee party role as Party_Type.Num value 4 for Velox scripts and mappings.
sidebar_position: 489
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - party-role
  - constant
---

```Delphi
Type_Consignee = 4
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetPartyTypeCode(Type_Consignee); // 'Consignee'
end;
```

### Usage

`Type_Consignee` identifies the preferred Consignee party role as Party_Type.Num value 4 for Velox scripts and mappings.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `4` |
| Paired text | [`Type_Consignee_String`](./Type_Consignee_String.md) = `Consignee` |
| Deprecated numeric alias | [`Party_Consignee`](./Party_Consignee.md) = `4` |
| Database domain | `Party_Type.Num`; `Party.TypeNum` |
| Reference-table helper result | `Party_Consignee` |
| Issue helper result | `1017` |

### Additional Technical Info
`Type_Consignee` is the preferred script-visible `LongInt` identifier for the **Consignee** party role. Its fixed value is `4`, paired with [`Type_Consignee_String`](./Type_Consignee_String.md).

It identifies a party-role domain value. It does not find or create a party, add a `Party_Consignee` reference row, validate a relationship or grant access to party data.

**Implementation**

Velox declares and registers fixed value `4`. [`GetPartyTypeCode`](../../Functions/Velox/GetPartyTypeCode.md) maps it to `Consignee`; [`GetPartyTypeNum`](../../Functions/Velox/GetPartyTypeNum.md) performs the reverse mapping. The preferred numeric name is in the tag map, so `<!Type_Consignee!>` expands to `4`.

Fresh-build VxData seeds `Party_Type` row `4` as `Consignee`, and `Party.TypeNum` references that domain. The role-specific reference table is `Party_Consignee`.

[`GetReferenceTableForPartyType`](../../Functions/Velox/GetReferenceTableForPartyType.md) returns fixed text `Party_Consignee`. [`GetIssueForPartyType`](../../Functions/Velox/GetIssueForPartyType.md) returns integer `1017`. Their case statements use the numerically identical deprecated `Party_Consignee` label, so this preferred value selects the same branch.

**Behaviour**

Text-to-number conversion is case-insensitive but non-trimming; unsupported text returns `Null`. Number-to-text conversion returns `Null` for a `Null` or unsupported number.

The reference-table helper returns a name only and does not open a table or dataset. The issue helper returns a number only and does not create, log or persist an issue.

**Edge cases and quirks**

- `Type_Consignee` and deprecated `Party_Consignee` are numerically indistinguishable after evaluation. Use the preferred `Type_*` name in new or revised scripts.
- Current helpers retain deprecated `Party_*` labels internally. This does not make the preferred identifier unsupported; the equal integer selects the branch.
- Party-role values overlap many unrelated numeric families; PascalScript does not retain the role domain.
- Text conversion accepts case differences but not leading/trailing whitespace.
- Both preferred and deprecated numeric names are tag entries; this tag expands to `4`, not `Consignee`.
- `GetIssueForPartyType` returns an integer, whereas exposed `Ixxxx` issue-code constants are strings. Check the receiving API before substituting representations.
- Unsupported role numbers make the table helper return `Unknown` and the issue helper return generic fallback `1029`.

**Side effects**

Reading `Type_Consignee`, comparing it, expanding its tag or using the converters/helpers has no database or state-changing side effect.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`; helpers use their documented fallbacks. Persisting a role not present in `Party_Type` can fail a foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Access and fixed-case conversion/helper lookup are constant-time for practical purposes and carry no shared mutable party state.

**Remarks**

The example is source-reviewed and non-destructive. A returned table name is metadata, not SQL authorisation or proof that a matching row exists.

**Related entries**

- [`Type_Consignee_String`](./Type_Consignee_String.md) is the paired canonical role text.
- [`Party_Consignee`](./Party_Consignee.md) is the deprecated numeric alias.
- [`GetPartyTypeCode`](../../Functions/Velox/GetPartyTypeCode.md) converts a supported role number to text.
- [`GetPartyTypeNum`](../../Functions/Velox/GetPartyTypeNum.md) converts recognised role text to a number.
- [`GetReferenceTableForPartyType`](../../Functions/Velox/GetReferenceTableForPartyType.md) and [`GetIssueForPartyType`](../../Functions/Velox/GetIssueForPartyType.md) expose fixed role metadata.

<small>Created 2026-07-15</small>
