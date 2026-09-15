---
title: "Period ('.') expected"
description: "The range, member, default-property and source-termination contexts behind Velox's period diagnostic."
sidebar_position: 33
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - period
  - ranges
---

`Period ('.') expected` is shared by several parser contexts. It can mean a literal `.` member separator, the two-character range token `..`, or the final period after an explicit program/unit-style `end`. Inspect the surrounding construct before inserting punctuation.

## Example

This static array range is missing `..`:

```Delphi
type
  TValues = array[1 10] of Integer; // Error: Period ('.') expected
```

Correct the range token:

```Delphi
type
  TValues = array[1..10] of Integer;
```

## Exact emission families

- A static-array lower bound is not followed by `..`.
- `Object[Index]` is used on a class that has no registered default indexed property. The compiler reports period because it expected an explicitly named member such as `Object.Items[Index]`.
- An identifier has resolved to a type name, is not being used as a cast, and is not followed by the period required by the compiler's static external-class member path.
- An explicit main program, unit initialisation/finalisation block or accepted `end`-only source ends with `;` or another token instead of `.`.

Velox enables `icAllowNoBegin` and `icAllowNoEnd`, so ordinary event scripts made only of procedure declarations do not need an artificial outer `begin..end.` block. The final-period branch matters only when that source form is present.

## Correction procedure

1. Determine whether the parser is reading a range, class/member expression, default property or final `end`.
2. Use `..` between a range's lower and upper bounds.
3. Use `.` before a named class member.
4. For `Object[Index]`, confirm the class actually exposes a default indexed property; otherwise name the intended property.
5. Use `end.` only for the outer program/unit-style termination, not a normal procedure body, which ends with `end;`.

## Edge cases and quirks

- The range branch expects one `CSTI_TwoDots` token even though the formatted message uses singular “Period”.
- Adding `.` before `[` does not repair a missing default property; a real member name must follow the period.
- The static-member path checks for `.` before checking that the resolved type is an external class. A different type name can therefore report `Period expected` first and `Class type expected` only after the punctuation is corrected.
- A decimal point inside a real literal is a different lexer token and does not substitute for `..`.
- The error location is the token found where the required period form should begin.

## Related reference

- `Not an array property` - a host import nominated a scalar property as the default.
- `Unknown Property` - the host default-property name is not registered.
- `Closing square bracket (']') expected` - an array range was opened but not closed.

## External references

- [Free Pascal: Symbols](https://www.freepascal.org/docs-html/ref/refse1.html)
- [Free Pascal: Programs, units and blocks](https://www.freepascal.org/docs-html/ref/refch16.html)
- [Embarcadero DocWiki: Programs and Units (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Programs_and_Units_%28Delphi%29)
