---
title: Party_Carrier
description: Provides deprecated Carrier party-role alias value 6 used by legacy scripts, party tags and role helper functions.
sidebar_position: 417
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - party
  - party-role
  - deprecated
  - compatibility
---

```Delphi
Party_Carrier = 6
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetReferenceTableForPartyType(Party_Carrier); // 'Party_Carrier'
end;
```

### Usage

`Party_Carrier` provides deprecated Carrier party-role alias value 6 used by legacy scripts, party tags and role helper functions.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `6` |
| Preferred identifier | [`Type_Carrier`](./Type_Carrier.md) |
| Canonical text | [`Type_Carrier_String`](./Type_Carrier_String.md) = `Carrier` |
| Database domain | `Party_Type.Num` and `Party.TypeNum` |
| Reference-table helper result | `Party_Carrier` |
| Issue helper result | `1019` |

### Additional Technical Info
`Party_Carrier` is a deprecated compatibility alias for the Carrier party role. Its fixed `LongInt` value is `6`, identical to [`Type_Carrier`](./Type_Carrier.md). Prefer the `Type_*` identifier in new or revised scripts, while retaining this alias only where legacy compatibility or a helper's documented party-role input requires it.

Reading the alias identifies a role. It does not look up a party, create a role-table record, change `Party.TypeNum` or validate a transaction.

**Implementation**

Current native source places `Party_Carrier` in an explicitly deprecated block and registers it with PascalScript as `6`. It also keeps this exact deprecated name in the numeric tag map, so `<!Party_Carrier!>` expands to `6`; preferred `Type_Carrier` is registered separately with the same value.

`GetReferenceTableForPartyType` cases on `Party_Carrier` and returns `Party_Carrier`. `GetIssueForPartyType` cases on it and returns integer `1019`. The text/number converters instead use preferred `Type_Carrier` and `Type_Carrier_String`.

A fresh VxData database seeds `Party_Type` value `6` as `Carrier`, and `Party.TypeNum` references that table. The role-specific reference table is `Party_Carrier`.

**Behaviour**

The alias and preferred identifier are numerically indistinguishable after evaluation. The reference-table helper returns a fixed table-name string; it does not open that table or return a dataset. The issue helper returns a fixed integer issue number; it does not create or persist an issue.

**Edge cases and quirks**

- There is no `Party_Carrier_String` alias. Use `Type_Carrier_String` for canonical text and the preferred converters.
- Despite deprecation, current product helpers and the tag map still refer to `Party_*` names. Deprecation therefore means "prefer the replacement for authoring", not "currently unavailable".
- The generated index lacks a deprecation flag even though native source marks the family deprecated.
- Party-role numbers overlap many other numeric families. PascalScript does not retain the domain after evaluation.
- `GetIssueForPartyType` returns an integer such as `1019`, whereas the exposed `Ixxxx` issue-code constants are strings. Do not substitute one representation without checking the receiving API.

**Side effects**

Reading `Party_Carrier`, comparing it or expanding its tag has no I/O or state-changing effect. The two helpers are fixed in-process case mappings and do not query the database.

**Errors**

Reading the alias does not raise an error. An unsupported party-role number makes `GetReferenceTableForPartyType` return `Unknown` and makes `GetIssueForPartyType` return its generic fallback `1029`; this page's value uses the recognised branch.

**Performance and concurrency**

This is an immutable compiled value. Access, tag lookup and the fixed helper cases are constant-time for practical purposes and carry no shared mutable role state.

**Remarks**

The example is source-reviewed and non-destructive. Treat the returned table name as reference metadata; it does not authorise arbitrary SQL or prove that a matching row exists.

**Related entries**

- [`Type_Carrier`](./Type_Carrier.md) is the preferred numeric identifier.
- [`Type_Carrier_String`](./Type_Carrier_String.md) is the canonical role text.
- [`GetReferenceTableForPartyType`](../../Functions/Velox/GetReferenceTableForPartyType.md) returns a fixed role-table name.
- [`GetIssueForPartyType`](../../Functions/Velox/GetIssueForPartyType.md) returns the role-specific issue number.
- [`GetPartyTypeNum`](../../Functions/Velox/GetPartyTypeNum.md) and [`GetPartyTypeCode`](../../Functions/Velox/GetPartyTypeCode.md) use preferred identifiers.

<small>Created 2026-07-15</small>
