---
title: Type_Location_String
description: Provides the canonical Location party-role text paired with Type_Location for Velox party conversion and configuration.
sidebar_position: 518
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
Type_Location_String = 'Location'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetPartyTypeNum(Type_Location_String); // 5
end;
```

### Usage

`Type_Location_String` provides the canonical Location party-role text paired with Type_Location for Velox party conversion and configuration.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Text value | `Location` |
| Paired number | [`Type_Location`](./Type_Location.md) = `5` |
| Deprecated numeric alias | [`Party_Location`](./Party_Location.md) = `5` |
| Database domain | `Party_Type.Num`; `Party.TypeNum` |
| Reference-table helper result | `Party_Location` |
| Issue helper result | `1018` |

### Additional Technical Info
`Type_Location_String` is the canonical script-visible `String` for the **Location** party role. Its exact value is `Location`, paired with [`Type_Location`](./Type_Location.md) value `5`.

It identifies a party-role domain value. It does not find or create a party, add a `Party_Location` reference row, validate a relationship or grant access to party data. The Location role also participates in location-specific product quantity and operational relationships; this identifier does not decide which relationship a workflow requires.

**Implementation**

Velox declares and registers exact text `Location`. [`GetPartyTypeNum`](../../Functions/Velox/GetPartyTypeNum.md) compares it with Delphi `SameText` and returns `5`; [`GetPartyTypeCode`](../../Functions/Velox/GetPartyTypeCode.md) performs the reverse mapping. The String name is not in the tag map.

Fresh-build VxData seeds `Party_Type` row `5` as `Location`, and `Party.TypeNum` references that domain. The role-specific reference table is `Party_Location`.

[`GetReferenceTableForPartyType`](../../Functions/Velox/GetReferenceTableForPartyType.md) returns fixed text `Party_Location`. [`GetIssueForPartyType`](../../Functions/Velox/GetIssueForPartyType.md) returns integer `1018`. Their case statements use the numerically identical deprecated `Party_Location` label, so this preferred value selects the same branch.

**Behaviour**

Text-to-number conversion is case-insensitive but non-trimming; unsupported text returns `Null`. Number-to-text conversion returns `Null` for a `Null` or unsupported number.

The reference-table helper returns a name only and does not open a table or dataset. The issue helper returns a number only and does not create, log or persist an issue.

**Edge cases and quirks**

- `Type_Location` and deprecated `Party_Location` are numerically indistinguishable after evaluation. Use the preferred `Type_*` name in new or revised scripts.
- Current helpers retain deprecated `Party_*` labels internally. This does not make the preferred identifier unsupported; the equal integer selects the branch.
- Party-role values overlap many unrelated numeric families; PascalScript does not retain the role domain.
- Text conversion accepts case differences but not leading/trailing whitespace.
- The String identifier is not a tag-map entry.
- `GetIssueForPartyType` returns an integer, whereas exposed `Ixxxx` issue-code constants are strings. Check the receiving API before substituting representations.
- Unsupported role numbers make the table helper return `Unknown` and the issue helper return generic fallback `1029`.

**Side effects**

Reading `Type_Location_String`, comparing it or using the converters/helpers has no database or state-changing side effect.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`; helpers use their documented fallbacks. Persisting a role not present in `Party_Type` can fail a foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Access and fixed-case conversion/helper lookup are constant-time for practical purposes and carry no shared mutable party state.

**Remarks**

The example is source-reviewed and non-destructive. A returned table name is metadata, not SQL authorisation or proof that a matching row exists.

**Related entries**

- [`Type_Location`](./Type_Location.md) is the paired numeric identifier.
- [`Party_Location`](./Party_Location.md) is the deprecated numeric alias.
- [`GetPartyTypeCode`](../../Functions/Velox/GetPartyTypeCode.md) converts a supported role number to text.
- [`GetPartyTypeNum`](../../Functions/Velox/GetPartyTypeNum.md) converts recognised role text to a number.
- [`GetReferenceTableForPartyType`](../../Functions/Velox/GetReferenceTableForPartyType.md) and [`GetIssueForPartyType`](../../Functions/Velox/GetIssueForPartyType.md) expose fixed role metadata.

<small>Created 2026-07-15</small>
