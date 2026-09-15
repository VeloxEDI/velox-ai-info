---
title: "GetSourceCode"
description: "Converts a Velox source number to its canonical code."
sidebar_position: 47
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
Function GetSourceCode(const aSourceNum : Variant) : Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetSourceCode(1); // 'App'
end;
```

### Usage

`GetSourceCode` converts a Velox source number to its canonical code.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aSourceNum` | `Variant`, `const` | Numeric source; use a listed integral value. |
| Result | `Variant` | Canonical code string for a recognized value; otherwise `Null`. |

**Complete mapping**

| Number | Code |
|---:|---|
| `1` | `App` |
| `2` | `EDI` |
| `3` | `Web` |
| `4` | `API` |

**Behaviour and edge cases**

- With Velox's default loose `NullEqualityRule`, Null follows the explicit guard. Because the rule is shared across the Velox process, strict or error settings can alter or break that comparison.
- Use integral constants from this family. Do not depend on Variant coercion from strings, floats or booleans.
- Unknown comparable values return `Null`; incompatible arrays/interfaces can raise conversion/operator exceptions that propagate.
- Source `1`/App is the only value that [`IsSourceInternal`](IsSourceInternal.md) treats as internal. [`IsSourcePartner`](IsSourcePartner.md) deliberately treats every other integer—including invalid values—as partner.
- These codes describe origin; they do not authenticate a caller, validate a channel or prove that data actually arrived through that source.

### Additional Technical Info
`GetSourceCode` converts a numeric source to its canonical Velox code. The complete map is compiled into product source and is not read from customer configuration.

**Implementation**

The source evaluates `aSourceNum = Null`, then uses a `case` over the listed constants. A recognized branch returns its fixed counterpart; the fallback returns `Null`. No database or alias configuration is consulted.

**Side effects, errors and performance**

For supported input the function is pure, does no I/O and runs over a small fixed mapping. Variant comparison or conversion errors propagate.

**Related entries**

- [`GetSourceNum`](GetSourceNum.md) performs the reverse conversion.
- [Embarcadero: `System.Variants.NullEqualityRule`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.NullEqualityRule)
- [Free Pascal: `NullEqualityRule`](https://www.freepascal.org/docs-html/rtl/variants/nullequalityrule.html)

<small>Created 2026-07-15</small>
