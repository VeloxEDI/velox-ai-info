---
title: "Unknown identifier"
description: "Why a name cannot be resolved in the current Velox script scope or registered Code Library surface."
sidebar_position: 45
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - identifiers
  - scope
  - code-library
---

Velox reports `Unknown identifier '<name>'` when the compiler needs a declared value, routine, member, label or registered symbol but cannot resolve the supplied name in the current context.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  CustomerCode: string;
begin
  CustomerCode := 'CUST-001';
  Value := CustomerID; // Error: Unknown identifier 'CustomerID'
end;
```

Use the declared name, or declare the intended value before it is used:

```Delphi
procedure ScriptEvent(var Value: Variant);
var
  CustomerCode: string;
begin
  CustomerCode := 'CUST-001';
  Value := CustomerCode;
end;
```

## What Velox resolves

The diagnostic is shared by several lookup paths:

- local variables, routine variables and the function `Result`;
- global script variables, registered Velox variables and constants;
- procedures, functions and exposed overloads;
- type names used as class/static references in an expression;
- record fields, class members, interface members and chained member access;
- labels referenced by `goto`;
- registered attribute types; and
- internal string/index helpers required by the embedded compiler.

The main identifier resolver checks the current routine and global compiler tables, then registered types, routines and constants as appropriate. Member lookup continues against the resolved record, class, external class or interface type. A name that exists elsewhere is not enough: it must be visible in the current script scope and exposed through the scripting registration used by this compilation.

## Correction procedure

1. Read the name from the full parameterised message. If the message contains an empty name, inspect the highlighted token and the first earlier diagnostic.
2. Check spelling and word boundaries. Identifiers are case-insensitive, so changing only letter case is not normally a correction.
3. Confirm that the declaration occurs before use and in a scope visible at that point.
4. For a Code Library entry, confirm that the function, variable, class or member is exposed in the current product version and module context.
5. For member access, verify the type of the expression before the period and check that the member belongs to that type.
6. For included source, confirm the required include is present and compiled before the reference.
7. Recompile after fixing the first unresolved name; later messages may be consequences.

## Edge cases and quirks

- Identifier lookup is case-insensitive: the compiler normalises names and also stores a hash for lookup. `CustomerCode` and `customercode` refer to the same declaration.
- A syntactically invalid name produces `Identifier expected`; this diagnostic means a valid identifier token was read but lookup failed.
- A name used specifically where a type declaration is required usually produces `Unknown type`. Some internal type-reading branches use `Unknown identifier`, so the highlighted declaration remains important.
- A record field or class member can be unknown even when the base object is valid. Check the base type rather than declaring a new global with the same member name.
- Missing embedded helpers for string or `Variant` indexing are reported as `Unknown identifier 'StrGet'` or `'StrSet'`. Those helper names are compiler-host registrations, not names the script should declare. Preserve the full message and escalate a repeatable occurrence.
- Some compiler paths supply an empty parameter, producing `Unknown identifier ''`. Treat this as limited diagnostic detail, not as proof that the source contains a blank name.
- A Delphi or Free Pascal RTL name is not automatically available. The Velox Code Library and current scripting imports define the public script surface.

## Related reference

- `Identifier expected` - no valid identifier token appears where a name is required.
- `Unknown type` - a required type name cannot be resolved.
- `Unknown Property` - host setup nominated a default property that was never registered.
- `Syntax error` - the token sequence does not fit the supported grammar.

## External references

- [Free Pascal: Identifiers](https://www.freepascal.org/docs-html/ref/refse4.html)
- [Free Pascal: Scope](https://www.freepascal.org/docs-html/ref/refse116.html)
- [Embarcadero DocWiki: E2003 Undeclared identifier](https://docwiki.embarcadero.com/RADStudio/Athens/en/E2003_Undeclared_identifier_%27%25s%27_%28Delphi%29)
