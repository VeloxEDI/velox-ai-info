---
title: Byte
description: Stores one unsigned 8-bit integer from 0 through 255 for binary values and narrow API fields.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, byte, unsigned, binary, range]
---

```Delphi
Byte
```

### Example

```Delphi
procedure SetMarker(var Marker: Byte);
begin
  Marker := $7F;
end;
```

### Usage

`Byte` stores one unsigned 8-bit integer from 0 through 255 for binary values and narrow API fields.

### Additional Technical Info
`Byte` is PascalScript base type `btU8`: one unsigned 8-bit value in the inclusive range `0..255`.

Use Byte for binary octets, compact numeric flags and API declarations that specifically require eight unsigned bits. It is not a text character. [`Char`](Char.md) is separately registered as an 8-bit character type, while [`String`](String.md) is Unicode.

Validate an Integer/Variant before assigning it to Byte. Values below zero or above 255 are outside the contract; do not rely on build/runtime range-check settings to decide whether they wrap, narrow or raise.

When a byte is rendered as text, choose decimal, hexadecimal or an encoding explicitly. A byte value is not automatically UTF-8/ANSI text, and arbitrary bytes can contain zero or invalid character sequences.

Byte arrays are appropriate for raw payloads; a String buffer in the Stream adapter is an untyped compatibility surface, not a safer replacement.

The example is source-reviewed only; no value was assigned at runtime.

**External references**

- [Embarcadero integer types](https://docwiki.embarcadero.com/RADStudio/en/Integer_Types_(Delphi)) - Delphi Byte width and range.
- [Free Pascal integer types](https://www.freepascal.org/docs-html/ref/refsu5.html) - compatible ordinal range reference.

<small>Created 2026-07-15</small>
