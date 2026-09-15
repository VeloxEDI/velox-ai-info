---
title: Type_Company_String
description: Provides the canonical Company party-role text paired with Type_Company for Velox party conversion and configuration.
sidebar_position: 488
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
Type_Company_String = 'Company'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetPartyTypeNum(Type_Company_String); // 100
end;
```

### Usage

`Type_Company_String` provides the canonical Company party-role text paired with Type_Company for Velox party conversion and configuration.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Text value | `Company` |
| Paired number | [`Type_Company`](./Type_Company.md) = `100` |
| Deprecated numeric alias | [`Party_Company`](./Party_Company.md) = `100` |
| Database domain | `Party_Type.Num`; `Party.TypeNum` |
| Reference-table helper result | `Party_Company` |
| Issue helper result | `1020` |

### Additional Technical Info
`Type_Company_String` is the canonical script-visible `String` for the **Company** party role. Its exact value is `Company`, paired with [`Type_Company`](./Type_Company.md) value `100`.

It identifies a party-role domain value. It does not find or create a party, add a `Party_Company` reference row, validate a relationship or grant access to party data.

**Implementation**

Velox declares and registers exact text `Company`. [`GetPartyTypeNum`](../../Functions/Velox/GetPartyTypeNum.md) compares it with Delphi `SameText` and returns `100`; [`GetPartyTypeCode`](../../Functions/Velox/GetPartyTypeCode.md) performs the reverse mapping. The String name is not in the tag map.

Fresh-build VxData seeds `Party_Type` row `100` as `Company`, and `Party.TypeNum` references that domain. The role-specific reference table is `Party_Company`.

[`GetReferenceTableForPartyType`](../../Functions/Velox/GetReferenceTableForPartyType.md) returns fixed text `Party_Company`. [`GetIssueForPartyType`](../../Functions/Velox/GetIssueForPartyType.md) returns integer `1020`. Their case statements use the numerically identical deprecated `Party_Company` label, so this preferred value selects the same branch.

**Behaviour**

Text-to-number conversion is case-insensitive but non-trimming; unsupported text returns `Null`. Number-to-text conversion returns `Null` for a `Null` or unsupported number.

The reference-table helper returns a name only and does not open a table or dataset. The issue helper returns a number only and does not create, log or persist an issue.

**Edge cases and quirks**

- `Type_Company` and deprecated `Party_Company` are numerically indistinguishable after evaluation. Use the preferred `Type_*` name in new or revised scripts.
- Current helpers retain deprecated `Party_*` labels internally. This does not make the preferred identifier unsupported; the equal integer selects the branch.
- Company uses sparse value `100`; do not derive it by incrementing the values 1-8.
- Text conversion accepts case differences but not leading/trailing whitespace.
- The String identifier is not a tag-map entry.
- `GetIssueForPartyType` returns an integer, whereas exposed `Ixxxx` issue-code constants are strings. Check the receiving API before substituting representations.
- Unsupported role numbers make the table helper return `Unknown` and the issue helper return generic fallback `1029`.

**Side effects**

Reading `Type_Company_String`, comparing it or using the converters/helpers has no database or state-changing side effect.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`; helpers use their documented fallbacks. Persisting a role not present in `Party_Type` can fail a foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Access and fixed-case conversion/helper lookup are constant-time for practical purposes and carry no shared mutable party state.

**Remarks**

The example is source-reviewed and non-destructive. A returned table name is metadata, not SQL authorisation or proof that a matching row exists.

**Related entries**

- [`Type_Company`](./Type_Company.md) is the paired numeric identifier.
- [`Party_Company`](./Party_Company.md) is the deprecated numeric alias.
- [`GetPartyTypeCode`](../../Functions/Velox/GetPartyTypeCode.md) converts a supported role number to text.
- [`GetPartyTypeNum`](../../Functions/Velox/GetPartyTypeNum.md) converts recognised role text to a number.
- [`GetReferenceTableForPartyType`](../../Functions/Velox/GetReferenceTableForPartyType.md) and [`GetIssueForPartyType`](../../Functions/Velox/GetIssueForPartyType.md) expose fixed role metadata.

<small>Created 2026-07-15</small>
