---
title: NotNull
description: Returns the exact logical negation of the live field's inherited IsNull state.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, field, not-null, database-null]
---

```Delphi
function NotNull: Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Field.NotNull then
    Value := Field.Value
  else
    Value := 'No database value';
end;
```

### Usage

`NotNull` returns the exact logical negation of the live field's IsNull state.

### Additional Technical Info
`NotNull` is convenience syntax for `not Field.IsNull`.

It tests database null only. Empty text, whitespace text, numeric zero, Boolean false and date/time zero are all non-null values and return true. Use [`NotNullEmpty`](NotNullEmpty.md) or [`NotNullZero`](NotNullZero.md) only when those wider Velox sentinel rules are intended.

The result reflects the current dataset record and can change after navigation. It has no write, post or cursor side effect and is constant-time for a normal data field.

**External references**

- [Embarcadero DocWiki: `TField.IsNull`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TField.IsNull) defines the field state being negated.
- [Free Pascal: `TField.IsNull`](https://www.freepascal.org/docs-html/fcl/db/tfield.isnull.html) documents the compatible null test.

<small>Created 2026-07-15</small>
