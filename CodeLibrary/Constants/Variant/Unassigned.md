---
title: Unassigned
description: Returns a fresh varEmpty Variant matching the uninitialised state and clearing any managed value when assigned to a destination.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, variant, unassigned, empty, clear]
---

```Delphi
function Unassigned: Variant;
```

### Example

```Delphi
procedure ClearCandidate(var Candidate: Variant);
begin
  Candidate := Unassigned;
  if not VarIsEmpty(Candidate) then
    raise Exception.Create('Variant did not clear');
end;
```

### Usage

`Unassigned` returns a fresh varEmpty Variant matching the uninitialised state and clearing any managed value when assigned to a destination.

### Additional Technical Info
`Unassigned` returns a Variant whose base type is [`varEmpty`](../VariantTypes/varEmpty.md) (0). It is the same state given to a newly initialised Variant before a value is assigned. Use it when “never assigned/cleared” must remain distinct from explicit [`Null`](Null.md).

This is a zero-argument function-backed sentinel despite its Constants navigation. The current Delphi implementation clears the result Variant, releasing any managed payload if necessary and leaving `VType = varEmpty`. Assigning the result to an existing Variant likewise replaces and releases that destination's prior string, array, interface or other managed value according to normal Variant ownership.

**Classification and conversion**

- [`VarIsEmpty`](../../Functions/Variant/VarIsEmpty.md) is the exact predicate and [`VarType`](../../Functions/Variant/VarType.md) returns `varEmpty`.
- [`VarIsClear`](../../Functions/Variant/VarIsClear.md) also returns `True`, but is broader because it can recognise nil interfaces and custom clear states.
- [`VarIsNull`](../../Functions/Variant/VarIsNull.md) returns `False`; Empty is not an explicitly missing database value.
- Under current Delphi conversion rules, Empty converts to numeric zero, empty string and Boolean `False`. Those conversions discard state, so test before converting when the distinction matters.

Do not use equality with `''`, `0` or `False` as an Empty test. It invokes Variant conversion/comparison behavior and can conflate a real value with an unassigned state. Likewise, Unassigned is not COM's missing-optional-parameter sentinel (`varError`/parameter-not-found), even where an API informally uses Empty to mean “not supplied.”

**Effects and boundaries**

The function performs no I/O or Velox-state mutation. Clearing a destination can release reference-counted resources immediately. Other references to separately owned objects are governed by their own ownership; Unassigned is not a substitute for freeing a script-owned object.

The example is source-reviewed only and was not executed.

**External references**

- [Embarcadero `System.Variants.Unassigned`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.Unassigned)
- [Embarcadero `System.Variants.VarIsEmpty`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarIsEmpty)
- [Free Pascal `Unassigned`](https://www.freepascal.org/docs-html/rtl/variants/unassigned.html)

<small>Created 2026-07-15</small>
