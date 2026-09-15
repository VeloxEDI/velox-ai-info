---
title: "Assignment"
description: "The := operator, writable targets and compatible-value rules in Velox scripts."
sidebar_position: 1
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - operators
  - assignment
---

Use `:=` to evaluate an expression and store its result in a writable script target. Assignment changes state; equality testing uses `=` instead.

## Syntax

```Delphi
Target := Expression;
```

Depending on the registered type, a target can be a local or global variable, a writable field or property, or an assignable indexed element. A constant, function result expression or read-only property is not writable.

## How it works

For an identifier statement, `TPSPascalCompiler.ProcessIdentifier` parses the left side up to `:=` and requires it to resolve as a writable `TPSValueVar` or an applicable setter path. It parses the right expression once, checks the exposed types, and emits `WriteCalculation` instructions.

At runtime, an ordinary assignment executes the `CM_A` opcode. `TPSExec.SetVariantValue` copies or converts the source into the destination's registered type. Managed strings, dynamic arrays, interfaces and Variants use the runtime's finalisation/reference-management paths; an imported property or dynamic-dispatch target can instead invoke its registered setter.

The target's type controls the stored representation. Assignment does not change a statically typed variable into the expression's type. A Variant target can hold different value kinds over time, subject to the host runtime's Variant rules.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Quantity: Integer;
  Description: string;
begin
  Quantity := 3;
  Description := 'validated';
  Value := Description;
end;
```

Each right side is evaluated before its result is stored. The final assignment updates the event's caller-visible `var` parameter.

## Evaluation and side effects

- A normal right-hand expression is evaluated once for that assignment.
- An indexed target can evaluate its index and call a registered element setter.
- A property assignment can run arbitrary host setter code, validate or convert the value, change related object state and raise an exception.
- Assigning to an exposed dataset field or module object may affect the current map/process state; the target's own reference page remains authoritative.
- Assignment copies a reference for reference-managed or object values according to the imported runtime type. It does not imply that the script owns or may free an object.

## Common mistakes

- Using `=` where a value must be stored, or `:=` in an `if` condition where equality is intended.
- Assigning a value that merely looks convertible, especially a Variant containing text into a numeric target. Validate or convert explicitly.
- Assuming an imported property is a passive field. Its setter may have side effects or reject values.
- Chaining C-style assignments such as `+=`, `-=`, `++` or `--`. They are not tokens in the Velox assignment grammar; write `X := X + 1` explicitly.
- Assigning to the counter inside a `for` loop. The compiler permits it, but it changes the loop's control flow.

## Edge cases and quirks

- Integer types are broadly assignment-compatible in the compiler, so narrowing can occur when the destination is smaller or unsigned. Range checking is not added by this statement; validate bounds when loss would matter.
- Variant compatibility is deliberately permissive at compile time. The actual runtime value can still cause `ErTypeMismatch`, Null Variant or conversion errors.
- String-character indexed assignment is implemented through registered helpers such as `StrSet`/wide-string equivalents; invalid indexes fail under those runtime rules.
- Dynamic array and record assignment uses runtime copy/finalisation code. Treat large values as real copy work, not a zero-cost alias, unless the particular type reference says otherwise.
- Assigning an object reference copies the reference; it does not clone the object.

## Errors

The compiler reports an expected assignment, variable expected or type mismatch when the target/syntax is invalid. Runtime conversion, read-only/setter, range, Null and host exceptions propagate through the current script exception mechanism. A failed setter may have completed some of its own side effects; consult its page rather than assuming atomicity.

## Performance and concurrency

Scalar local assignment is inexpensive. Managed-value copies, Variant conversion, indexed access and imported setters can allocate or call host code. Assignment provides no transaction or lock; concurrent safety belongs to the target object/API.

## Related reference

- `Relational (Comparison)` — `=` and `<>` compare values without assigning them.
- `Arithmetic (Math)` — calculate the right-hand value before storage.
- `String` — concatenation and text comparison rules.
- `ScriptEvent` — its `Value` parameter is writable because it is registered as `var Variant`.

## External references

- [Free Pascal: Assignments](https://www.freepascal.org/docs-html/current/ref/refsu52.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
