---
title: 'Null'
description: Returns the live field's exact inherited database-null state as a method.
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, 'null', database-null]
---

```Delphi
function Null: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Field.Null then
    Value := 'No database value'
  else
    Value := Field.Value;
end;
```

### Usage

Returns the live field's exact database-null state as a method.

### Additional Technical Info
`Null` is an exact method alias for the inherited read-only `IsNull` property.

It returns true only when the current field has no assigned database value. Empty text, whitespace text, numeric zero, Boolean false and date/time zero are present values and return false.

This method is unrelated to the Pascal/Variant `Null` value constructor except for its name. In an expression, `Field.Null` is a Boolean test; assigning `Value := Null` uses the Variant null intrinsic.

The state follows the current dataset record. The test has no write/post/navigation side effect and is constant-time for a normal field. Use [`IsNullEmpty`](IsNullEmpty.md) or [`IsNullZero`](IsNullZero.md) only when their wider sentinel rules are intended.

**External references**

- [Embarcadero DocWiki: `TField.IsNull`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField.IsNull) documents the exact property returned.
- [Free Pascal: `TField.IsNull`](https://www.freepascal.org/docs-html/fcl/db/tfield.isnull.html) documents compatible field-null behavior.

<small>Created 2026-07-15</small>
