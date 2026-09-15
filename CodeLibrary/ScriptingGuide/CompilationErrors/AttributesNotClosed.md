---
title: "Attributes not closed"
description: "Cause and correction of an unterminated PascalScript attribute list."
sidebar_position: 2
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - attributes
---

This compiler error means an attribute list began with `[` but did not finish with the expected `]`. It belongs to the underlying PascalScript attribute grammar, not to the square-bracket syntax used for array indexes or set values.

## Expected form

Where a host has registered an attribute type, the compiler expects a structure equivalent to:

```Delphi
[AttributeName(Argument1, Argument2)]
```

Each recognised attribute name must be followed by parenthesised arguments, and the complete list must end with `]`.

## Example

The following illustrates the parser condition, but it is not a normal Velox scripting feature:

```Delphi
[ExampleAttribute('value')
procedure DoWork;
begin
end;
```

The structural correction is:

```Delphi
[ExampleAttribute('value')]
procedure DoWork;
begin
end;
```

## Current Velox availability

The current Velox product source does not register any PascalScript attribute types. The compiler's `ReadAttributes` implementation and the `Attributes not closed` message remain present, but ordinary Velox scripts should encounter an unknown or unexpected identifier before this final unclosed-list check can be useful.

This makes the diagnostic effectively unreachable through the current standard Velox scripting surface. It may become relevant if a future Velox version registers attribute types, or if a custom host built from the same compiler adds them.

## How the compiler detects it

The modified PascalScript compiler uses `[` and `]` as its configured attribute delimiters. `ReadAttributes` reads each known attribute, requires `(` and `)` around its argument list, and finally checks for `]`. Failure of that final check emits `ecUnClosedAttributes`.

Velox formats compiler messages with module, row and column details. Because the error is raised only when the final delimiter check fails, the displayed position can be the following declaration token rather than the opening bracket.

## If this message appears

1. Retain the full formatted message, script text and Velox version.
2. Check for a preceding `[` that has no corresponding `]`.
3. Confirm that the content is really intended as an attribute. Array indexes and set constructors use different compiler paths and normally report `Closing square bracket (']') expected`.
4. If no registered attribute feature is in use, treat the message as evidence of a version-specific or customised compiler and escalate it with a minimal reproduction.

## Related reference

- `Closing square bracket (']') expected` — array, set and indexed-expression brackets.
- `Identifier expected` — malformed attribute and declaration names.
- `Internal error` — evidence to retain for compiler conditions that cannot be explained by supported syntax.

## External references

No Free Pascal or Embarcadero language page is linked because this diagnostic concerns the embedded compiler's host-registered attribute mechanism, which is not exposed by the current Velox product.
