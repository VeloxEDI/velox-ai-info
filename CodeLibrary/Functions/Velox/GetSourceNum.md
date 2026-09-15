---
title: "GetSourceNum"
description: "Converts a Velox source code to its canonical number."
sidebar_position: 48
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mapping
  - source
  - variant
---

```Delphi
Function GetSourceNum(const aSourceCode : string) : Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetSourceNum('App'); // 1
end;
```

### Usage

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aSourceCode` | `string`, `const` | source code; matching is case-insensitive but otherwise exact. |
| Result | `Variant` | Mapped integer for a recognized value; otherwise `Null`. |

**Complete mapping**

| Number | Code |
|---:|---|
| `1` | `App` |
| `2` | `EDI` |
| `3` | `Web` |
| `4` | `API` |

**Behaviour and edge cases**

- Matching is ordinal and case-insensitive for these ASCII codes, but the entire string must match.
- The function does not trim. Whitespace, punctuation changes, empty input and unknown text return `Null`.
- Numeric text is not parsed. Test `VarIsNull` before assigning to a non-nullable numeric target.
- Source `1`/App is the only value that [`IsSourceInternal`](IsSourceInternal.md) treats as internal. [`IsSourcePartner`](IsSourcePartner.md) deliberately treats every other integer—including invalid values—as partner.
- These codes describe origin; they do not authenticate a caller, validate a channel or prove that data actually arrived through that source.

### Additional Technical Info
`GetSourceNum` converts a source code to its corresponding Velox number. The complete map is compiled into product source and is not read from customer configuration.

**Implementation**

The source compares the input with each literal through installed Delphi `SameText`, in table order. A recognized branch returns its fixed counterpart; the fallback returns `Null`. No database or alias configuration is consulted.

**Side effects, errors and performance**

For supported input the function is pure, does no I/O and runs over a small fixed mapping. Ordinary unknown string input returns `Null`.

**Related entries**

- [`GetSourceCode`](GetSourceCode.md) performs the reverse conversion.
- [Embarcadero: `System.SysUtils.SameText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.SameText)
- [Free Pascal: `SameText`](https://www.freepascal.org/docs-html/rtl/sysutils/sametext.html)

<small>Created 2026-07-15</small>
