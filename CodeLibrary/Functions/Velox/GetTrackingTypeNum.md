---
title: "GetTrackingTypeNum"
description: "Converts a Velox tracking type code to its canonical number."
sidebar_position: 53
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mapping
  - tracking-type
  - variant
---

```Delphi
Function GetTrackingTypeNum(const aTrackingTypeCode : string) : Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetTrackingTypeNum('CustomerTracking'); // 1
end;
```

### Usage

`GetTrackingTypeNum` converts a Velox tracking type code to its canonical number.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aTrackingTypeCode` | `string`, `const` | tracking type code; matching is case-insensitive but otherwise exact. |
| Result | `Variant` | Mapped integer for a recognized value; otherwise `Null`. |

**Complete mapping**

| Number | Code |
|---:|---|
| `1` | `CustomerTracking` |
| `2` | `SupplierTracking` |

**Behaviour and edge cases**

- Matching is ordinal and case-insensitive for these ASCII codes, but the entire string must match.
- The function does not trim. Whitespace, punctuation changes, empty input and unknown text return `Null`.
- Numeric text is not parsed. Test `VarIsNull` before assigning to a non-nullable numeric target.
- Reused labels or numbers in another Velox status/type family are not semantically interchangeable. Use the function matching the field.

### Additional Technical Info
`GetTrackingTypeNum` converts a tracking type code to its corresponding Velox number. The complete map is compiled into product source and is not read from customer configuration.

**Implementation**

The source compares the input with each literal through installed Delphi `SameText`, in table order. A recognized branch returns its fixed counterpart; the fallback returns `Null`. No database or alias configuration is consulted.

**Side effects, errors and performance**

For supported input the function is pure, does no I/O and runs over a small fixed mapping. Ordinary unknown string input returns `Null`.

**Related entries**

- [`GetTrackingTypeCode`](GetTrackingTypeCode.md) performs the reverse conversion.
- [Embarcadero: `System.SysUtils.SameText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.SameText)
- [Free Pascal: `SameText`](https://www.freepascal.org/docs-html/rtl/sysutils/sametext.html)

<small>Created 2026-07-15</small>
