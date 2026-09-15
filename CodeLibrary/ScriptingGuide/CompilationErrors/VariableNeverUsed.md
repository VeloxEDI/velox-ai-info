---
title: "Variable never used"
description: "Meaning and limitations of the compiler hint that a declared local, global or result variable is unused."
sidebar_position: 50
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - hint
  - variables
  - result
---

`Variable '<name>' never used` is a compiler Hint emitted when the modified PascalScript compiler finishes a routine or source and a tracked variable has not been marked as used. It does not prevent bytecode output by itself.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  UnusedCode: string; // Hint: Variable 'UNUSEDCODE' never used
begin
  Value := 'Ready';
end;
```

Remove an obsolete declaration. If the variable was intended to affect the result, implement that logic rather than adding a dummy reference:

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  PreparedCode: string;
begin
  PreparedCode := 'READY';
  Value := PreparedCode;
end;
```

## How Velox detects it

The compiler has two active scans:

- after compiling each internal procedure/function body, it scans that routine's tracked variables; and
- after the complete source has been parsed and forward routines/exports are resolved, it scans registered global script variables before generating output.

When an identifier resolves to one of those variables, its internal `Used` flag is set. A function result has a separate flag and is reported using the parameter name `Result` when the function body never resolves that result variable.

## Interpretation

The hint is a declaration-reference check, not full data-flow analysis:

- it identifies a variable that the compiler did not resolve anywhere after declaring it;
- a reference can mark the variable used whether it appears in a read or write context;
- it does not prove that an assigned value is later read;
- it does not prove that every control path assigns a function result; and
- it does not prove that removing the variable leaves the intended business logic correct.

Review the surrounding algorithm before deleting anything. An unused declaration can be harmless residue, or it can reveal a misspelled reference, a missing calculation or a branch that was never completed.

## Function `Result`

For a function with a declared return type, the compiler emits `Variable 'Result' never used` if the result storage was never referenced. This is stronger evidence of an incomplete function than an unused scratch variable, but it is still based on the reference flag rather than definite-assignment analysis. Check every return path and the intended result value.

## Output and include behaviour

- The severity is `Hint`, not `Error` or `Warning`, and the compiler can still create output.
- Velox deliberately omits Hint messages whose module name differs from the main compiled file when it formats normal output or exception text. An unused variable in included source may therefore be recorded internally but not shown in the main output.
- The name is formatted from the compiler's normalised identifier and can appear in uppercase.

## Correction procedure

1. Search the complete compiled source, including includes, for the declared variable.
2. Check for a misspelling or a similarly named variable that is used instead.
3. Remove the declaration if it is genuinely obsolete.
4. If logic is missing, implement the intended read/write and verify the resulting value or side effect.
5. For `Result`, assign and verify the intended function result on every applicable path.
6. Do not add a no-op read merely to suppress the hint.

## Related reference

- `Function never used` - a defined hint that the current compiler does not emit.
- `Unknown identifier` - a misspelled intended reference cannot be resolved.
- `Unsatisfied Forward` - a routine is declared but never implemented.

## External references

- [Free Pascal: Symbol handling](https://www.freepascal.org/docs-html/3.0.2/user/userse64.html)
- [Embarcadero DocWiki: H2164 Variable is declared but never used](https://docwiki.embarcadero.com/RADStudio/Florence/en/H2164_Variable_%27%25s%27_is_declared_but_never_used_in_%27%25s%27_%28Delphi%29)

Free Pascal and Delphi perform their own symbol/data-flow analyses and distinguish more unused or assigned-but-unread cases. Those upstream diagnostics are comparison material; the simpler flag-based Velox behaviour above comes from the shipped embedded compiler.
