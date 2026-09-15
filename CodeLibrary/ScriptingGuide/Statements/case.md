---
title: "case"
description: "Multi-branch selection with labels, ranges and an optional fallback branch."
sidebar_position: 4
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - statements
  - selection
---

Use `case` to select the first matching branch from several values or inclusive ranges. An optional `else` section handles values that match no branch.

## Syntax

```Delphi
case SelectorExpression of
  Label1: Statement1;
  Label2, Label3: Statement2;
  RangeStart..RangeEnd: Statement3;
else
  FallbackStatements;
end;
```

A labelled branch controls one statement; wrap several statements in `begin..end`. The `else` section may contain a sequence of statements up to the final `end`.

## How it works

`TPSPascalCompiler.ProcessCase` evaluates `SelectorExpression` once and stores it in a temporary of the selector's type. It then emits the branches in source order:

1. A single label is compared to the stored selector with `=`.
2. Comma-separated labels are combined with Boolean `or`.
3. A range is compiled as `(Selector >= RangeStart) and (Selector <= RangeEnd)`.
4. The first true branch runs and execution jumps to the statement after the final `end`.
5. If no branch matches, the `else` statements run when present; otherwise execution simply continues after `end`.

These comparisons use the same modified PascalScript type compatibility and runtime operations as ordinary relational expressions.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  StatusCode: Integer;
begin
  StatusCode := 4;
  case StatusCode of
    1: Value := 'new';
    2, 3: Value := 'processing';
    4..9: Value := 'completed';
  else
    Value := 'unknown';
  end;
end;
```

`StatusCode` is evaluated once; value `4` selects the inclusive `4..9` range.

## Common mistakes

- Forgetting the `of` or the colon after a label list.
- Expecting every branch to run when ranges overlap. The generated control flow selects the first matching branch only.
- Omitting `begin..end` around multiple statements in a labelled branch. Only the first statement belongs to that label.
- Assuming text comparisons are case-insensitive or locale-aware. The script runtime compares string values directly; normalise explicitly when business rules require it.

## Edge cases and quirks

- Unlike Delphi's language rule that case labels are compile-time constants, this modified compiler parses label and range endpoints with its general expression parser. A variable or function expression can therefore compile as a label and is evaluated when execution reaches that branch test. Avoid this extension: constant labels are clearer, deterministic and portable.
- Because branch tests are emitted sequentially, later label expressions are not evaluated after an earlier match. Side effects in labels would consequently be order-dependent.
- The compiler does not build Delphi's compile-time case table or perform the same duplicate/overlapping-label analysis. Overlaps resolve to the first source branch.
- The selector is not limited by `ProcessCase` to Delphi's normal ordinal case types. What compiles is governed by whether each generated equality/order comparison has compatible operands. This can admit strings and Variants, with their runtime conversion and Null/error behaviour.
- A range is inclusive at both ends. When the lower endpoint is greater than the upper endpoint, that test cannot match under normal ordered comparisons.

## Errors and side effects

Missing structural tokens cause compilation errors. An incompatible comparison normally produces a compile-time type mismatch; Variant conversions and evaluated label functions may still fail at runtime. The selector's side effects occur once, while dynamic label-expression side effects occur sequentially until a match.

## Performance and concurrency

Branches are tested in source order rather than through an indexed jump table. Cost grows with the number and complexity of labels before the match. Put common constant matches early only when that ordering remains readable. `case` does not protect shared state from concurrent access.

## Related reference

- `if..else` — better for two choices or unrelated Boolean conditions.
- `Relational (Comparison)` — defines the comparisons used by labels and ranges.
- `begin..end` — groups several statements under one label.

## External references

- [Free Pascal: The Case statement](https://www.freepascal.org/docs-html/current/ref/refsu56.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
