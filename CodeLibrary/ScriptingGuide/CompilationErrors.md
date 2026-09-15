---
title: Compilation errors
description: Guide to compiler messages emitted while validating or compiling Velox scripts.
sidebar_position: 11
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compiler
  - errors
  - diagnostics
---

Velox compiles a script before installing its event delegate. The compiler checks tokens, declarations, types, procedure calls, statement structure and required event signatures. A failed compilation prevents that event script from running.

## Diagnostic pipeline

Velox passes the main script and any preprocessed includes to its modified PascalScript compiler. Compiler messages carry a severity, module, row and column. The Designer shows the collected output; event compile helpers also log a failure with the event and map/script-item context and attach the source and message text.

Hints from included modules are filtered from the main editor output, but errors in an include still fail compilation. A module name other than `Main` usually identifies Global Script, a scriptlet or a file include.

After syntax/type compilation, Velox performs an additional event-signature check. Recognised procedures must exactly match their contract. For example, `BeforeMapEvent`, record/field `AfterMapEvent` and `ScriptEvent` require one `var Variant`; `LinkedDataEvent` requires one `var` data-view class; OnStartMap and OnEndMap require no parameters.

## A repair workflow

1. Start with the first error, because later messages can be consequences of the same missing token or declaration.
2. Open the reported module and line. If it is an include, correct the shared source rather than compensating in the caller.
3. Compare identifiers and calls with the exact Code Library declaration, including parameter count, order, type and `var`/`out` mode.
4. Check the surrounding block for the delimiter named in the error: `begin`, `end`, `then`, `do`, `of`, a semicolon, comma, colon, parenthesis or bracket.
5. Recompile and repeat until no error remains. Review warnings/hints separately; successful compilation is not proof of correct runtime behaviour.

## Example

Incorrect:

```Delphi
procedure ScriptEvent(Value: Variant);
begin
  Value = 1;
end;
```

Corrected:

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := 1;
end;
```

The source-reviewed correction restores the required parameter mode and uses the assignment operator.

## Common error families

- **Expected token** — a delimiter or keyword is absent, misplaced or hidden by an earlier unterminated construct.
- **Unknown identifier/type/property** — the name is misspelled, out of scope, absent from an include or not registered by Velox.
- **Type/parameter mismatch** — operands or actual parameters are incompatible with the exact registered declaration.
- **Procedure header mismatch** — a recognised event name has the wrong signature.
- **Duplicate identifier/unsatisfied forward** — combined main/include declarations conflict or a promised routine body is missing.
- **Invalid jump/not in a loop** — `break`, `continue`, `exit` or other control flow appears at an unsupported boundary.
- **Never used / calculation always evaluates** — a hint identifies dead or suspicious code; it may not block compilation but deserves review.

## Edge cases and quirks

- A missing include can resolve to empty text because the Velox include callback reports success with no content. The resulting error may be “Unknown identifier” rather than “include not found”.
- An unclosed comment or string makes the parser reach end-of-file, so the reported later token can be secondary.
- The error strings are from Velox's modified PascalScript compiler, not the current Delphi compiler; search the exact child page in this guide.
- Runtime failures—database errors, nil objects, conversion errors during execution—are not compilation errors even when the script compiled successfully.
- Correcting the first structural error often removes several later diagnostics without separate changes.

## Related reference

- **Scripting** — compile and event-verification sequence.
- **Includes** — resolving module-specific failures.
- **Statements** and **Operators** — grammar and token use.
