---
title: "String Expected"
description: "The interface-GUID and external-routine declaration points where Velox requires a string literal token."
sidebar_position: 38
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - compilation
  - strings
  - interfaces
---

Velox reports `String Expected` at exactly two current compiler sites: the GUID clause of an interface declaration and the library/name argument of an `external` routine declaration. The parser found a valid token, but not a single-quoted string token.

## Interface example

```Delphi
type
  IExample = interface(IInterface)
    [11111111-1111-1111-1111-111111111111] // Error: String Expected
  end;
```

Quote the complete GUID text inside the brackets:

```Delphi
type
  IExample = interface(IInterface)
    ['{11111111-1111-1111-1111-111111111111}']
  end;
```

The GUID is fictional. After accepting the token, Velox still validates its text through Delphi's `StringToGUID`; quoting malformed GUID text therefore produces a different custom error.

## External declaration context

The other parser shape is:

```Delphi
function ImportedRoutine(...): ResultType; external 'LibraryOrBinding';
```

The standard Velox engine installs the shipped DLL external-procedure plugin on Windows. External calls can load native code, are architecture-dependent and can have arbitrary side effects, so this diagnostics page deliberately does not provide a runnable DLL-call example. Use only declarations and native libraries approved for the deployment environment.

## How Velox detects it

- In an interface type, the parser has already accepted `interface(Ancestor)[` and requires token `CSTI_String` before GUID conversion.
- In a routine declaration, it has accepted the header, semicolon and `external` keyword and then requires `CSTI_String` before invoking the host's external-procedure resolver.

Neither branch accepts an identifier, double-quoted value or computed expression.

## Correction procedure

1. Identify whether the source is declaring an interface or an external routine.
2. Use a single-quoted literal in the exact grammar position.
3. For a GUID, retain the braces and canonical hexadecimal grouping inside the string.
4. For an external routine, confirm deployment approval, architecture, calling convention, library availability and exact exported name before use.
5. Resolve any following conversion, resolver or semicolon error separately.

## Edge cases and quirks

- `String error` means the literal itself is unclosed; `String Expected` means another token was found where a complete literal was required.
- The external resolver is host/platform functionality, not evidence that every Delphi `external` declaration or library is safe or available in Velox Service and Velox API Service contexts.
- Interface syntax in this PascalScript compiler requires an explicit ancestor and GUID sequence that can be stricter than general Delphi interface syntax.

## Related reference

- `Opening square brackets ('[') expected` - the interface GUID clause did not begin.
- `String error` - a quoted token was started but not closed.
- `Semicolon (';') expected` - an external routine declaration boundary is incomplete.

## External references

- [Free Pascal: Interface identification - a GUID](https://www.freepascal.org/docs-html/ref/refse45.html)
- [Free Pascal: Using functions and procedures](https://www.freepascal.org/docs-html/ref/refch14.html)
- [Embarcadero DocWiki: Object Interfaces (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Object_Interfaces_%28Delphi%29)
- [Embarcadero DocWiki: Procedures and Functions (Delphi)](https://docwiki.embarcadero.com/RADStudio/en/Procedures_and_Functions_%28Delphi%29)
