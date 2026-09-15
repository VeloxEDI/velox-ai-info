---
title: "UIntToStr"
description: "Formats the script's unsigned integer value as locale-independent decimal text."
sidebar_position: 42
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - integer
  - uint64
  - formatting
---

```Delphi
function UIntToStr(I: UInt64): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Number: UInt64;
begin
  Number := StrToUInt64('9000000000');
  Value := UIntToStr(Number);  // '9000000000'
end;
```

### Usage

`UIntToStr` formats the script's unsigned integer value as locale-independent decimal text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `I` | `UInt64` | Unsigned value in `0..18446744073709551615` to format. Smaller unsigned values are widened by the script call rules. |

**Returns**

The shortest ASCII decimal representation of `I`, without sign, padding, grouping or locale-specific formatting.

**Errors**

Every declared input value is representable. Allocation or script argument-conversion failures can propagate.

**Usage notes**

This function is suitable for stable decimal interchange and identifier text. Use an explicit hexadecimal formatter when the protocol requires a bit pattern rather than a decimal magnitude.

### Additional Technical Info
`UIntToStr` converts an unsigned integer to minimal base-10 text. In the current Velox PascalScript build its public argument is `UInt64`, so it supports the full unsigned 64-bit range despite the non-width-specific name.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

PascalScript conditionally declares `UIntToStr(UInt64)` when 64-bit support is enabled; the alternative compile-time branch would declare `UIntToStr(Cardinal)`. The reviewed Velox build uses the 64-bit branch. Runtime dispatch case 48 reads `UInt64` and calls Delphi `System.SysUtils.UIntToStr(UInt64)` before returning the digit-only script string.

**Edge cases and quirks**

- Zero returns `0`, and the maximum unsigned value returns all 20 decimal digits.
- No negative value can be supplied through the declared `UInt64` type. A cast from signed data is a separate script conversion and can reinterpret the bit pattern before this function sees it.
- The output is locale-independent and never contains a thousands separator.
- [`UInt64ToStr`](UInt64ToStr.md) uses a different PascalScript dispatch case but the same stack width and Delphi overload in the current build; its output is identical.
- The public declaration would narrow to `Cardinal` if PascalScript were built with `PS_NOINT64`. Current generated metadata and runtime source confirm that this is not the Velox configuration.
- Free Pascal's equivalent overload uses its `QWord` type name for an unsigned 64-bit input.

**Side effects**

None outside result-string allocation.

**Performance and concurrency**

Constant bounded work with at most 20 output digits and no shared state or locale dependency.

**Related entries**

- [`UInt64ToStr`](UInt64ToStr.md) is the explicit 64-bit alias in the current runtime.
- [`StrToUInt64`](StrToUInt64.md) converts text in the opposite direction.
- [`IntToStr`](IntToStr.md) formats a signed `Int64` value.

**External references**

- [Free Pascal `UIntToStr`](https://www.freepascal.org/daily/doc/rtl/sysutils/uinttostr.html) - compatible unsigned decimal formatting reference with the `QWord` dialect type.
- [Embarcadero `System.SysUtils.UIntToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.UIntToStr) - the Delphi `UInt64` overload selected by the current PascalScript runtime.

<small>Created 2026-07-15</small>
