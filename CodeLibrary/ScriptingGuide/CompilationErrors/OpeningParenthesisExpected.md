---
title: "Opening parenthesis ('(') expected"
description: "The exact built-in, interface and attribute contexts where Velox requires an opening parenthesis."
sidebar_position: 31
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - parentheses
  - built-ins
---

Velox reports `Opening parenthesis ('(') expected` at a small set of explicit compiler grammar points. In the current compiler these are the built-ins `Ord`, `Chr`, `Succ`, `Pred` and `Assigned`, an interface ancestor declaration, and arguments for a host-registered attribute.

## Example

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Ord 'A'; // Error: Opening parenthesis ('(') expected
end;
```

Enclose the built-in argument:

```Delphi
Value := Ord('A');
```

## Exact emission families

| Context | Required shape |
|---|---|
| Ordinal conversion | `Ord(Expression)` |
| Character conversion | `Chr(Expression)` |
| Successor/predecessor | `Succ(Expression)` or `Pred(Expression)` |
| Assignment test | `Assigned(Identifier)` |
| PascalScript interface | `interface(AncestorInterface)` |
| Registered attribute | `AttributeName(ConstantArguments)` |

The interface shape is a PascalScript compiler rule. Unlike general Delphi syntax, this parser path requires an explicit ancestor in parentheses before the GUID brackets.

## How Velox detects it

Each listed parser branch consumes the keyword or registered attribute name and immediately checks for token `CSTI_OpenRound`. A different next token emits `ecOpenRoundExpected` before argument or type checking begins.

Ordinary registered function calls use the general call/parameter parser and can report `Invalid number of parameters`, `Comma expected` or another expression diagnostic instead. This page should not be treated as a catalogue of every possible missing `(`.

## Correction procedure

1. Identify the exact construct immediately before the reported token.
2. Insert `(` after the built-in, interface keyword or registered attribute name.
3. Balance it with the corresponding `)` and validate the enclosed expression or ancestor.
4. If this is an ordinary registered routine, inspect its own declaration instead of assuming this diagnostic family applies.

## Edge cases and quirks

- `Assigned` reads an identifier-oriented operand in this implementation; a complex calculation can fail after the parenthesis is fixed.
- `Ord`, `Chr`, `Succ` and `Pred` perform separate type checks after parsing the opening delimiter.
- Attribute syntax exists in the compiler, but the standard Velox host currently registers no attribute types, so that emission path is not normally reachable in product scripts.
- The reported token is the item found instead of `(`, not necessarily the first malformed token in a larger expression.

## Related reference

- `Closing parenthesis expected` - the construct opened correctly but was not closed.
- `Invalid number of parameters` - a normal callable has the wrong actual argument count.
- `Class type expected` - an interface/class-related expression has the wrong resolved type.

## External references

- [Free Pascal: Function calls](https://www.freepascal.org/docs-html/ref/refse82.html)
- [Embarcadero DocWiki: Object Interfaces (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Object_Interfaces_%28Delphi%29)
