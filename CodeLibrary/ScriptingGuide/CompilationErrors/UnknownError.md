---
title: "Unknown error"
description: "What the compiler's defensive unknown-error message means and what evidence to retain for escalation."
sidebar_position: 44
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - unknown-error
  - support
---

`Unknown error` is the defensive fallback in the modified PascalScript compiler's error formatter. It does not describe an ordinary source-language condition and it is not the same as `Unknown identifier` or `Unknown type`.

## Current Velox behaviour

Compiler errors carry an enumerated error code. The formatter maps every error code declared by the current build to a specific public message, including conditional unit-support errors and `Attributes not closed`. Its final `else` branch returns `Unknown error` only when the value does not match one of those known codes.

A repository-wide source trace finds no normal compiler path that deliberately emits an unknown error code. Standard script syntax should therefore produce a specific diagnostic rather than this fallback. If `Unknown error` appears, possible explanations include a mismatched or extended scripting component, an invalid error value or an implementation defect in the compiler/host boundary.

## What to retain

1. Preserve the complete compilation output, including module, row, column, severity and every preceding message.
2. Record the Velox version, component used to compile, event type and whether the installation has customised scripting libraries.
3. Preserve the exact script and included files before reformatting or reducing them.
4. Confirm whether the same source produces the message consistently.
5. Reduce a copy to the smallest reproduction while retaining the original evidence.
6. Report the issue through the normal Velox support process.

## Do not assume

- Do not interpret `Unknown error` as an unknown name; those paths have parameterised `Unknown identifier` and `Unknown type` messages.
- Do not add casts, punctuation or declarations at random. There is no source-backed generic syntax correction for this fallback.
- Do not discard earlier errors. A preceding diagnostic can identify the real source condition even if a later formatter value is invalid.
- Do not assume an event ran partially. This catalogue message belongs to the compile-error formatter.

## Example and verification boundary

No failing script example is provided because ordinary script source cannot intentionally select the formatter's default branch in the current build. Fabricating one would misrepresent a compiler/host fault as supported syntax behaviour. A minimal reproduction should be created only from a real occurrence and retained as support evidence.

## Performance and concurrency

The message is produced while formatting compilation output, not while executing a flow. It has no direct runtime or concurrency behaviour. Reproduction does not require an image-function test bed or production execution.

## Related reference

- `Internal error` - the compiler deliberately reports an implementation failure with a code or exception detail.
- `Unknown identifier` - a script name cannot be resolved.
- `Unknown type` - a required type name cannot be resolved.
- `Syntax error` - source tokens match no supported grammar at the current point.

## External references

No Free Pascal or Embarcadero page is linked because this is a defensive fallback specific to the shipped embedded PascalScript error formatter, not a Delphi language diagnostic with a user-code correction.
