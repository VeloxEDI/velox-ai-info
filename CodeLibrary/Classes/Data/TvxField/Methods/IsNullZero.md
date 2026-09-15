---
title: IsNullZero
description: Applies Velox's type-dependent null-or-zero sentinel test to the current field value.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, 'null', zero, empty, sentinel, variant]
---

```Delphi
function IsNullZero: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Field.IsNullZero then
    Value := 'Missing or zero'
  else
    Value := Field.Value;
end;
```

### Usage

`IsNullZero` applies Velox's type-dependent null-or-zero sentinel test to the current field value.

**Important distinctions**

- Boolean false is numeric zero and returns true because `ftBoolean` is in the numeric set.
- Velox date/time value `0` returns true; that value represents the Velox epoch/midnight rather than database null.
- A numeric field containing zero returns true even though [`Null`](Null.md) returns false.
- A string field containing `'0'` returns false; nonnumeric fields are tested only for trimmed empty text.
- Null/Empty/Clear are treated alike even though they are distinct Variant states.
- Types omitted from the numeric set use the string branch even if they support some numeric conversion.

Variant comparison or `VarToStr` can raise for unsupported/custom values such as some arrays. Field access can also raise if the field/dataset is invalid. The method does not write or navigate.

Use [`SetIfZero`](SetIfZero.md) to assign under the same condition and [`NotNullZero`](NotNullZero.md) for the exact negation.

### Additional Technical Info
`IsNullZero` reads `GetAsVariant` once, then applies one of two rules selected by Velox's hard-coded field-type groups.

| Field category | Returns true when |
|---|---|
| [`IsNumericType`](IsNumericType.md) or [`IsDateType`](IsDateType.md) | Variant is Null, Empty or Clear, or compares equal to numeric zero |
| every other `DataType` | `Trim(VarToStr(Value)) = ''` |

The explicit date check is redundant in the current source because all four date types are also in the numeric set, but it records the intended date-sentinel behavior.

**External references**

- [Embarcadero DocWiki: `VarIsNull`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsNull), [`VarIsEmpty`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsEmpty), [`VarIsClear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsClear) and [`VarToStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarToStr) document the Delphi Variant operations used by the implementation.

<small>Created 2026-07-15</small>
