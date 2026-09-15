---
title: "Label '%s' not set"
description: "Why every label declared in a Velox script routine must also mark a statement in that routine."
sidebar_position: 24
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - labels
  - goto
---

Velox reports `Label '<name>' not set` when a routine declares a label but never defines it with a labelled statement. The `%s` in the catalogue title is replaced by the unresolved label name in the actual compiler message.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
label
  Finished;
begin
  Value := 'complete';
end; // Error: Label 'Finished' not set
```

Remove an unused declaration. If the label is required, define it in the same routine:

```Delphi
procedure ScriptEvent(var Value: Variant);
label
  Finished;
begin
  goto Finished;
  Value := 'not reached';
Finished:
  Value := 'complete';
end;
```

Prefer structured control flow where it expresses the same intent more clearly.

## How Velox detects it

Each routine stores declared labels with an unresolved bytecode offset. After compiling the routine body, `ProcessLabelForwards` checks every stored label. An offset still set to `-1` emits `ecUnSetLabel`, with the label name passed to the formatter. Compilation stops before unresolved `goto` offsets are patched.

The definition is required even when no `goto` refers to the label. The declaration itself creates the obligation.

## Correction procedure

1. Find the exact label named in the diagnostic's full text.
2. If it is unused, remove it from the `label` declaration.
3. If it is used, add exactly one `<name>:` marker before a statement in the same routine.
4. Confirm that the label has not been misspelt or moved into a different procedure.
5. Recompile and then resolve any separate `Invalid jump` boundary error.

## Edge cases and quirks

- Label identifiers are case-insensitive, like other Velox script identifiers.
- A label declared in an outer routine cannot be defined inside another routine.
- Defining the label does not make every jump to it valid. Loop, `case`, `with` and exception-block boundaries are checked separately.
- The diagnostic is issued during routine finalisation, so its reported location may be near the routine's end rather than at the declaration.

## Related reference

- `Invalid jump` - the label exists but a jump crosses a protected boundary.
- `Colon (':') expected` - malformed labelled-statement syntax.
- `Duplicate identifier` - a conflicting declaration in the same scope.

## External references

- [Free Pascal: Goto statements](https://www.freepascal.org/docs-html/ref/refsu54.html)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
