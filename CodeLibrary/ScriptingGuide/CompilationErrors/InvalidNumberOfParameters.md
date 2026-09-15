---
title: "Invalid number of parameters"
description: "How Velox detects missing or extra arguments for the routine or indexed property being compiled."
sidebar_position: 22
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - parameters
  - arguments
---

Velox reports `Invalid number of parameters` when the actual argument list does not contain exactly the arguments required by the selected script-visible declaration. It applies to routines and to property accessors whose indexes are compiled as parameters.

## Example

```Delphi
procedure SetPair(var Target: String; const LeftValue, RightValue: String);
begin
  Target := LeftValue + RightValue;
end;

procedure ScriptEvent(var Value: Variant);
var
  TextValue: String;
begin
  SetPair(TextValue, 'A'); // Error: Invalid number of parameters
  Value := TextValue;
end;
```

Supply the missing argument in declaration order:

```Delphi
SetPair(TextValue, 'A', 'B');
```

An additional argument produces the same diagnostic.

## How Velox detects it

The compiler first parses the actual arguments, then `ValidateParameters` walks the selected declaration and the parsed values in order. It emits this error in either of two cases:

- a declared parameter has no remaining actual value; or
- a non-empty actual value remains after every declared parameter has been matched.

After the counts match, the same validation assigns the expected type and parameter mode to each actual argument. A wrong type normally reports `Type mismatch`; passing a literal or calculation to a `var`/`out`-style parameter normally reports `Variable Expected`. Those are not parameter-count failures.

## Correction procedure

1. Read the exact declaration shown for the Code Library entry or property.
2. Count actual arguments at the same parenthesis level; ignore commas inside nested calls.
3. Supply one argument for each exposed parameter, in order, and remove extras.
4. Confirm that the selected overload is actually exposed by Velox. A Delphi overload that is not registered is unavailable to the script.
5. After the count is correct, resolve any separate type or variable-mode diagnostic.

## Edge cases and quirks

- An unclosed nested call can make the outer argument count appear wrong. Correct bracket and parenthesis errors first.
- Indexed and default properties use the same parameter validator for their index values, so the message can refer to `Object[Index]` rather than a visibly named routine.
- The message does not state the expected or actual count. Use the registered declaration as the contract.
- Parameter names do not affect calls; count, order, type and mode do.

## Related reference

- `Comma (',') expected` - missing separation between peer arguments.
- `Variable Expected` - a `var`-style parameter received a non-variable expression.
- `Type mismatch` - the count matches but an argument type does not.

## External references

- [Free Pascal: Function calls](https://www.freepascal.org/docs-html/ref/refse82.html)
- [Embarcadero DocWiki: Parameters (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Parameters_%28Delphi%29)
