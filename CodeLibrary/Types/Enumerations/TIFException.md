---
title: TIFException
description: Identifies the PascalScript virtual-machine error category returned, raised and formatted by exception helper functions.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords: [velox, scripting, enumeration, exception, runtime, vm, error]
---

```Delphi
TIFException = (ErNoError, erCannotImport, erInvalidType, ErInternalError, erInvalidHeader, erInvalidOpcode, erInvalidOpcodeParameter, erNoMainProc, erOutOfGlobalVarsRange, erOutOfProcRange, ErOutOfRange, erOutOfStackRange, ErTypeMismatch, erUnexpectedEof, erVersionError, ErDivideByZero, ErMathError, erCouldNotCallProc, erOutofRecordRange, erOutOfMemory, erException, erNullPointerException, erNullVariantError, erInterfaceNotSupported, erCustomError)
```

### Example

**Exception API reference only — not a recommended generated-script failure pattern.** These APIs remain documented accurately. Generated Velox scripts must use [LogError with explicit stop/propagation](../../../instructions/scripts/failure-handling.md).

```Delphi velox-role="api-reference" reason="Demonstrates exception API semantics; not a generated-script recommendation"
procedure ReRaiseLastScriptError;
var
  E: TIFException;
begin
  E := ExceptionType;
  if E <> ErNoError then
    RaiseException(E, ExceptionParam);
end;
```

### Usage

`TIFException` identifies the Velox scripting error category returned, raised and formatted by exception helper functions.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| `ErNoError` | 0 | No stored Velox scripting runtime error. |
| `erCannotImport` | 1 | A requested external function/class/member could not be imported; the parameter names it. |
| `erInvalidType` | 2 | value type metadata or an operand type is invalid. |
| `ErInternalError` | 3 | Velox script-engine consistency failure. |
| `erInvalidHeader` | 4 | Compiled-script header is invalid. |
| `erInvalidOpcode` | 5 | Bytecode contains an unsupported/invalid opcode. |
| `erInvalidOpcodeParameter` | 6 | An opcode operand is invalid. |
| `erNoMainProc` | 7 | The compiled script has no executable main procedure. |
| `erOutOfGlobalVarsRange` | 8 | Global-variable index is outside the compiled range. |
| `erOutOfProcRange` | 9 | Procedure index is outside the compiled range. |
| `ErOutOfRange` | 10 | General range check failed. |
| `erOutOfStackRange` | 11 | Stack access is outside the current stack range. |
| `ErTypeMismatch` | 12 | Runtime values/types are incompatible. |
| `erUnexpectedEof` | 13 | Compiled data ended before the expected structure was complete. |
| `erVersionError` | 14 | Compiled data version is incompatible with the runtime. |
| `ErDivideByZero` | 15 | Integer or floating division attempted with a zero divisor. |
| `ErMathError` | 16 | Other arithmetic/math error. |
| `erCouldNotCallProc` | 17 | The VM could not invoke a procedure; a non-empty parameter is appended in parentheses. |
| `erOutofRecordRange` | 18 | Record-field access is outside the record layout. |
| `erOutOfMemory` | 19 | The VM or host allocation failed. |
| `erException` | 20 | A captured host/script exception; formatter inserts the parameter into the exception message. |
| `erNullPointerException` | 21 | A nil object/pointer was dereferenced. |
| `erNullVariantError` | 22 | An invalid Null Variant operation occurred. |
| `erInterfaceNotSupported` | 23 | The requested interface is unavailable. |
| `erCustomError` | 24 | Custom error; `ExceptionToString` returns the parameter verbatim. |

#### Behavior and boundaries

- `ExceptionType` returns the last stored VM error category. Read the associated parameter, procedure and position before another error overwrites them.
- `RaiseException` raises the selected category with the supplied parameter. Use a member whose formatted message expects the parameter you provide.
- `erCustomError` exposes its parameter directly as message text; do not place secrets in it when logs or user-visible error channels may record the result.
- Invalid header, opcode or version errors normally indicate incompatible or damaged compiled script data, not a recoverable business validation failure.
- Do not persist ordinal values across Velox scripting runtime versions. Store the member name and captured human-readable message.

### Additional Technical Info
`TIFException` is the script-visible declaration of the PascalScript runtime's `TPSError`. It is used by `ExceptionType`, `RaiseException` and `ExceptionToString`; it is not the Delphi class of the caught exception.

The generated Code Library index stores only 300 declaration characters and ends at `ErMathError`. Product source registers the complete 25-member declaration shown above.

**Related Code Library entries**

- [ExceptionType](../../Functions/Exceptions/ExceptionType.md) - read the last VM error category.
- [ExceptionParam](../../Functions/Exceptions/ExceptionParam.md) - read its associated parameter.
- [ExceptionProc](../../Functions/Exceptions/ExceptionProc.md) - read the compiled procedure number.
- [ExceptionPos](../../Functions/Exceptions/ExceptionPos.md) - read the instruction position.
- [ExceptionToString](../../Functions/Exceptions/ExceptionToString.md) - format a category and parameter.
- [RaiseException](../../Functions/Exceptions/RaiseException.md) - raise a selected VM error.

**External references**

- [RemObjects PascalScript source](https://github.com/remobjects/pascalscript) - upstream compiler/runtime project.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration concepts.

<small>Created 2026-07-15</small>
