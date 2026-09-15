---
title: NativeInt
description: "Stores a signed integer whose width follows the running Velox executable: 32-bit on Win32 and 64-bit on Win64."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, nativeint, signed, pointer-sized, architecture]
---

```Delphi
NativeInt
```

### Example

```Delphi
procedure CopyNative(Value: NativeInt; var ResultValue: NativeInt);
begin
  ResultValue := Value;
end;
```

### Usage

`NativeInt` stores a signed integer whose width follows the running Velox executable: 32-bit on Win32 and 64-bit on Win64.

### Additional Technical Info
`NativeInt` is selected when PascalScript defines its standard types. The compiler initializes `ExecIs64Bit` from the CPU architecture of the hosting Velox executable, then registers NativeInt as signed 32-bit (`btS32`) for Win32 or signed 64-bit (`btS64`) for Win64.

Use it only for native pointer-sized API values such as handles, tags, sizes or offsets whose declaration genuinely follows process architecture. Do not use it for persistent configuration, database columns, files, hashes, messages or API schemas because the range changes between executables.

When data crosses Designer, Service, API Service or another process, do not assume both sides use the same architecture. Convert to an explicitly ranged [`Integer`](Integer.md) or [`Int64`](Int64.md) after validating the source value.

NativeInt is an integer, not an owning pointer. A numeric value that originated from a pointer/handle remains subject to the producing API's lifetime and must not be guessed, serialized or dereferenced through ordinary script operations.

The example is source-reviewed only; no native value was copied at runtime.

**External references**

- [Embarcadero NativeInt](https://docwiki.embarcadero.com/Libraries/Athens/en/System.NativeInt) - native Delphi pointer-sized signed type.
- [Free Pascal NativeInt](https://www.freepascal.org/docs-html/rtl/system/nativeint.html) - compatible architecture-dependent reference.

<small>Created 2026-07-15</small>
