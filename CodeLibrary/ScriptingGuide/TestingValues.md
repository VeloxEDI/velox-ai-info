---
title: Testing values
description: Safe tests for Variant, null, empty, Boolean and sentinel values in Velox scripts.
sidebar_position: 4
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variants
  - "null"
  - validation
---

Velox integrations frequently move database, JSON, XML, file and script values through `Variant`. A Variant carries both a value and a type/state. Test that state before conversion; do not collapse `Null`, unassigned, empty text, zero and `False` unless the business rule explicitly treats them alike.

## Core tests

The embedded PascalScript runtime directly registers the Delphi `System.Variants` routines `VarIsNull`, `VarIsEmpty` and `VarIsClear`:

| Test | True when | Important distinction |
|---|---|---|
| `VarIsNull(V)` | `V` contains the database/Automation `Null` value | Null is assigned but represents no value |
| `VarIsEmpty(V)` | `V` is `Unassigned` (`varEmpty`) | It has not been assigned a typed value |
| `VarIsClear(V)` | `V` is undefined, including unassigned, a nil dispatch/interface value or a custom clear state | Broader than `VarIsEmpty` |
| `V = ''` | A compatible value compares equal to an empty string | Can coerce and can fail or propagate Null for uncertain Variants |
| `V = 0` | A compatible numeric/Boolean value compares equal to zero | Zero can be a valid value |
| `Boolean(V)` | `V` can be converted to Boolean | Incompatible, Null or unassigned input can fail |

## Recommended pattern

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if VarIsNull(Value) or VarIsEmpty(Value) or VarIsClear(Value) then
    Value := ''
  else
    Value := Trim(VarToStr(Value));
end;
```

The example is source-reviewed. It checks state before converting the assigned value to text. `VarIsStr` is a Delphi/Free Pascal routine but is not registered in the current Velox scripting surface, so do not use it as a guard unless a future Code Library entry exposes it.

Velox also registers convenience functions. `IsNullorEmpty` returns true for Null, Empty or Clear; for strings it trims before checking; it deliberately treats numeric zero as non-empty; for other types it converts to text and tests the trimmed result. `IsNullorZero` and field-specific helpers use different rules. Read their individual pages rather than substituting one name for another.

## Database fields

Prefer a field's `IsNull`/`Null` capability when you are testing database null state. A field's empty text and its database `NULL` are not interchangeable. A required numeric field can validly contain zero, and a date value of zero has a defined Delphi date representation rather than automatically meaning “missing”.

When reading `Field.Value`, the result is a Variant and the core tests above apply. When writing, the dataset field type performs its own conversion and validation during assignment or posting.

## Boolean control values

Map record events store their control flag in a Variant and the engine calls `Boolean(Value)`. Assign an actual `True` or `False`. Avoid returning text such as `'false'`, an integer sentinel or `Null`; implicit conversion is runtime-dependent and can raise a Variant error.

The Velox helper `CheckBoolean` currently compares its Variant with `Null` and otherwise assigns the Variant to a Boolean result. For uncertain values, the explicit `VarIsNull`/`VarIsEmpty`/`VarIsClear` pattern is clearer and avoids relying on Variant comparison rules.

## Common mistakes

- Testing `Value = Null`. Variant Null comparisons do not behave like ordinary Boolean equality; use `VarIsNull`.
- Using only `VarIsEmpty` when a nil interface/custom clear Variant is possible; `VarIsClear` is broader.
- Treating `0` as absent without confirming the field/business rule.
- Calling `Trim`, `Length`, `Boolean` or numeric conversion before excluding Null/unassigned states.
- Assuming `IsNullorEmpty` treats zero as empty; its implementation explicitly does not.

## Edge cases and quirks

- `VarIsClear` differs slightly between Delphi and Free Pascal for interface/dispatch and custom Variant cases. Velox runs the Delphi routine; the Free Pascal pages are compatibility references.
- `Null` can propagate through Variant expressions instead of producing a Boolean, which is why explicit tests are required.
- An empty array or dataset is not an Empty Variant. Use its own length/count/EOF API.
- Empty whitespace text is not equal to `''`, but Velox's `IsNullorEmpty` trims strings before testing.

## Related reference

- **ScriptEvent** — general mutable Variant contract.
- **BeforeMap** and **AfterMap (Record)** — Boolean control carried in a Variant.
- **Datasets** — field null state and cursor emptiness.

## External references

- [Free Pascal: VarIsNull](https://www.freepascal.org/docs-html/rtl/variants/varisnull.html)
- [Embarcadero DocWiki: System.Variants.VarIsNull](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsNull)
- [Free Pascal: VarIsEmpty](https://www.freepascal.org/docs-html/rtl/variants/varisempty.html)
- [Embarcadero DocWiki: System.Variants.VarIsEmpty](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsEmpty)
- [Free Pascal: VarIsClear](https://www.freepascal.org/docs-html/rtl/variants/varisclear.html)
- [Embarcadero DocWiki: System.Variants.VarIsClear](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Variants.VarIsClear)
