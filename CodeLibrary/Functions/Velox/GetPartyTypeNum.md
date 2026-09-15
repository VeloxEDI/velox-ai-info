---
title: "GetPartyTypeNum"
description: "Converts a Velox party type code to its canonical number."
sidebar_position: 35
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mapping
  - party-type
  - variant
---

```Delphi
Function GetPartyTypeNum(const aPartyTypeCode : string) : Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetPartyTypeNum('Customer'); // 1
end;
```

### Usage

`GetPartyTypeNum` converts a Velox party type code to its canonical number.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aPartyTypeCode` | `string`, `const` | Party type code. Comparison is case-insensitive but otherwise exact. |
| Result | `Variant` | Mapped integer in a `Variant`, or `Null` for an unrecognized code. |

**Complete mapping**

| Number | Code |
|---:|---|
| `1` | `Customer` |
| `2` | `Supplier` |
| `3` | `Consignor` |
| `4` | `Consignee` |
| `5` | `Location` |
| `6` | `Carrier` |
| `7` | `Shipper` |
| `8` | `Agent` |
| `100` | `Company` |

**Behaviour and edge cases**

- Matching is ordinal and case-insensitive for these ASCII identifiers; letter case may vary.
- The function compares the whole input and does not trim. Leading/trailing whitespace, punctuation changes and inserted spaces prevent a match.
- Empty and unknown text return `Null`; numeric text is not parsed.
- Test `VarIsNull` before assigning the result to a non-nullable numeric destination.
- `Company` is deliberately `100`, not the next value after `Agent`. Do not infer party numbers by list position.
- [`GetReferenceTableForPartyType`](GetReferenceTableForPartyType.md) returns a different, prefixed identifier family and uses `Unknown` rather than `Null` for a miss.

### Additional Technical Info
`GetPartyTypeNum` converts a party type code to the corresponding Velox number. Its complete mapping is compiled into the product and is not read from customer configuration.

**Implementation**

The source compares the input with each literal using installed Delphi `SameText`, in table order. The first match returns its integer constant; the final `else` returns `Null`. It performs no database query or configurable alias lookup.

**Side effects, errors and performance**

For supported input the function is pure, performs no I/O and runs over a small fixed mapping. Ordinary unmatched string input returns `Null` rather than raising a domain-specific error.

**Related entries**

- [`GetPartyTypeCode`](GetPartyTypeCode.md) performs the reverse conversion.
- [Embarcadero: `System.SysUtils.SameText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.SameText)
- [Free Pascal: `SameText`](https://www.freepascal.org/docs-html/rtl/sysutils/sametext.html)

<small>Created 2026-07-15</small>
