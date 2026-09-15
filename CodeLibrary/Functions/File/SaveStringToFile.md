---
title: "SaveStringToFile"
description: "Unsafe in the current Velox version. Do not call this function; use an encoding-specific file writer instead."
sidebar_position: 44
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - text
  - encoding
  - unavailable
---

```Delphi
Procedure SaveStringToFile( const aContents, aFileName : string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Current supported Windows-default equivalent.
  SaveStringToFileANSI('Fictional payload',
    'C:\Fictional\Outbound\message.txt');
end;
```

### Usage

`SaveStringToFile` is unsafe in the current Velox version and must not be called. It can fail or leave the script in an invalid state instead of writing the file reliably.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aContents` | `string`, `const` | Intended text content. |
| `aFileName` | `string`, `const` | Intended destination path. |

**Returns**

This procedure has no return value.

**Errors**

A call can fail outside normal Velox scripting error handling. Do not use `try..except` as a safety mechanism around this entry.

**Usage notes**

Use `SaveStringToFileANSI`, `SaveStringToFileASCII`, `SaveStringToFileUTF8`, `SaveStringToFileUTF16` or `SaveStringToFileUTF16BE` according to the required file encoding.

### Additional Technical Info
`SaveStringToFile` is declared to scripts as a procedure, but its current runtime registration points to an adapter declared as a Delphi function returning `string`. That signature mismatch is ABI-incompatible. Do not call `SaveStringToFile` from Velox scripting until the product adapter is corrected; use an explicit encoding-specific writer instead.

The example deliberately uses [`SaveStringToFileANSI`](SaveStringToFileANSI.md), the current Windows-default equivalent, rather than invoking the unsafe entry. It targets fictional data/path, is source-reviewed and was not executed by the documentation workflow.

**Implementation**

At compile time, `SIRegister_vxFiles` publishes `Procedure SaveStringToFile(...)`. At runtime, `RIRegister_vxFiles_Routines` resolves that name to `@SaveStringToFile_P`, whose actual declaration is `Function SaveStringToFile_P(...): string`. Its body calls the intended native overload but never assigns its own result.

PascalScript constructs the external invocation from the compiled procedure declaration and therefore supplies no result slot. The Delphi target expects storage for a managed-string result. This calling-contract mismatch can corrupt process state or fault at call time; safe execution of the intended body cannot be assumed.

If correctly registered as a procedure, the intended native overload would select `TEncoding.Default`, which is ANSI on the supported Windows runtime, then use the same destructive file writer as [`SaveStringToFileANSI`](SaveStringToFileANSI.md).

**Edge cases and quirks**

- The import name resolves, so this is not a compile-time or `Cannot Import` failure. The hazard occurs when the external call is made.
- There is no safe argument combination, including empty text, that removes the ABI mismatch.
- The native implementation's intended default is host ANSI, not UTF-8, and it emits no BOM.
- The intended writer also truncates before encoding and ignores the terminal `Write` count; fixing only the adapter would not fix those separate reliability limitations.
- If its intended Windows writer is reached, normal `CREATE_ALWAYS` handling follows a symbolic link and truncates the link target.

**Side effects**

Undefined at the script boundary because the call ABI is invalid. If control reaches the intended native body, it can create or replace the destination file.

**Performance and concurrency**

Not applicable while the entry is unsafe. The intended native writer performs a synchronous full-string encoding and direct non-atomic file replacement.

**Related entries**

- [`SaveStringToFileANSI`](SaveStringToFileANSI.md) is the current Windows `TEncoding.Default` equivalent.
- [`SaveStringToFileUTF8`](SaveStringToFileUTF8.md) is preferable for portable new text formats.
- [`LoadFileToString`](LoadFileToString.md) has BOM detection with ASCII fallback, not a symmetric default-encoding round trip.

**External references**

- [Embarcadero `TEncoding.Default`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.Default) and [`TEncoding.GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) - the intended native Windows-default encoding path; they do not make the current script adapter safe.
- [Free Pascal `TEncoding.Default`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.default.html) - compatible default-encoding context only; the ABI mismatch is specific to the Velox PascalScript registration and Delphi target.
- [Microsoft `CreateFileW`](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-createfilew) - the destructive Windows terminal the intended native writer would reach after an adapter fix.

<small>Created 2026-07-15</small>
