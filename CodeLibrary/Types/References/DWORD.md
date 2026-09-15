---
title: DWORD
description: "Aliases PascalScript LongWord as a fixed unsigned 32-bit value for Windows-style fields, flags, sizes, and status values."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, reference, dword, longword, unsigned, 32-bit]
---

```Delphi
DWORD = LongWord
```

### Example

```Delphi
procedure SetHighBit(var Flags: DWORD);
begin
  Flags := $80000000;
end;
```

### Usage

`DWORD` aliases Velox scripting LongWord as a fixed unsigned 32-bit value for Windows-style fields, flags, sizes, and status values.

#### Signed and interchange boundaries

Values through `2,147,483,647` fit signed [`Integer`](../DataTypes/Integer.md); the upper half does not. Validate before converting to signed Integer, placing the value in a signed database column, passing through a consumer that coerces Variants to signed 32-bit, or serializing to a schema that lacks unsigned integers.

Hexadecimal notation is useful for masks because it preserves the bit pattern. Document which bits are defined, reject unsupported bits when required, and use bitwise operations rather than arithmetic addition when composing independently meaningful flags.

`DWORD` is always 32-bit. It is not interchangeable with [`NativeUInt`](../DataTypes/NativeUInt.md), whose width follows the running Velox executable, and it must not be used to store a pointer on the assumption that the current process happens to be 32-bit.

Overflow, underflow and conversion behaviour depends on the operation being performed. Validate untrusted numeric input explicitly rather than relying on wraparound.

### Additional Technical Info
Velox registers `DWORD` with `AddTypeS('DWORD', 'LongWord')`. In this PascalScript build `LongWord` is the hidden `btU32` base type, so `DWORD` stores an unsigned 32-bit integer from `0` through `4,294,967,295`. Its representation is the same as public [`Cardinal`](../DataTypes/Cardinal.md) on both Win32 and Win64 Velox.

The familiar Windows name is descriptive only. A value does not become a handle, pointer, error code, byte count, bit mask or time value merely because it is typed `DWORD`; interpret it according to the parameter/property that produced it. The alias adds no flag constants and owns no operating-system resource.

**Related Code Library entries**

- [Cardinal](../DataTypes/Cardinal.md) - public name for the same script representation.
- [Integer](../DataTypes/Integer.md) - signed 32-bit conversion boundary.

**External references**

- [Embarcadero integer types](https://docwiki.embarcadero.com/RADStudio/en/Integer_Types_(Delphi)) - Delphi LongWord/Cardinal width and range.
- [Free Pascal integer types](https://www.freepascal.org/docs-html/ref/refsu5.html) - compatible unsigned-integer model.
- [Microsoft Windows data types](https://learn.microsoft.com/en-us/windows/win32/winprog/windows-data-types) - Windows `DWORD` context; the exact Velox alias is defined above.

<small>Created 2026-07-15</small>
