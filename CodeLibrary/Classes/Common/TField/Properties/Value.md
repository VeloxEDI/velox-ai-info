---
title: Value
description: Reads or writes the field's generic Variant value, with concrete descendants able to redeclare a more specific Value type and Null assignment clearing the field.
sidebar_position: 25
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tfield, value, variant, field-write]
---

```Delphi
property Value: Variant read write;
```

### Example

```Delphi
procedure CopyFieldValue(const Source, Target: TvxClientDataSet; const Name: string);
begin
  Target.Edit;
  Target.FieldByName(Name).Value := Source.FieldByName(Name).Value;
end;
```

### Usage

Reads or writes the field's generic Variant value, with fields able to redeclare a more specific Value type and Null assignment clearing the field.

- Use typed `As...` members when the expected type is known; use Variant state tests when it is not.
- Enter edit/insert state before assignment and handle conversion/validation exceptions.
- Never treat a successful assignment or `Post` as proof that a database transaction was executed.

### Additional Technical Info
On `TField`, `Value` is an alias of [`AsVariant`](AsVariant.md) and is the general-purpose field value used extensively by Velox mapping and DataView code.

#### Source-backed behaviour

The getter invokes the concrete field's `GetAsVariant`; the base implementation raises. The setter calls `SetAsVariant`: Variant `Null` calls [`Clear`](../Methods/Clear.md), while other values are passed to the descendant `SetVarValue` and variant conversion failures become field-value database errors. Client-dataset writes require a write state, enforce read-only rules for ordinary fields, invoke `OnValidate`, verify through DSBase, mutate the active buffer and normally emit a field-change event.

Concrete descendants can redeclare `Value` with a static type: [`TBooleanField`](../../../Data/TBooleanField.md) uses Boolean, [`TDateTimeField`](../../../Data/TDateTimeField.md) uses `TDateTime`, and [`TBlobField`](../../../Data/TBlobField.md) uses string. The expression's compile-time field type therefore affects PascalScript typing even when all objects inherit `TField`. `Post` commits the client record buffer; persistence to a database is a separate DataView/module operation.

#### Official RTL references

- [Embarcadero: TField.Value](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TField.Value)
- [Free Pascal: TField.Value](https://www.freepascal.org/docs-html/current/fcl/db/tfield.value.html)

<small>Created 2026-07-15</small>
