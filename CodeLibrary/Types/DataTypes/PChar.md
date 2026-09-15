---
title: PChar
description: Represents PascalScript's borrowed NUL-terminated ANSI character pointer rather than a managed Unicode String.
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, pchar, pointer, ansi, nul-terminated, lifetime]
---

```Delphi
PChar
```

### Example

```Delphi
procedure AcceptLegacyText(TextPointer: PChar);
begin
  // Pass through only to an API that documents this borrowed pointer.
end;
```

### Usage

`PChar` represents Velox scripting's borrowed NUL-terminated ANSI character pointer rather than a managed Unicode String.

### Additional Technical Info
The current PascalScript compiler registers public PChar as `btPChar`, backed internally by `PAnsiChar` on modern Delphi. It points to a NUL-terminated sequence of 8-bit characters.

This differs from native modern Delphi's Unicode PChar (`PWideChar`) and from managed [`String`](String.md). Non-ASCII conversion can use an ANSI code page, and an embedded zero byte terminates C-style text early.

PChar has no ownership or length metadata. Treat any value supplied by an API as borrowed and valid only for the documented call/lifetime. Do not retain it after its source String/buffer changes, return it across execution boundaries, free it, or write through it unless the API explicitly provides a writable buffer of known capacity.

Prefer String for script text. PChar exists for legacy/native interop and is unsafe as a general data structure. For binary data, use Byte arrays or streams with explicit lengths; PChar cannot safely represent arbitrary zeros or boundaries.

No pointer dereference/allocation example is provided because the safe operation depends entirely on the originating API. This page is source-reviewed only; no pointer was tested.

**External references**

- [Embarcadero null-terminated strings](https://docwiki.embarcadero.com/RADStudio/en/Null-Terminated_Strings) - native pointer-string model; note Velox's ANSI backing.
- [Free Pascal PChar](https://www.freepascal.org/docs-html/ref/refsu13.html) - compatible pointer-string and lifetime concepts.

<small>Created 2026-07-15</small>
