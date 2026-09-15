---
title: SetIfZero
description: Assigns a replacement under Velox's type-dependent null-or-zero sentinel rule.
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, set, default, 'null', zero, sentinel, variant]
---

```Delphi
procedure SetIfZero(aNewValue: Variant)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Field.SetIfZero(1);
  Value := Field.Value;
end;
```

### Usage

`SetIfZero` assigns a replacement under Velox's type-dependent null-or-zero sentinel rule.

### Additional Technical Info
`SetIfZero` reads the current field Variant once and assigns `aNewValue` when the same effective condition used by [`IsNullZero`](IsNullZero.md) is true.

| Field category | Assignment condition |
|---|---|
| Velox numeric/date type | current Variant is Null, Empty or Clear, or equals numeric zero |
| every other type | `Trim(VarToStr(CurrentValue)) = ''` |

Boolean false and date/time value zero qualify. A string containing `'0'` does not. Types omitted from Velox's numeric set take the string branch even if they have a numeric-looking representation.

The condition is recomputed independently rather than calling `IsNullZero`, but the current implementations are equivalent. Variant comparison/conversion can raise for unsupported values. If the condition is false, the method does nothing.

Assignment uses `TField.Value` and therefore obeys the actual field's conversion, edit/read-only, range and validation rules. It can mark the current record modified or raise, but does not post or commit. Be cautious when zero is valid business data rather than a missing-value sentinel.

**External references**

- [Embarcadero DocWiki: `TField.Value`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField.Value) documents the Variant write terminal.
- [Embarcadero DocWiki: `VarToStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarToStr) documents the nonnumeric conversion branch.

<small>Created 2026-07-15</small>
