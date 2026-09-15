---
title: "GetUomTypeNum"
description: "Converts a canonical Velox UOM type code to its number and exposes the Quantity/Unit alias."
sidebar_position: 56
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - uom
  - mapping
  - alias
---

```Delphi
Function GetUomTypeNum(const aUomTypeCode : string) : Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetUomTypeNum('Unit'); // 1
end;
```

### Usage

`GetUomTypeNum` converts a canonical Velox UOM type code to its number and exposes the Quantity/Unit alias.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aUomTypeCode` | `string`, `const` | Canonical UOM type code. |
| Result | `Variant` | Integer `1`–`6` for a recognized code; otherwise `Null`. |

**Behaviour and edge cases**

- `GetUomTypeNum('Quantity')` returns `Null`; it does not return `1`.
- Letter case is ignored, so `unit` matches. Leading/trailing whitespace or punctuation changes return `Null` because the function does not trim.
- Empty, unknown and numeric text return `Null`.
- The result is a numeric `Variant`; test `VarIsNull` before assigning it to a non-nullable integer.
- This maps UOM classification only and does not parse or convert measurement quantities or business unit codes.

### Additional Technical Info
`GetUomTypeNum` converts a canonical Velox unit-of-measure type code to its numeric value. Matching is case-insensitive but otherwise exact. The word `Quantity` is not a recognized code: the internal Quantity and Unit string constants are both `Unit`.

**Complete observable mapping**

| Input code | Number | Notes |
|---|---:|---|
| `Unit` | `1` | Represents both internal Quantity and Unit constants. |
| `Inner` | `2` | Inner packaging. |
| `Outer` | `3` | Outer packaging. |
| `Pallet` | `4` | Pallet. |
| `Hire` | `5` | Hire item/container. |
| `Tie` | `6` | Tie. |

**Implementation quirk**

The source comparison chain contains separate `Type_Quantity_String` and `Type_Unit_String` branches, but both constants contain `Unit` and both numeric constants equal `1`. The first branch therefore always handles `Unit`; the second is unreachable for current constants. This does not change the returned value, but it confirms that `Quantity` is not an alternative accepted spelling.

**Side effects, errors and performance**

The function is pure and performs no I/O. It uses a fixed comparison chain; the duplicate first two branches are harmless but the second is unreachable in the current product.

**Related entries**

- [`GetUomTypeCode`](GetUomTypeCode.md) performs the numeric-to-code conversion and always renders value `1` as `Unit`.
- [Embarcadero: `System.SysUtils.SameText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.SameText)
- [Free Pascal: `SameText`](https://www.freepascal.org/docs-html/rtl/sysutils/sametext.html)

<small>Created 2026-07-15</small>
