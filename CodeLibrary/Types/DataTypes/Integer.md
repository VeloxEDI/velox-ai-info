---
title: Integer
description: Stores PascalScript's fixed signed 32-bit LongInt-compatible value rather than a platform-native-width integer.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, integer, signed, 32-bit, longint]
---

```Delphi
Integer = LongInt
```

### Example

```Delphi
procedure Increment(var Count: Integer);
begin
  Count := Count + 1;
end;
```

### Usage

Stores Velox scripting's fixed signed 32-bit LongInt-compatible value rather than a platform-Velox-width integer.

### Additional Technical Info
`Integer` is a public copy of PascalScript's hidden `LongInt` base type (`btS32`). It is always signed 32-bit with range `-2,147,483,648..2,147,483,647`, including in Win64 Velox.

Use Integer for ordinary counts and APIs explicitly declared with Integer. Use [`Int64`](Int64.md) for larger stable values and [`NativeInt`](NativeInt.md) only for pointer-sized native contracts.

Validate array/list indexes before use: the type can represent negative values even when the API requires zero-based nonnegative indexes. Also validate counts/lengths before allocation or I/O.

Converting from Cardinal, Int64, UInt64, NativeInt, TDateTime serials or Variant can exceed the range. Do not assume an implicit conversion will safely clamp or reject it; validate first.

The example is source-reviewed only; no count was incremented.

**External references**

- [Embarcadero Integer types](https://docwiki.embarcadero.com/RADStudio/en/Integer_Types_(Delphi)) - current native Delphi widths; Velox's explicit LongInt alias fixes this script width.
- [Free Pascal integer types](https://www.freepascal.org/docs-html/ref/refsu5.html) - compatible signed integer reference.

<small>Created 2026-07-15</small>
