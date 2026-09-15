---
title: "Unary"
description: "Unary sign, negation and address operations accepted by the Velox script compiler."
sidebar_position: 6
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - operators
  - unary
---

Unary operators act on one following operand. Velox supports unary `+`, unary `-`, `not` and a restricted `@` procedure-address form in its modified PascalScript expression parser.

## Syntax

```Delphi
+NumericExpression
-NumericExpression
not BooleanOrIntegerExpression
@ScriptProcedure
```

`not` binds to the following factor. The current parser handles unary `+` and a non-literal unary `-` differently: each consumes the following multiplying-level term. This is a Velox/PascalScript precedence quirk, so parenthesise a signed operand whenever it contains `*`, `/`, `div`, `mod`, `and`, `shl`, `shr` or `as`.

## How it works

`TPSPascalCompiler.ReadFactor` handles these forms:

- Unary `+` consumes the following term and returns it unchanged. It is a sign-identity/no-op.
- Unary `-` creates an `otMinus` node (or reads a negative integer literal directly). `DoUnCalc` emits the runtime `cm_vm` negation opcode.
- `not` creates an `otNot` node. `DoUnCalc` emits Boolean negation for the compiler's Boolean types and integer bitwise complement for other integer types.
- `@` requires a procedure/function identifier that resolves to a script-internal `TPSInternalProcedure`, then produces a procedural-pointer value.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Delta: Integer;
  Enabled: Boolean;
begin
  Delta := -5;
  Enabled := not False;
  if Enabled then
    Value := Delta;
end;
```

Unary minus stores `-5`; Boolean `not` changes `False` to `True`.

## Unary sign

Unary `+` does not convert, widen or validate a value beyond parsing the following expression. Unary `-` requires a runtime type supported by `DoMinus` (signed/real/Variant-compatible numeric paths as registered). Negating the lowest value of a fixed-width signed type can overflow its representable positive range; there is no extra checked-arithmetic contract here.

## `not`

For the default Boolean type and the recognised `LongBool`, `WordBool` and `ByteBool` aliases, `not` is logical negation. For integer types it complements every bit. These operations are different:

```Delphi
not True   { Boolean False }
not 0      { all bits set in the selected integer representation }
```

Do not use integer `not` as though it returned a Boolean condition.

## Restricted address-of behaviour

The Velox parser's `@` path is narrower than Delphi and Free Pascal:

- it expects an identifier;
- `FindProc` must resolve it;
- the resolved procedure must be script-internal, not merely an imported/external function; and
- it returns a procedural pointer used by a compatible procedural type/call path.

It does not implement the general Delphi rule that `@` can take the address of an arbitrary variable or imported method. Most Velox configuration scripts do not need procedure pointers; use them only when a registered declaration explicitly requires one.

## Common mistakes

- Using `not` on an integer when Boolean negation was intended, or on a Variant without first establishing its subtype.
- Assuming unary `+` performs numeric conversion.
- Negating unsigned values and expecting a portable positive/negative mathematical result.
- Copying Delphi pointer examples that take `@Variable` or `@ImportedFunction`; this parser rejects those forms.
- Omitting parentheses around a negated comparison. Write `not (A = B)` to show the intended Boolean operand.

## Edge cases and quirks

- A negative integer literal is read as one signed literal where possible; a non-literal expression is compiled as runtime negation. Boundary diagnostics can therefore differ between literal parsing and calculated values.
- The compiler builds `not` before multiplying-level binary operations. `not A and B` means `(not A) and B`.
- Unary `+` and non-literal unary `-` call `ReadTerm`, not `ReadFactor`. Consequently, `-A and B` is parsed as `-(A and B)`, whereas `(-A) and B` must be written explicitly. This differs from the usual Pascal rule that all unary operators have the same highest precedence.
- Type checking for some unary nodes is completed when the calculation is emitted/executed; a permissive Variant or unsuitable runtime subtype can fail at runtime.
- Address-of produces a procedural reference, not object ownership and not permission to call unregistered code.

## Errors, performance and concurrency

Unknown/internal-procedure restrictions, unsuitable operand types and incompatible procedural-pointer assignment cause compile-time or runtime type errors. Unary scalar operations are constant-time. They do not mutate their operand or provide synchronisation; evaluated property/function operands keep their normal side effects.

## Related reference

- `Arithmetic (Math)` — binary numeric operations and fixed-width behaviour.
- `Boolean` — binary logical and bitwise operations.
- `Relational (Comparison)` — parenthesise a comparison when applying Boolean `not`.

## External references

- [Free Pascal: Arithmetic operators](https://www.freepascal.org/docs-html/current/ref/refsu44.html)
- [Free Pascal: The @ operator](https://www.freepascal.org/docs-html/current/ref/refse87.html)
- [Embarcadero DocWiki: Expressions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Expressions_%28Delphi%29)
