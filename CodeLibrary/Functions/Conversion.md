---
title: "Conversion"
description: "Functions for converting values among binary, hexadecimal, numeric, Boolean, GUID, stream, text and date/time representations."
sidebar_position: 7
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - binary
  - hexadecimal
  - text
---

### Description

The Conversion group contains functions that change a value's representation or construct an object from encoded input. These operations do not all perform validation. Some are strict Delphi conversions that raise on invalid text, while others are Velox-owned loops that ignore unexpected characters, discard incomplete input or rely on a particular array shape.

**Choosing a conversion**

| Requirement | Function family | Important boundary |
|---|---|---|
| Represent bytes as hexadecimal text | [`BinToHex`](Conversion/BinToHex.md) | Accepts a one-dimensional `Variant` array, not `TBytes`, and does not enforce byte-sized elements. |
| Decode hexadecimal text | [`HexToBin`](Conversion/HexToBin.md), [`HexToInt`](Conversion/HexToInt.md) | The stream decoder is permissive and has an unsafe exception path; the integer decoder is strict. |
| Represent an integer in binary | [`IntToBin`](Conversion/IntToBin.md), [`IntToBin2`](Conversion/IntToBin2.md) | One uses a caller-selected width for positive values; the other returns whole 8-bit groups from a 32-bit value. |
| Represent an integer in text | [`IntToStr`](Conversion/IntToStr.md), [`Int64ToStr`](Conversion/Int64ToStr.md), [`IntToHex`](Conversion/IntToHex.md) | Decimal output is locale-independent. Hexadecimal width is a minimum, not a truncation limit. |
| Convert Boolean or floating-point values to text | [`BoolToStr`](Conversion/BoolToStr.md), [`FloatToStr`](Conversion/FloatToStr.md) | Boolean text can come from mutable process-wide arrays; floating-point text uses the Windows system-default locale. |
| Move bytes into a memory stream | [`BytesToStream`](Conversion/BytesToStream.md) | Clears and mutates a caller-owned stream; it does not allocate or return a new stream. |
| Format a GUID | [`GUIDToString`](Conversion/GUIDToString.md) | Returns the standard braced, hyphenated hexadecimal form. |

**Representation contracts**

Treat an encoded representation as an interface contract. Specify the number of bits, byte order, signedness, character encoding, decimal separator and ownership expectations at the integration boundary. A hexadecimal string does not by itself say whether it represents bytes, an unsigned magnitude or a signed two's-complement bit pattern.

Binary data should remain in `TBytes` or a stream until it reaches an explicitly selected text encoding such as hexadecimal or Base64. Do not pass arbitrary binary data through a normal string conversion and assume it will round-trip.

**Locale and platform rules**

Integer and hexadecimal conversions in this group are locale-independent. `FloatToStr` is deliberately different: its Velox wrapper creates format settings for the Windows system-default locale on each call, and Delphi selects a general format with 15 significant digits. Its decimal separator and fixed-versus-scientific notation therefore require consideration when producing machine-readable output.

`Extended` precision depends on the deployed Delphi target. Avoid treating formatted floating-point text as an exact persistence format unless the accepted precision and locale are explicitly controlled by the flow.

**Validation and errors**

Read the individual page before using a conversion as a validator. In particular, `BinToInt` treats every character other than `1` as a zero bit, whereas `HexToInt` raises `EConvertError` on unsupported text. `HexToBin` stops at invalid text but ignores the decoded-byte count, so it can return a stream whose trailing bytes are not valid decoded data.

Size, range, allocation and Variant-conversion failures are synchronous. No function in this group supplies a timeout or size limit. Validate externally supplied sizes before allocating wide binary strings, arrays or streams.

**Ownership and side effects**

Most functions return managed strings or arrays owned by the script runtime. The stream functions require special care:

- `BytesToStream` modifies an existing `TMemoryStream` and leaves it positioned at the end of the new data.
- `HexToBin` creates a `TMemoryStream`; the caller owns and must free a successfully returned stream.

The functions do not intentionally access Velox datasets, configuration or external systems. Locale settings and configured Boolean-string arrays are process state that can influence applicable text results.

**Related guidance**

- [`Testing values`](../ScriptingGuide/TestingValues.md) explains `Variant`, `Null` and `Empty` handling.
- [`Data types`](../Types/DataTypes.md) describes the script types used by these declarations.
- [`Encryption, hashing and encoding`](EncryptionHashEncode.md) contains Base64 and other transport encodings.


<small>Created 2026-07-15</small>
