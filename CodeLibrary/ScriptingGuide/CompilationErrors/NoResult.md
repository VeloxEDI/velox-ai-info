---
title: "No result"
description: "Why a procedure or other result-less callable cannot supply a value to a Velox expression."
sidebar_position: 26
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - procedures
  - expressions
---

Velox reports `No result` when a callable with no return type is used where the compiler must produce an expression value. A procedure can change state or `var` parameters, but it cannot be assigned, compared or passed as the value of another argument.

## Example

```Delphi
procedure IncrementValue(var Number: Integer);
begin
  Number := Number + 1;
end;

procedure ScriptEvent(var Value: Variant);
var
  Counter: Integer;
begin
  Counter := 1;
  Value := IncrementValue(Counter); // Error: No result
end;
```

Call the procedure as a statement, then use the state it changed:

```Delphi
IncrementValue(Counter);
Value := Counter;
```

## How Velox detects it

The compiler resolves a call to its registered or script-declared result type. During bytecode generation, `_ProcessFunction` receives a destination register when the surrounding expression needs a value. If the call's `ResultType` is `nil` while that destination exists, it emits `ecNoResult` and stops compiling the expression.

A function used as a statement is the opposite case: the call has a result but no surrounding destination requires it. The current compiler permits the call and discards the returned value.

## Common causes

- Assigning a procedure call to a variable.
- Comparing a procedure call with a value.
- Passing a procedure call as another routine's argument.
- Confusing a `var` output parameter with a function result.
- Selecting a similarly named procedure instead of the function overload expected from Delphi.

## Correction procedure

1. Check the exact Code Library declaration and determine whether it is a `procedure` or `function`.
2. For a procedure, call it as a standalone statement.
3. Read its documented `var` parameter, property or other state only after the call.
4. If a value-returning overload is required, confirm that Velox actually registers that overload.

## Edge cases and quirks

- Adding parentheses does not create a result; it only changes call syntax.
- A procedure may still have material side effects. Removing the call just to clear the diagnostic can change behaviour.
- The error is emitted before normal event execution, so the procedure has not partly run.
- A separate `Variable Expected` error can occur first when a procedure's `var` parameter receives a literal or calculation.

## Related reference

- `Invalid number of parameters` - the selected callable has a different argument count.
- `Variable Expected` - an output argument is not assignable storage.
- `Functions` - interpreting registered procedure and function declarations.

## External references

- [Free Pascal: Function calls](https://www.freepascal.org/docs-html/ref/refse82.html)
- [Embarcadero DocWiki: Procedures and Functions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Procedures_and_Functions_%28Delphi%29)
