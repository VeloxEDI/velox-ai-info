---
title: "BinToHex"
description: "Converts a Variant array of byte-like values to an uppercase hexadecimal string."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - hexadecimal
  - variant array
  - bytes
---

```Delphi
function BinToHex(Value: Variant): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Data: Variant;
begin
  Data := VarArrayCreate(3, varByte);
  Data[0] := $41;
  Data[1] := $42;
  Data[2] := $43;
  Value := BinToHex(Data);  // '414243'
end;
```

### Usage

`BinToHex` converts a Variant array of byte-like values to an uppercase hexadecimal string.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Value` | `Variant` | A one-dimensional, normally zero-based Variant array whose elements can be converted to `Int64`. `Null` and `Empty` are also accepted. |

**Returns**

An uppercase hexadecimal string formed by concatenating `IntToHex(Value[I], 2)` for indexes from zero through the array's first-dimension high bound. `Null`, `Empty` and a zero-length zero-based array produce an empty string.

**Errors**

Array-shape, array-bound, Variant conversion, string range and allocation failures propagate. The function does not return a partial-success indicator.

**Usage notes**

Use a zero-based `varByte` array when a fixed two-hex-digit-per-byte result is required. Validate the array type, dimensions and bounds before calling when the Variant comes from an external or loosely typed source.

### Additional Technical Info
`BinToHex` concatenates the uppercase hexadecimal representation of each element in a one-dimensional `Variant` array. `Null` and `Empty` return an empty string. All other inputs are treated as arrays.

The example builds a zero-based byte array containing ASCII `ABC`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The PascalScript import binds directly to the Velox common-number implementation. After the `Null`/`Empty` check, the function obtains `VarArrayHighBound(Value, 1)` and loops from index `0` to that bound. Each element is Variant-converted to the signed 64-bit value accepted by Velox [`IntToHex`](IntToHex.md), whose terminal is Delphi `System.SysUtils.IntToHex(Int64, Integer)`.

The requested two digits are a **minimum width**. The RTL pads smaller positive values but does not truncate larger values.

**Edge cases and quirks**

- The function assumes a one-dimensional array and assumes its lower bound is zero. A non-array Variant or missing first dimension raises. A non-zero lower bound can make the first access invalid or omit elements.
- Elements are not constrained to `Byte`. For example, `$123` contributes `123`, so the result no longer has exactly two characters per element.
- A negative element is converted through the `Int64` overload and contributes a 16-character two's-complement representation, regardless of the requested width.
- An element that cannot be converted to `Int64` raises a Variant conversion exception. Custom Variant types can run their conversion handlers.
- This is not Delphi `Classes.BinToHex`, which writes a caller-supplied buffer and reports a converted count.

**Side effects**

No intended external side effect. Reading a custom Variant element can invoke its conversion implementation.

**Performance and concurrency**

The loop repeatedly appends to the result string. Large arrays can therefore cause repeated allocation and copying in addition to the final two-or-more characters per element. State is local to the call unless a custom Variant conversion uses shared state.

**Related entries**

- [`HexToBin`](HexToBin.md) creates a memory stream from hexadecimal text, subject to its validation and ownership warnings.
- [`IntToHex`](IntToHex.md) defines the per-element formatting rule.
- [`Base64EncodeBytes`](../EncryptionHashEncode/Base64EncodeBytes.md) is generally more compact for transporting arbitrary bytes as text.

**External references**

- [Embarcadero `System.SysUtils.IntToHex`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IntToHex) - documents the selected Delphi terminal's minimum-width and negative-value behaviour.
- [Free Pascal `IntToHex`](https://www.freepascal.org/docs-html/rtl/sysutils/inttohex.html) - compatibility reference; Velox executes the Delphi implementation and adds its own Variant-array loop.

<small>Created 2026-07-15</small>
