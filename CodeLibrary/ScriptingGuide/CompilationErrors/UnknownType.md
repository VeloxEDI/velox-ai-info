---
title: "Unknown type"
description: "Why a declared or referenced type name is unavailable to the Velox compiler."
sidebar_position: 47
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - types
  - declarations
  - code-library
---

Velox reports `Unknown type '<name>'` when a declaration requires a type but the compiler cannot find that type in the current script declarations or registered scripting type table.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Count: TWholeNumber; // Error: Unknown type 'TWholeNumber'
begin
  Value := Count;
end;
```

Use a type that is declared or exposed to Velox scripting:

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Count: Integer;
begin
  Count := 3;
  Value := Count;
end;
```

## Where Velox resolves types

The current compiler emits this diagnostic while parsing:

- procedure/function parameter and result declarations, including registration declaration strings;
- array element types and other compound declarations;
- ordinary aliases, variables, fields and type references;
- an interface's nominated ancestor type; and
- general type expressions handled by the compiler's type reader.

Script declarations and host registrations both use the compiler's type table. A Delphi class or RTL type existing in the product executable is not automatically script-visible; it must be registered by the current Velox scripting imports or declared by supported script syntax.

## Correction procedure

1. Read the missing type name from the full message and inspect the highlighted declaration.
2. Check spelling. Type identifiers are case-insensitive, so changing only letter case is not normally sufficient.
3. Confirm that a script-defined type is declared before the declaration that uses it and remains in scope.
4. Confirm that a product type appears in the current Code Library or is otherwise explicitly registered for the relevant compiler context.
5. Check included source order if the type is declared in an include.
6. If the error names a type from a generated/host declaration rather than user source, retain the complete compile output and escalate the import-registration mismatch.

## Edge cases and quirks

- `Unknown type` means lookup found no type. `Type mismatch` means the compiler resolved types but they are not compatible with the requested operation.
- A same-named variable, routine or constant is not a substitute for a type. Delphi may describe that case as “not a type identifier”; Velox often reports the same practical fault as `Unknown type`.
- Interface inheritance first resolves the nominated ancestor and then verifies that its base type is an interface. A missing ancestor produces `Unknown type`; an existing non-interface produces `Type mismatch`.
- Host method-registration declarations are parsed from text and can emit this message when an import names a type it did not register. That is a product/import issue rather than a type the script can safely invent.
- Custom parser paths can record the current token while normal source paths often record the original token. The name can therefore be a detection token after an earlier malformed declaration.
- The public Free Pascal and Delphi type catalogues include types that Velox does not expose. Current Velox registrations remain authoritative.

## Related reference

- `Unknown identifier` - a value, routine, member or other name cannot be resolved.
- `Type mismatch` - known types are incompatible.
- `Identifier expected` - the declaration does not contain a valid name token.

## External references

- [Free Pascal: Types](https://www.freepascal.org/docs-html/ref/refch3.html)
- [Embarcadero DocWiki: Data Types, Variables, and Constants Index (Delphi)](https://docwiki.embarcadero.com/RADStudio/Alexandria/en/Data_Types%2C_Variables%2C_and_Constants_Index_%28Delphi%29)
- [Embarcadero DocWiki: E2005 is not a type identifier](https://docwiki.embarcadero.com/RADStudio/Sydney/en/E2005_%27%25s%27_is_not_a_type_identifier_%28Delphi%29)
