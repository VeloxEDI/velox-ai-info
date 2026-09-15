---
title: "Relational (Comparison)"
description: "Equality, ordering, membership and type comparisons in Velox expressions."
sidebar_position: 3
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - operators
  - comparison
---

Relational operators compare values and normally return Boolean. Velox supports equality, ordering, set/array membership and class-type tests through the modified PascalScript runtime.

## Syntax

```Delphi
Left = Right
Left <> Right
Left < Right
Left > Right
Left <= Right
Left >= Right
Item in SetOrVariantArray
ObjectValue is ClassType
ObjectValue as ClassType
```

`as` is a checked class conversion that returns a reference rather than Boolean, but it belongs to the same class/type operator family. It is parsed at the higher multiplying-operator precedence; parenthesise it in a larger expression.

## How it works

The compiler parses `=`, `<>`, `<`, `>`, `<=`, `>=`, `in` and `is` at the lowest operator-precedence level. `GetResultType` validates statically known operand pairs; `DoBinCalc` emits the runtime comparison opcode. Supported families include compatible integers/reals, strings/chars, matching enumerations, matching sets, class references, Variants and selected nil-compatible references.

The important cases are:

- **Numbers:** integers can compare with integers and reals. Signedness, width and Variant conversions affect boundary cases.
- **Strings/chars:** comparison is direct, case-sensitive character-code ordering; it is not locale-aware collation.
- **Sets:** `=`/`<>` test equal members, `<=` tests subset and `>=` tests superset for compatible set types.
- **Classes:** `=`/`<>` compare object identity, not field/property values. `is` tests runtime type compatibility. `as` validates/casts and raises on mismatch.
- **Membership:** `in` accepts an element with a compatible set or the runtime's registered `TVariantArray` representation.
- **Variants:** operations delegate to runtime/Delphi Variant semantics and can raise for Null or incompatible content.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Score: Integer;
begin
  Score := 84;
  if Score in [80..100] then
    Value := 'high'
  else
    Value := 'standard';
end;
```

The `in` expression returns true because `84` is a member of the constructed integer range set.

## Operator details

`=` and `<>` require compatible values; they do not perform assignment. Ordering operators require an ordered compatible type. For class references, equality means the same instance address. For strings, normalise case explicitly when the rule is case-insensitive.

`is` expects a type value on the right and returns Boolean. `as` copies the reference into the target type then executes the runtime class validation; a failed cast raises rather than returning `nil`.

The compiler makes a `nil` value of the comparison partner's type where supported. For script strings this nil materialisation becomes an empty string, while class/interface/procedural references receive an appropriate nil reference. Prefer explicit empty-string tests for text rather than treating `nil` as a portable string value.

## Common mistakes

- Using `:=` for equality or `=` for assignment.
- Comparing object references and expecting a deep content comparison.
- Assuming `<` or `>` text comparison follows the user's language/culture.
- Chaining comparisons such as `1 < X < 10`. Write `(1 < X) and (X < 10)`; the first comparison produces Boolean and is not a mathematical range expression.
- Using `as` as a Boolean test. Use `is` before a guarded cast when a mismatch is expected.
- Comparing a potentially Null Variant without first defining the intended Null behaviour.

## Edge cases and quirks

- The expression parser permits repeated relational tokens, but each prior comparison has already produced Boolean; most chained forms fail type checking or mean something other than mathematical chaining.
- Set operands must have compatible registered element/type information. The runtime also contains specific `TVariantArray` membership support; do not assume arbitrary arrays work with `in`.
- String comparison is based on runtime character values and case; it does not trim whitespace.
- Variant comparison can return a Variant/Boolean-like result or raise depending on actual subtypes and Null state. Use `VarIsNull`/explicit conversion for stable business rules.
- Imported external classes may provide custom comparison/cast helpers. Their exact page overrides the generic class behaviour described here.

## Errors, side effects and performance

Static incompatibility produces a compile-time type mismatch. Runtime Variant conversion and failed `as` casts raise through the script exception mechanism. Comparisons themselves do not mutate scalar operands, but property/function operands are evaluated and keep their side effects. Scalar comparisons are constant-time; string/set comparisons scale with represented content.

## Related reference

- `Assignment` — stores a value with `:=`.
- `Boolean` — combines comparison results.
- `String` — concatenation and text-specific considerations.
- `Testing values` — safe Null/Empty/Boolean testing.

## External references

- [Free Pascal: Relational operators](https://www.freepascal.org/docs-html/current/ref/refsu50.html)
- [Free Pascal: Set operators](https://www.freepascal.org/docs-html/current/ref/refsu49.html)
- [Embarcadero DocWiki: Expressions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Expressions_%28Delphi%29)
