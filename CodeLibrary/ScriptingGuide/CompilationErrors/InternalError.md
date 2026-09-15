---
title: "Internal error"
description: "What a numbered or parameterised internal compiler error means and what evidence to retain."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - internal-error
  - support
---

`Internal error (<detail>)` means the compiler reached an implementation failure or violated an internal bytecode-generation expectation. It is not a normal instruction to add a missing keyword or change a declared type.

## Message forms

The current modified PascalScript compiler can include either a numbered code or an exception message:

```text
Internal error (00015)
Internal error (00016)
Internal error (00017)
Internal error (00018)
Internal error (<exception message>)
```

The complete parameter is essential diagnostic evidence.

## Known numbered paths

- `00015` — the compiler could not write an output record for a procedure/function result while emitting a call.
- `00017` — the `while` compiler could not write the Boolean condition output record.
- `00016` — the `repeat` compiler could not write the Boolean condition output record.
- `00018` — the `if` compiler could not write the Boolean flag/output record.

An unexpected Delphi exception raised while the compiler pre-calculates a constant expression is also converted to `ecInternalError`, with the exception's message as the detail.

These descriptions identify implementation sites; they do not establish that the user's surrounding statement is semantically wrong.

## What to do

1. Preserve the full formatted diagnostic, including module, row, column and parameter.
2. Record the Velox version, event type and compilation action.
3. Preserve the exact script and any included files. Do not reformat them before retaining a copy.
4. Determine whether the failure is repeatable with the same inputs.
5. Reduce a copy to the smallest reproducible script while retaining the original evidence.
6. Report the issue through the normal Velox support path with the script, steps and preceding diagnostics.

## Minimal-reproduction technique

Remove unrelated routines or statements in a copy and recompile after each change. For numbered loop/condition codes, retain the owning `while`, `repeat` or `if` expression and any functions/types it uses. For `00015`, retain the call and its result/argument types. A minimal reproduction can expose a compiler type combination without suggesting that changing production business logic is the permanent solution.

## Do not assume

- Do not treat the number as a script line number or public error catalogue identifier.
- Do not keep adding casts or punctuation at random; that can hide the reproduction without resolving the compiler defect.
- Do not assume the script executed partially. This diagnostic is emitted during compilation, before normal event execution.
- Do not discard earlier compiler messages; an earlier ordinary error may be relevant to the state that led to the invariant failure.

## Performance and concurrency

The error itself is not a runtime performance or concurrency condition. When reproducing it, use the normal compile/test path and avoid executing unrelated production flows. No image-function test bed or runtime integration test is required to document this compiler diagnostic.

## Related reference

- `Syntax error` — a normal user-source grammar failure.
- `Type mismatch` — a normal incompatible-type diagnostic.
- `Compilation errors` — interpreting severity, module and row/column output.

## External references

No Free Pascal or Embarcadero page is linked because the numbered paths and exception conversion are specific to Velox's embedded modified PascalScript compiler.
