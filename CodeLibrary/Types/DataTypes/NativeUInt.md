---
title: NativeUInt
description: "Stores an unsigned integer whose width follows the running Velox executable: 32-bit on Win32 and 64-bit on Win64."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, nativeuint, unsigned, pointer-sized, architecture]
---

```Delphi
NativeUInt
```

### Example

```Delphi
procedure CopyNative(Value: NativeUInt; var ResultValue: NativeUInt);
begin
  ResultValue := Value;
end;
```

### Usage

`NativeUInt` stores an unsigned integer whose width follows the running Velox executable: 32-bit on Win32 and 64-bit on Win64.

### Additional Technical Info
`NativeUInt` is registered as unsigned 32-bit (`btU32`) in a Win32 Velox executable and unsigned 64-bit (`btU64`) in Win64. PascalScript makes that decision from the host CPU architecture when constructing its compiler.

Use it only for an explicitly native-width unsigned API contract. Prefer [`Cardinal`](Cardinal.md) for stable unsigned 32-bit data or [`UInt64`](UInt64.md) for stable unsigned 64-bit data.

The Win64 upper range does not fit Int64, and the Win32 upper half does not fit Integer. Validate before signed conversion, Variant/database binding or text parsing. Some external systems have no unsigned integer representation.

Do not persist or transmit NativeUInt without first converting to a fixed documented width. A handle/pointer-shaped value also remains valid only for the process and lifetime defined by the originating API.

The example is source-reviewed only; no native value was copied at runtime.

**External references**

- [Embarcadero NativeUInt](https://docwiki.embarcadero.com/Libraries/Athens/en/System.NativeUInt) - native Delphi pointer-sized unsigned type.
- [Free Pascal NativeUInt](https://www.freepascal.org/docs-html/rtl/system/nativeuint.html) - compatible architecture-dependent reference.

<small>Created 2026-07-15</small>
