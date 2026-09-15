---
title: "Not in a loop"
description: "Why Velox accepts break and continue only while compiling an active for, while or repeat loop."
sidebar_position: 29
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - loops
  - break
  - continue
---

Velox reports `Not in a loop` when `break` or `continue` appears without an active loop target. Both statements are compiled as jumps whose destination is supplied by the surrounding `for`, `while` or `repeat` compiler.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Value = '' then
    break; // Error: Not in a loop
end;
```

Use `exit` to leave the current procedure, or put `break` inside the loop it is intended to end:

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  while Value <> '' do
  begin
    if Value = 'stop' then
      break;
    Value := Copy(Value, 2, Length(Value));
  end;
end;
```

## How Velox detects it

While compiling a loop, PascalScript creates lists for unresolved `break` and `continue` bytecode offsets. Outside a loop, that target context is absent. `ProcessSub` recognises either keyword, sees no active offset list and emits `ecNotInLoop`.

Inside a loop, the compiler also emits cleanup operations for nested `try`, `except`, `finally` and `with` state before writing the jump. It later patches `break` to the loop end and `continue` to the loop's next-test or increment point.

## Correction procedure

1. Decide whether the intended target is a loop, the current routine or an enclosing business operation.
2. Use `break` only to end the nearest active loop.
3. Use `continue` only to start the next iteration of the nearest active loop.
4. Use `exit` to leave the current procedure; do not substitute it mechanically when later cleanup or statements are required.

## Edge cases and quirks

- An `if`, `case`, `begin..end` or `try` block does not by itself provide a loop target.
- In nested loops, `break` and `continue` apply only to the nearest loop.
- `break` and `continue` are recognised case-insensitively through the identifier path.
- Unlike Delphi's separate restriction on leaving a `finally` clause, this compiler path only tests whether a loop target exists. When a transfer leaves active exception or `with` state, Velox emits cleanup operations before the jump. Treat this as a Velox implementation detail, not portable Delphi syntax.
- This is a compile-time error; no partial iteration occurs.

## Related reference

- `for` - counted-loop control.
- `while` - pre-test loop control.
- `repeat..until` - post-test loop control.
- `Invalid jump` - a `goto` crosses a protected structured region.

## External references

- [Free Pascal: Break](https://www.freepascal.org/docs-html/rtl/system/break.html)
- [Free Pascal: Continue](https://www.freepascal.org/docs-html/rtl/system/continue.html)
- [Embarcadero DocWiki: E2097 BREAK or CONTINUE outside of loop (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/E2097_BREAK_or_CONTINUE_outside_of_loop_%28Delphi%29)
- [Embarcadero DocWiki: E2126 Cannot BREAK, CONTINUE or EXIT out of a FINALLY clause (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/E2126_Cannot_BREAK%2C_CONTINUE_or_EXIT_out_of_a_FINALLY_clause_%28Delphi%29)
