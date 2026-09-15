---
title: Int64
description: Stores a fixed signed 64-bit integer from -9,223,372,036,854,775,808 through 9,223,372,036,854,775,807.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, int64, signed, 64-bit, range]
---

```Delphi
Int64
```

### Example

```Delphi
procedure AddCount(Delta: Int64; var Total: Int64);
begin
  Total := Total + Delta;
end;
```

### Usage

`Int64` stores a fixed signed 64-bit integer from -9,223,372,036,854,775,808 through 9,223,372,036,854,775,807.

### Additional Technical Info
`Int64` is PascalScript base type `btS64`: a fixed signed 64-bit integer with range `-9,223,372,036,854,775,808..9,223,372,036,854,775,807` on both Win32 and Win64 Velox.

Use it for large signed counts, offsets and identifiers whose contract is explicitly 64-bit. It is distinct from [`NativeInt`](NativeInt.md), whose width follows the executable architecture.

Validate before narrowing to [`Integer`](Integer.md), a LongInt property or an API declaration that accidentally exposes only 32 bits. Several class member pages document native Int64 values bound to narrower script types; the called declaration controls the real boundary.

Many JavaScript/JSON consumers preserve integers exactly only through `2^53 - 1`. Serialize larger values as documented decimal strings when exact interchange matters. Database schemas and Variants must also support signed 64-bit without conversion to Double.

Arithmetic can exceed the range. Do not depend on overflow checks or wrapping; test bounds before operations involving untrusted values.

The example is source-reviewed only; no arithmetic was executed.

**External references**

- [Embarcadero integer types](https://docwiki.embarcadero.com/RADStudio/en/Integer_Types_(Delphi)) - Int64 width and range.
- [Free Pascal Int64](https://www.freepascal.org/docs-html/ref/refsu5.html) - compatible fixed-width integer reference.

<small>Created 2026-07-15</small>
