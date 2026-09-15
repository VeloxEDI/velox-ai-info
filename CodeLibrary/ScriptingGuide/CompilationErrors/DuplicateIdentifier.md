---
title: "Duplicate identifier"
description: "How duplicate names are detected across the current Velox script declaration scope."
sidebar_position: 14
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - identifiers
  - scope
---

Velox reports `Duplicate identifier '<name>'` when a script declaration attempts to introduce a name that already conflicts in the applicable declaration scope. The parameter in the formatted message identifies the conflicting name.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  ResultText: string;
  resulttext: string; // Error: Duplicate identifier 'resulttext'
begin
  Value := ResultText;
end;
```

Velox script identifiers are case-insensitive, so changing only letter case does not create a distinct name. Remove or rename one declaration:

```Delphi
var
  ResultText: string;
  DetailText: string;
```

## What can conflict

The modified PascalScript compiler performs duplicate checks while adding variables, constants, types, labels, procedures/functions, parameters, record members and other declarations. The exact comparison set depends on the current routine or source scope.

A local name may also conflict with another declaration whose role is not visually identical. For example, duplicate parameter names or two routines with an indistinguishable registered signature can fail even though the source lines use different declaration keywords.

## How Velox detects it

The parser normalises identifiers for lookup, including uppercase/case-insensitive comparisons, and emits `ecDuplicateIdentifier` with the name as its parameter when a declaration cannot be added. Velox displays the current declaration position.

The host compiler has specialised rules for registering built-in APIs, but those registration allowances do not mean a script may freely redeclare names. Treat Code Library names as reserved in contexts where the compiler resolves them against exposed globals, types or routines.

## Correction procedure

1. Use the name included in the error to search the complete script and included source.
2. Compare names without regard to case.
3. Check parameters, local declarations, nested routines, constants, types and labels in the owning scope.
4. Rename the declaration to communicate its distinct purpose, or remove the redundant declaration.
5. If the name belongs to the Code Library, use the registered item rather than shadowing it.

## Common causes

- Declaring the same variable twice.
- Treating `Name` and `NAME` as different identifiers.
- Giving a parameter and local variable the same name.
- Repeating a routine/type declaration in an included file.
- Choosing a name already registered as a Velox global or type.

## Related reference

- `Identifier expected` — valid positions for a declaration name.
- `Unknown identifier` — a name that cannot be resolved rather than one declared twice.
- `Includes` — declarations imported into the compiled source.

## External references

- [Embarcadero DocWiki: Declarations and Statements (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Declarations_and_Statements_%28Delphi%29)
