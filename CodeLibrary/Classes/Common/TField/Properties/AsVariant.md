---
title: AsVariant
description: Reads or writes the concrete field as a Variant, preserving explicit database Null where supported and converting other dynamic values through descendant rules.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, variant, 'null', conversion]
---

```Delphi
property AsVariant: Variant read write;
```

### Example

```Delphi
procedure CopyOptionalValue(const Source, Target: TvxClientDataSet);
begin
  Target.FieldByName('Reference').AsVariant :=
    Source.FieldByName('Reference').AsVariant;
end;
```

### Usage

`AsVariant` reads or writes the field as a Variant, preserving explicit database Null where supported and converting other dynamic values through field rules.

- Use `VarIsNull` to test database null; do not compare a Variant directly with `Null`.
- Prefer typed `As...` properties when the target type is known and null is handled separately.
- Treat `Unassigned`, `Null`, empty string and numeric zero as four different states unless the mapping contract deliberately combines them.

### Additional Technical Info
`AsVariant` provides the generic dynamically typed field value. [`Value`](Value.md) is an alias of the same getter/setter on `TField`.

#### Source-backed behaviour

Base `TField.GetAsVariant` raises; concrete descendants return a Variant appropriate to their data type and normally return `Null` for a null database value. On assignment, base `SetAsVariant` treats `VarIsNull(Value)` specially and calls [`Clear`](../Methods/Clear.md). Other values are delegated to the descendant's `SetVarValue`; Delphi variant-conversion errors are translated to a field-value database error. `Unassigned`/Empty is not the same test as `Null` and may be rejected or converted by the descendant.

The write requires a client-dataset write state and can trigger `OnValidate`, DSBase constraints and field-change events. Variants reduce compile-time type checking and can hide precision/encoding conversions. Blob or interface-valued descendants may use specialised Variant representations.

#### Official RTL references

- [Embarcadero: TField.AsVariant](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.AsVariant)
- [Free Pascal: TField.AsVariant](https://www.freepascal.org/docs-html/current/fcl/db/tfield.asvariant.html)

<small>Created 2026-07-15</small>
