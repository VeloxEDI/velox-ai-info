---
title: Data Types
description: Source-backed scalar, string, pointer, date, GUID and Variant type contracts used by Velox PascalScript.
sidebar_position: 1
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, types, integers, strings, datetime, guid, variant]
---

Velox scripts use RemObjects PascalScript types mapped into the Delphi process. Most names resemble Delphi, but the exact current registrations—not the name alone—control width, encoding and runtime interoperability.

## Type selection

| Need | Prefer | Exact current boundary |
|---|---|---|
| True/false state | [`Boolean`](DataTypes/Boolean.md) | Two-value `(False, True)` script enumeration. |
| Unsigned 8-bit value or raw byte | [`Byte`](DataTypes/Byte.md) | `0..255`; not a text character. |
| Unsigned 16-bit value | [`Word`](DataTypes/Word.md) | `0..65,535`. |
| Signed 32-bit value | [`Integer`](DataTypes/Integer.md) | Alias of hidden LongInt; fixed 32-bit. |
| Unsigned 32-bit value | [`Cardinal`](DataTypes/Cardinal.md) | Alias of hidden LongWord; fixed 32-bit. |
| Signed/unsigned 64-bit value | [`Int64`](DataTypes/Int64.md) / [`UInt64`](DataTypes/UInt64.md) | Fixed 64-bit; check external Variant/JSON/database support. |
| Pointer-sized integer | [`NativeInt`](DataTypes/NativeInt.md) / [`NativeUInt`](DataTypes/NativeUInt.md) | 32-bit in Win32 Velox, 64-bit in Win64 Velox. |
| Approximate real value | [`Single`](DataTypes/Single.md), [`Double`](DataTypes/Double.md), [`Extended`](DataTypes/Extended.md) | Binary floating point; Extended changes precision by executable architecture. |
| Four-decimal fixed-point value | [`Currency`](DataTypes/Currency.md) | Signed Int64 scaled by 10,000. |
| Managed text | [`String`](DataTypes/String.md) | UnicodeString/UTF-16; 1-based code-unit indexing. |
| One public script character | [`Char`](DataTypes/Char.md) | Eight-bit AnsiChar despite Unicode String. |
| Legacy NUL-terminated pointer | [`PChar`](DataTypes/PChar.md) | Borrowed PAnsiChar-style pointer; avoid for normal text. |
| Delphi date/time serial | [`TDateTime`](DataTypes/TDateTime.md) | Double days from 1899-12-30; no timezone metadata. |
| GUID value | [`TGUID`](DataTypes/TGUID.md) | Plain 16-byte field record; no imported record methods. |
| Dynamically tagged value | [`Variant`](DataTypes/Variant.md) | Distinguishes Empty, Null, scalars and arrays. |
| Inspect a Variant tag | [`TVarType`](DataTypes/TVarType.md) | Word base code plus flags; mask before comparing. |

## Architecture and encoding rules

The script compiler derives NativeInt/NativeUInt width from the CPU architecture of the running Velox executable. Never put a Native value into a persistent schema, file or wire contract. Use an explicit fixed-width type.

The current compiler registers String as UnicodeString, but its public Char/PChar registrations use PascalScript's internal AnsiChar/PAnsiChar types. A String position is a UTF-16 code unit; a Char can hold only one byte. Non-ASCII String-to-Char/PChar paths can therefore narrow or depend on an ANSI conversion. Use String for text and Byte/byte arrays for data.

Importers can also define `UTF8String` as AnsiString for selected APIs. That value contains UTF-8 bytes even though a normal String is UTF-16 text. Preserve the documented encoding at every boundary instead of relying on implicit casts.

## Numeric and dynamic-value rules

Choose by range and semantics, not by convenience. Validate before narrowing, especially at importer properties whose declaration is narrower than the native Delphi value. Do not depend on overflow wrapping, implicit signed/unsigned conversion or floating-point equality for business correctness.

Single, Double and Extended are approximate binary values. Currency is exact only to four decimal places. TDateTime is a Double with date/time conventions layered on top and should use date functions rather than raw floating arithmetic for calendar operations.

Variant is convenient at Velox boundaries but shifts validation to runtime. Test Null/Empty explicitly, inspect VarType when shape matters and convert once into a strong local type. Never assume Null equals an empty String or zero.

## Interchange guidance

- Match database column range, signedness, precision and nullability explicitly.
- Serialize 64-bit integers as strings when a JSON/JavaScript consumer cannot preserve them exactly.
- Format date/time and numeric output with an invariant documented contract; default conversion can use server locale.
- Use GUID conversion functions rather than manually joining record fields or raw memory.
- Never use PChar or native-sized integers as persistent identifiers.
- Treat managed Strings, Variants, arrays and record values as local values; do not expose their process memory layout.

## External references

- [Embarcadero Delphi data types](https://docwiki.embarcadero.com/RADStudio/en/Delphi_Data_Types_(Delphi)) - official Delphi type model used at native boundaries.
- [Free Pascal simple types](https://www.freepascal.org/docs-html/ref/refch3.html) - compatible language reference and comparison source; Velox follows its current PascalScript/Delphi registrations where details differ.

<small>Created 2026-07-15</small>
