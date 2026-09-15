---
title: NotNullZero
description: Returns the exact negation of Velox's type-dependent null-or-zero sentinel predicate.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, nonzero, 'null', sentinel, variant]
---

```Delphi
function NotNullZero: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Field.NotNullZero then
    Value := Field.Value
  else
    Value := 'Missing or zero';
end;
```

### Usage

`NotNullZero` returns the exact negation of Velox's type-dependent null-or-zero sentinel predicate.

### Additional Technical Info
`NotNullZero` returns `not IsNullZero` and therefore inherits that method's type-dependent rules.

- For Velox numeric/date types it is false for Variant Null/Empty/Clear and values equal to zero.
- For every other type it is false when `Trim(VarToStr(Value))` is empty.

Consequently Boolean true is normally true and Boolean false is false; a string `'0'` is true; numeric zero and Delphi date/time zero are false. This is not the same as database non-null.

The method reads the current field once through the underlying [`IsNullZero`](IsNullZero.md) call. Variant conversion/comparison can raise for unsupported values. It does not write or navigate.

**External references**

- [Embarcadero DocWiki: `VarToStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarToStr) documents the nonnumeric conversion used beneath this predicate.
- [Embarcadero DocWiki: `TField.IsNull`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField.IsNull) distinguishes database null from the wider Velox sentinel rule.

<small>Created 2026-07-15</small>
