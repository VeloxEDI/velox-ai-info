---
title: "GetTrackingStatusNum"
description: "Converts a Velox tracking status code to its canonical number."
sidebar_position: 51
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mapping
  - tracking-status
  - variant
---

```Delphi
Function GetTrackingStatusNum(const aTrackingStatusCode : string) : Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetTrackingStatusNum('Delivered'); // 1
end;
```

### Usage

`GetTrackingStatusNum` converts a Velox tracking status code to its canonical number.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aTrackingStatusCode` | `string`, `const` | tracking status code; matching is case-insensitive but otherwise exact. |
| Result | `Variant` | Mapped integer for a recognized value; otherwise `Null`. |

**Complete mapping**

| Number | Code |
|---:|---|
| `1` | `Delivered` |
| `2` | `Updated` |
| `3` | `Cancelled` |

**Behaviour and edge cases**

- Matching is ordinal and case-insensitive for these ASCII codes, but the entire string must match.
- The function does not trim. Whitespace, punctuation changes, empty input and unknown text return `Null`.
- Numeric text is not parsed. Test `VarIsNull` before assigning to a non-nullable numeric target.
- Reused labels or numbers in another Velox status/type family are not semantically interchangeable. Use the function matching the field.

### Additional Technical Info
`GetTrackingStatusNum` converts a tracking status code to its corresponding Velox number. The complete map is compiled into product source and is not read from customer configuration.

**Implementation**

The source compares the input with each literal through installed Delphi `SameText`, in table order. A recognized branch returns its fixed counterpart; the fallback returns `Null`. No database or alias configuration is consulted.

**Side effects, errors and performance**

For supported input the function is pure, does no I/O and runs over a small fixed mapping. Ordinary unknown string input returns `Null`.

**Related entries**

- [`GetTrackingStatusCode`](GetTrackingStatusCode.md) performs the reverse conversion.
- [Embarcadero: `System.SysUtils.SameText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.SameText)
- [Free Pascal: `SameText`](https://www.freepascal.org/docs-html/rtl/sysutils/sametext.html)

<small>Created 2026-07-15</small>
