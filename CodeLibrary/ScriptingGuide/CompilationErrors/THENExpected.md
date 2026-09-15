---
title: "'THEN' expected"
description: "Why a completed Velox if condition must be followed by the then keyword before its statement."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - if
  - then
---

Velox reports `'THEN' expected` when it has parsed the condition following `if` but the next token is not the `then` keyword. `then` separates the Boolean condition from the single statement or `begin..end` block controlled by that condition.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Value = ''
    Value := 'default'; // Error: 'THEN' expected
end;
```

Add the keyword after the complete condition:

```Delphi
if Value = '' then
  Value := 'default';
```

## How Velox detects it

`ProcessIf` advances past `if` and asks the expression compiler to calculate up to token `then`. If an expression is produced but the current token is not `then`, it frees the temporary expression and emits `ecThenExpected`. Only this `if` compiler path emits the diagnostic.

After accepting `then`, the compiler writes the condition into its Boolean working register and emits the conditional branch. A condition that cannot be converted to the registered Boolean type can therefore report `Type mismatch` after the keyword issue is fixed.

## Correction procedure

1. Check that the condition before the reported token is complete.
2. Balance any parentheses and finish comparisons or function calls.
3. Add `then` immediately before the controlled statement.
4. For multiple controlled statements, enclose them in `begin..end`.
5. In an `if..then..else`, do not put a semicolon immediately before `else`.

## Edge cases and quirks

- A malformed condition can emit another expression diagnostic before the compiler reaches this check.
- Newlines have no special terminating meaning; `then` is still required even when the controlled statement starts on the next line.
- Nested `if` statements associate each `else` with the nearest unmatched `if`; use `begin..end` to make a different structure explicit.
- Velox enables short-circuit Boolean evaluation, but that affects runtime operand evaluation, not the requirement for `then`.

## Related reference

- `if` - conditional-statement syntax and execution.
- `if..else` - branch association and semicolon rules.
- `Semicolon (';') expected` - statement separation after the complete conditional.
- `Type mismatch` - the parsed condition is not Boolean-compatible.

## External references

- [Free Pascal: The If..then..else statement](https://www.freepascal.org/docs-html/ref/refsu57.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
