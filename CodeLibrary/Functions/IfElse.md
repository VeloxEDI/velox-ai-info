---
title: "Conditional selection"
description: "Functions that select fallback strings, numbers or Variants using distinct Null, Empty, blank and Boolean rules."
sidebar_position: 16
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conditional
  - coalesce
  - 'null'
  - variant
---

The Conditional selection group provides compact fallback and two-value selection functions. Similar names are not synonyms: each entry has its own trigger test, result type and Variant conversion path.

## Choosing an entry

- Use [`IfNull`](IfElse/IfNull.md) when the first Variant's exact Null-comparison behavior is the intended trigger and the selected Variant type should be preserved.
- Use [`CoalesceEmpty`](IfElse/CoalesceEmpty.md) when Velox's broader null/empty/trimmed-blank predicate and a text result are required.
- Use [`CoalesceString`](IfElse/CoalesceString.md) or [`IfBlank`](IfElse/IfBlank.md) only for their exact-empty typed-string behavior; whitespace is not blank to those implementations despite one public name.
- Use [`CoalesceFloat`](IfElse/CoalesceFloat.md) or [`CoalesceInteger`](IfElse/CoalesceInteger.md) when the selected value must be converted to that numeric type.
- Use [`IfThen`](IfElse/IfThen.md) for Boolean selection between two string values.

## Null, Empty and blank are different

Velox scripts can encounter Variant `Null`, `Empty`/clear values, empty text, whitespace-only text, numeric zero and Boolean `False`. The child pages contain the verified trigger and conversion tables. Do not replace one helper with another based only on its name.

Some implementations compare a Variant directly with `Null`; their behavior can be affected by Delphi's process-wide Variant rules. Others convert through `VarToStr`, trim text or perform a numeric Variant conversion, any of which can raise or invoke a custom Variant handler.

## Eager evaluation

These are functions, not language-level short-circuit constructs. PascalScript evaluates supplied arguments before entering the function. A fallback expression can therefore query data, mutate state or raise even when the function ultimately returns the preferred value.

Use an `if` statement when evaluation itself must be conditional:

```Delphi
if VarIsNull(Value) then
  Value := BuildFallback;
```

The example is illustrative; choose the predicate that matches the actual data contract. See [Testing values](../ScriptingGuide/TestingValues.md) for the differences among Variant states and safe guard patterns.
