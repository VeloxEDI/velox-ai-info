---
title: "Opening square brackets ('[') expected"
description: "Why the Velox PascalScript interface parser requires an opening bracket before its GUID string."
sidebar_position: 32
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - interfaces
  - guid
---

In the current Velox compiler, `Opening square brackets ('[') expected` has one emission site: an interface type declaration has completed `interface(AncestorInterface)` and must begin its GUID clause.

## Example

```Delphi
type
  IExample = interface(IInterface)
    '{11111111-1111-1111-1111-111111111111}' // Error: opening [ expected
  end;
```

Put the single-quoted GUID inside square brackets:

```Delphi
type
  IExample = interface(IInterface)
    ['{11111111-1111-1111-1111-111111111111}']
  end;
```

The GUID above is fictional and used only as a syntax example.

## How Velox detects it

The modified PascalScript type parser performs these checks in sequence:

1. `interface` must be followed by `(AncestorInterface)`.
2. The next token must be `[`.
3. The next token must be a string literal containing the GUID text.
4. The GUID is converted to a Delphi `TGUID`.
5. The parser requires the closing `]` before interface members.

Failure at step 2 emits `ecOpenBlockExpected`. An invalid string value reaches the Delphi GUID conversion and produces that conversion exception as a custom compiler error instead.

## Edge cases and quirks

- This message is not emitted for an array/index expression missing `[`. Those grammar paths usually produce another expression or parameter diagnostic.
- The brackets are required by the current compiled path unless the PascalScript library is built with `PS_NOINTERFACEGUIDBRACKETS`; the current Velox project configuration does not define that symbol.
- Delphi can declare some non-COM interfaces without an explicit ancestor or GUID. This embedded parser path is stricter and requires both.
- Interface declarations are an advanced compiler feature; most Velox scripts consume registered class/interface types rather than declare new ones.

## Related reference

- `String Expected` - the opening bracket exists but the GUID string token does not.
- `Closing square bracket (']') expected` - the GUID clause is not closed.
- `Opening parenthesis ('(') expected` - the interface ancestor clause is missing.

## External references

- [Free Pascal: Interface identification - a GUID](https://www.freepascal.org/docs-html/ref/refse45.html)
- [Embarcadero DocWiki: Object Interfaces (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Object_Interfaces_%28Delphi%29)
