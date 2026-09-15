---
title: UInt64
description: Stores a fixed unsigned 64-bit integer from zero through 18,446,744,073,709,551,615.
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, uint64, unsigned, 64-bit, range]
---

```Delphi
UInt64
```

### Example

```Delphi
procedure AddUnsigned(Delta: UInt64; var Total: UInt64);
begin
  Total := Total + Delta;
end;
```

### Usage

`UInt64` stores a fixed unsigned 64-bit integer from zero through 18,446,744,073,709,551,615.

### Additional Technical Info
`UInt64` is PascalScript base type `btU64`: a fixed unsigned 64-bit integer with range `0..18,446,744,073,709,551,615` on both Win32 and Win64 Velox.

The upper half does not fit signed [`Int64`](Int64.md). Many Variants, databases, JSON libraries and external languages have no lossless unsigned 64-bit type. Validate the target and use a canonical decimal String when necessary.

JavaScript binary64 numbers preserve consecutive integers only through `2^53 - 1`, far below UInt64's maximum. Never send a large UInt64 as an ordinary JSON number when exact identity matters.

Use UInt64 only for explicitly unsigned 64-bit contracts. Do not substitute [`NativeUInt`](NativeUInt.md), whose width changes with executable architecture. Validate before arithmetic because underflow below zero and overflow above the maximum are outside the contract.

The example is source-reviewed only; no arithmetic was executed.

**External references**

- [Embarcadero UInt64](https://docwiki.embarcadero.com/Libraries/Athens/en/System.UInt64) - native fixed-width unsigned type.
- [Free Pascal QWord/UInt64](https://www.freepascal.org/docs-html/ref/refsu5.html) - compatible unsigned 64-bit model.

<small>Created 2026-07-15</small>
