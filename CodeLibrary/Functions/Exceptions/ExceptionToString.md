---
title: "ExceptionToString"
description: "Formats a PascalScript exception type and parameter as the runtime's display text."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - exceptions
  - formatting
  - diagnostics
---

```Delphi
function ExceptionToString(er: TIFException; Param: string): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := ExceptionToString(erCannotImport, 'FictionalModule');
  // Result: 'Cannot Import FictionalModule'
end;
```

### Usage

`ExceptionToString` formats a Velox scripting exception type and parameter as the runtime's display text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `er` | `TIFException` | VM exception category to format. It need not be the value returned by the current [`ExceptionType`](ExceptionType.md). |
| `Param` | `string` | Associated text. Only `erCannotImport`, `erCouldNotCallProc`, `erException` and `erCustomError` use it in their result. |

**Returns**

The runtime uses these exact mappings:

| `er` | Result |
|---|---|
| `ErNoError` | `No Error` |
| `erCannotImport` | `Cannot Import ` followed by the safe prefix of `Param` |
| `erInvalidType` | `Invalid Type` |
| `ErInternalError` | `Internal error` |
| `erInvalidHeader` | `Invalid Header` |
| `erInvalidOpcode` | `Invalid Opcode` |
| `erInvalidOpcodeParameter` | `Invalid Opcode Parameter` |
| `erNoMainProc` | `no Main Proc` |
| `erOutOfGlobalVarsRange` | `Out of Global Vars range` |
| `erOutOfProcRange` | `Out of Proc Range` |
| `ErOutOfRange` | `Out Of Range` |
| `erOutOfStackRange` | `Out Of Stack Range` |
| `ErTypeMismatch` | `Type Mismatch` |
| `erUnexpectedEof` | `Unexpected End Of File` |
| `erVersionError` | `Version error` |
| `ErDivideByZero` | `divide by Zero` |
| `ErMathError` | `Math error` |
| `erCouldNotCallProc` | `Could not call proc`, followed by ` (` + `Param` + `)` only when `Param` is non-empty |
| `erOutofRecordRange` | `Out of Record Fields Range` |
| `erOutOfMemory` | `Out Of Memory` |
| `erException` | `Exception: ` followed by `Param` |
| `erNullPointerException` | `Null Pointer Exception` |
| `erNullVariantError` | `Null variant error` |
| `erInterfaceNotSupported` | `Interface not supported` |
| `erCustomError` | `Param` unchanged after the runtime string conversion |

An ordinal outside the runtime's recognised `TPSError` cases falls through to `Unknown error`, although normal typed script calls should supply a defined `TIFException` value.

**Usage notes**

For the current caught exception, use `ExceptionToString(ExceptionType, ExceptionParam)`. Review the resulting text before sending it outside Velox because the parameter can include values from a failed operation.

### Additional Technical Info
`ExceptionToString` converts a PascalScript `TIFException` value and its associated parameter into the display text defined by the current script runtime. It is a pure formatter: it does not read, raise, clear or otherwise change the current exception.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The compiler and runtime register this as built-in dispatch 36. The adapter converts `er` to the runtime `TPSError` enumeration, converts `Param` through PascalScript's ANSI-string path, calls `PSErrorToString`, then writes the resulting ANSI text back to the declared script `string`.

Most cases return a fixed resource string. `erCannotImport` and `erException` use the two-argument Delphi `System.SysUtils.Format` overload with a fixed `%s` template. `erCouldNotCallProc` concatenates its optional parenthesised parameter, while `erCustomError` returns the parameter directly.

**Behaviour**

- Fixed-text cases ignore `Param`, including a non-empty value.
- `erCannotImport` first applies the runtime's `SafeStr` helper. It truncates `Param` immediately before the first control character in the range `#0` through `#31`.
- `erException` does not apply `SafeStr`; it prefixes the converted parameter with `Exception: `.
- `erCustomError` adds no label or punctuation. An empty parameter therefore produces `''`.
- The function is deterministic for a given runtime build, exception value, ANSI code page and input text.

**Edge cases and quirks**

- Capitalisation in the result is inherited from PascalScript's resource strings and is intentionally inconsistent, for example `Internal error`, `no Main Proc` and `divide by Zero`.
- The current compiler declares script `string` as Unicode, but this dispatch explicitly reads and writes an `AnsiString`. Characters outside the active ANSI code page may be changed before formatting or on return.
- Although Delphi `Format` has a global-format-settings overload, these two branches use only `%s`. Their result has no number, date or locale-specific formatting.
- Free Pascal's `Format` page describes a compatible placeholder concept but is not evidence for the PascalScript exception mapping, resource text, `SafeStr` truncation or ANSI conversion.
- Formatting arbitrary `er`/`Param` arguments does not prove that such an exception occurred and does not consult the active handler.

**Side effects**

None beyond temporary string allocation and ANSI/Unicode conversion.

**Errors**

Allocation or string-conversion failures can propagate. The fixed internal format templates and matching single string arguments do not expose a user-controlled format-string error path.

**Performance and concurrency**

Work is linear in the parameter/result length. The formatter uses no mutable Velox state. The Delphi `Format` call uses the overload without explicit format settings, but its fixed string-only template does not consume locale-sensitive numeric fields.

**Related entries**

- [`ExceptionType`](ExceptionType.md) returns the current VM exception category.
- [`ExceptionParam`](ExceptionParam.md) returns its associated text.
- [`RaiseException`](RaiseException.md) creates an explicit type/parameter pair.
- [`try..except`](../../ScriptingGuide/Statements/tryexcept.md) explains the handler in which current exception state is available.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.Format`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Format) - the exact Delphi core formatter used for the two `%s` resource-template branches.
- [Free Pascal: `SysUtils.Format`](https://www.freepascal.org/docs-html/rtl/sysutils/format.html) - compatibility context for placeholder formatting; it does not define Velox/PascalScript exception mappings.

<small>Created 2026-07-15</small>
