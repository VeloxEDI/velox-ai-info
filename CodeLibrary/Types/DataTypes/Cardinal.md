---
title: Cardinal
description: Stores an unsigned 32-bit LongWord-compatible value from zero through 4,294,967,295.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, cardinal, unsigned, 32-bit, longword]
---

```Delphi
Cardinal = LongWord
```

### Example

```Delphi
procedure SetMask(var Mask: Cardinal);
begin
  Mask := $80000000;
end;
```

### Usage

`Cardinal` stores an unsigned 32-bit LongWord-compatible value from zero through 4,294,967,295.

### Additional Technical Info
`Cardinal` is PascalScript's public alias of its hidden unsigned 32-bit `LongWord` base type (`btU32`). Its range is `0..4,294,967,295` on both Win32 and Win64 Velox.

Use it for protocol/schema fields explicitly defined as unsigned 32-bit values. Do not replace it with [`NativeUInt`](NativeUInt.md), whose width follows the Velox executable architecture.

Cardinal's upper half does not fit a signed [`Integer`](Integer.md). Validate before converting between them, passing through Variant, binding to a signed database column or serializing to a consumer that lacks unsigned integers.

Hexadecimal notation is useful for bit masks, but bit meanings still require separate constants/documentation. Do not interpret an arbitrary Cardinal as a pointer or handle; use the exact API type and lifetime contract.

The example is source-reviewed only; no mask was assigned at runtime.

**External references**

- [Embarcadero integer types](https://docwiki.embarcadero.com/RADStudio/en/Integer_Types_(Delphi)) - Cardinal/LongWord width and range.
- [Free Pascal integer types](https://www.freepascal.org/docs-html/ref/refsu5.html) - compatible unsigned integer model.

<small>Created 2026-07-15</small>
