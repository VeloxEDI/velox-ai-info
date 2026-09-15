---
title: SetIfNull
description: Assigns a replacement only when the field Variant is Null, Empty or Clear.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, set, default, 'null', empty, clear, variant]
---

```Delphi
procedure SetIfNull(aNewValue: Variant)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Field.SetIfNull('UNKNOWN');
  Value := Field.Value;
end;
```

### Usage

`SetIfNull` assigns a replacement only when the field Variant is Null, Empty or Clear.

### Additional Technical Info
`SetIfNull` reads the current field once as a Variant. It assigns `aNewValue` only when that Variant satisfies `VarIsNull`, `VarIsEmpty` or `VarIsClear`.

Empty string, whitespace text, numeric zero, Boolean false and date/time zero are values and do not qualify. This makes the method narrower than [`SetIfEmpty`](SetIfEmpty.md) and [`SetIfZero`](SetIfZero.md).

The replacement is written through `TField.Value`. Concrete-field conversion, range/read-only/edit-state checks and validation can raise. A successful write changes only the active record buffer; the method does not Post, ApplyUpdates or commit. If the current value does not qualify, the method is a no-op.

Although Empty and Clear are unusual field values, the implementation deliberately accepts all three Variant states. The field reference remains owned by the active dataset and follows its cursor.

**External references**

- [Embarcadero DocWiki: `VarIsNull`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsNull), [`VarIsEmpty`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsEmpty) and [`VarIsClear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsClear) define the three tested states.
- [Embarcadero DocWiki: `TField.Value`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField.Value) documents the Variant assignment terminal.

<small>Created 2026-07-15</small>
