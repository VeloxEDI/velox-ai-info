---
title: Functions
description: How to call registered functions and procedures and interpret their declarations in Velox scripts.
sidebar_position: 6
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - functions
  - procedures
  - parameters
---

Velox scripts can call only the routines registered with the embedded compiler. The Functions tree is the exact public inventory. A similarly named Delphi routine or overload is unavailable unless its declaration is registered.

## Reading a declaration

```Delphi
function StrToIntDef(S: string; Def: LongInt): LongInt;
```

- `function` means the call produces a result; a `procedure` has no direct result.
- `S` and `Def` are value parameters in call order.
- The final `LongInt` is the result type. In the current Windows runtime it is a signed 32-bit integer.

Call it as:

```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := StrToIntDef(Trim(VarToStr(Value)), 0);
end;
```

This source-reviewed example matches the exact PascalScript registration and preserves a deterministic fallback.

## Parameter modes

| Mode | Script obligation | Effect |
|---|---|---|
| value (no keyword) | Pass an assignment-compatible expression | Routine receives a value; assigning its parameter does not replace the caller variable |
| `const` | Pass a compatible expression | Routine treats the parameter as input; objects referenced by it can still be mutable |
| `var` | Pass an assignable variable of the exact registered type | Routine reads/writes the caller's storage |
| `out` | Pass an assignable variable of the exact type | Routine supplies output; do not rely on its earlier value |

Open-array declarations accept bracketed values only when the registered PascalScript signature supports that form. Default parameters and overload selection are limited to the exposed declaration; do not extrapolate from current Delphi documentation.

## Implementation and errors

A registered routine can point directly to Velox code, a PascalScript runtime helper, a shipped third-party routine or a wrapper around Delphi RTL/VCL. The entry page traces the exact path. This matters because a one-line wrapper can still inherit platform, locale, encoding, exception, allocation or thread-safety behaviour from its terminal call.

The compiler reports unknown identifiers, parameter-count mismatches and type mismatches before execution. Runtime routines can return sentinels, log and swallow an error, or raise an exception. Read the entry's Returns and Errors blocks; do not assume a Boolean result always means the same thing.

## Common mistakes

- Passing a literal or expression to `var`/`out`; these modes need caller storage.
- Using named Delphi overloads that are not registered.
- Ignoring ownership of an object returned by a function.
- Treating an empty/zero result as failure when the function has a separate error mechanism—or treating a sentinel as valid data.
- Assuming a procedure is side-effect free because it has no return value.

## Edge cases and quirks

- Names are case-insensitive, but entry pages preserve public casing for readability and searching.
- PascalScript performs its own overload/type matching; it is not necessarily identical to the current Delphi compiler.
- A `const` object reference prevents replacement of the parameter, not mutation of the referenced object's properties.
- Variant parameters defer some type errors until runtime.

## Related reference

- **Functions** (top-level group) — exact callable entries.
- **Types** — registered parameter and result types.
- **Testing values** — safe Variant inputs.
- **Compilation errors** — call-site diagnostics.

## External references

- [Free Pascal: Using functions and procedures](https://www.freepascal.org/docs-html/ref/refch14.html)
- [Embarcadero DocWiki: Calling Procedures and Functions (Delphi)](https://docwiki.embarcadero.com/RADStudio/Athens/en/Calling_Procedures_and_Functions_%28Delphi%29)
