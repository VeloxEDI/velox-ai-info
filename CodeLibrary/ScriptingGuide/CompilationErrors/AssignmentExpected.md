---
title: "Assignment (':=') expected"
description: "Why Velox expects the `:=` assignment token and how to correct the statement."
sidebar_position: 1
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - assignment
---

Velox reports this error when a statement has produced a writable target but the compiler cannot find the `:=` token that starts an assignment. It is a compile-time syntax error; the script does not run.

## Required syntax

```Delphi
Target := Expression;
```

Pascal uses `:=` to store a value and `=` to compare two values or separate parts of some declarations. They are not interchangeable.

## Example

This statement uses an equality token where assignment is required:

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value = 'Ready'; // Error: Assignment (':=') expected
end;
```

Use the assignment token:

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := 'Ready';
end;
```

The same diagnostic applies to the initial assignment in a `for` statement:

```Delphi
for Index = 1 to 10 do       // Incorrect
for Index := 1 to 10 do      // Correct
```

## How Velox detects it

Velox uses its modified PascalScript compiler. `ProcessIdentifier` emits this diagnostic when an identifier statement resolves to a writable value but is not followed by `:=`. `ProcessFor` emits it independently after the loop-control variable. The compiler records the current parser position, module, severity and message, then Velox displays the formatted result as `[Error] Module(Row:Column): Assignment (':=') expected`.

The row and column identify the token at which the parser established that `:=` was absent. Inspect the complete statement immediately before that position, not only the highlighted token.

## Common causes

- Using `=` because the intended operation is described as “set” or “equals”.
- Omitting the colon and writing `Target = Value` or `Target Value`.
- Starting a line with a writable identifier when a function call was intended.
- Writing a C-style compound assignment such as `Count += 1`; Velox scripts require `Count := Count + 1`.
- Omitting `:=` after the counter in a `for` statement.
- Leaving an earlier expression or delimiter incomplete, causing the next identifier to be interpreted as a new assignment statement.

## Correction procedure

1. Identify whether the line is intended to change a value or compare values.
2. For storage, use a writable variable, field, property or indexed target followed by `:=`.
3. For comparison, put the `=` expression inside a construct that consumes a Boolean value, such as `if Left = Right then`.
4. If the line already contains `:=`, check the preceding line for a missing semicolon, parenthesis or block terminator.
5. Recompile and address the first remaining diagnostic before interpreting later messages.

## Related reference

- `Assignment` — writable targets, conversion and side-effect rules.
- `Relational (Comparison)` — using `=` and `<>` to produce Boolean results.
- `for loop` — the required loop-control assignment form.

## External references

- [Free Pascal: Assignments](https://www.freepascal.org/docs-html/current/ref/refsu52.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
