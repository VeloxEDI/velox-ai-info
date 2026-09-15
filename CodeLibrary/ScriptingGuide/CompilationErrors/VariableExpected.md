---
title: "Variable Expected"
description: "Why a Velox construct requires writable variable storage instead of a value expression."
sidebar_position: 49
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - variables
  - var-parameters
  - assignment
---

Velox reports `Variable Expected` when a construct needs an addressable, writable storage location but receives a literal, constant, type, routine result or other value expression instead.

## Example

A `var` parameter can modify its caller's storage, so a literal cannot be supplied:

```Delphi
procedure SetPrepared(var Text: string);
begin
  Text := 'Prepared';
end;

procedure ScriptEvent(var Value: Variant);
begin
  SetPrepared('fixed text'); // Error: Variable Expected
end;
```

Pass a compatible variable:

```Delphi
procedure SetPrepared(var Text: string);
begin
  Text := 'Prepared';
end;

procedure ScriptEvent(var Value: Variant);
var
  Text: string;
begin
  SetPrepared(Text);
  Value := Text;
end;
```

## Current emission families

The modified compiler emits this diagnostic when:

- an actual argument for a `var`, `out` or other non-input parameter is not a variable value;
- a string or `Variant` element is assigned through an expression that is not backed by writable storage;
- a record field is selected from a temporary value that cannot be addressed as a variable;
- a variable-only identifier lookup finds a type, procedure/function or constant instead;
- a `for` statement supplies something other than a writable counter variable; or
- an identifier-led statement resolves to a value expression that is neither an assignment target nor a callable routine.

The check occurs before or alongside type compatibility. A literal passed to a `var` parameter produces `Variable Expected`; a real variable of the wrong type proceeds to the stricter check and produces `Type mismatch`.

## Correction procedure

1. Identify why the construct needs storage: assignment target, counter, `var`/`out` parameter, address or mutable element/member.
2. Declare a local variable of the required type.
3. Assign any starting value to that variable separately.
4. Pass or use the variable in the variable-only position.
5. If a function/property returns a record or value, copy it to a local variable, modify the local value, then assign the complete value back through a supported setter when one exists.
6. Recompile and resolve any subsequent `Type mismatch` separately.

## Edge cases and quirks

- A constant has a value but no writable storage. Renaming a constant does not make it suitable for a `var` parameter.
- A routine result or calculated expression can be assignment-compatible as an input parameter but still cannot be used as a non-input parameter.
- Properties are implemented through getter/setter calls and do not necessarily have an address. Passing a property as a `var` argument can therefore fail even if reading and assigning that property separately are supported.
- The formatter ignores the optional name supplied by some emission sites, so the public message is always just `Variable Expected`. Use the reported row/column to identify the expression.
- A `for` counter must be writable storage and must also have a supported counter type. The two requirements produce different diagnostics.
- An assignment to a read-only or read from a write-only registered property produces the more specific property diagnostic.
- This is a compile-time error; the attempted write or call does not occur.

## Related reference

- `Type mismatch` - storage exists, but its type is incompatible.
- `Assignment (':=') expected` - a writable target was resolved but the assignment token is missing.
- `Read-only property` - a property has no registered setter.
- `Write-only property` - a property has no registered getter.

## External references

- [Free Pascal: Variable parameters](https://www.freepascal.org/docs-html/ref/refsu65.html)
- [Embarcadero DocWiki: E2036 Variable required](https://docwiki.embarcadero.com/RADStudio/Florence/en/E2036_Variable_required_%28Delphi%29)
- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)

The Embarcadero E2036 page describes the address-of form of the same storage requirement. Velox uses one broader PascalScript diagnostic for the additional variable-only contexts listed above.
