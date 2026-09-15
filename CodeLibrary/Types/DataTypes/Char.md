---
title: Char
description: Stores one PascalScript 8-bit AnsiChar code unit, not one Unicode character from the script String type.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, char, ansichar, unicode, narrowing]
---

```Delphi
Char
```

### Example

```Delphi
procedure SetDelimiter(var Delimiter: Char);
begin
  Delimiter := ',';
end;
```

### Usage

Stores one Velox scripting 8-bit AnsiChar code unit, not one Unicode character from the script String type.

### Additional Technical Info
In the current Velox PascalScript compiler, public `Char` maps to internal `btChar`, backed by Delphi `AnsiChar`. It stores one 8-bit code unit with ordinal `0..255`.

This differs from current native Delphi, where `Char` normally means 16-bit WideChar. PascalScript's public [`String`](String.md) is nevertheless registered as UnicodeString. A String can therefore contain text that a public Char variable cannot represent.

Use Char for ASCII delimiters, tokens and protocol markers. For arbitrary user text, keep values as String. A Unicode String position is a UTF-16 code unit; copying it into Char can narrow or depend on conversion behavior for values above 255. A supplementary Unicode character is two UTF-16 code units and cannot fit in one Char.

Char is also distinct from [`Byte`](Byte.md): both occupy one byte internally, but Char participates in character/string operations while Byte is numeric/binary. Do not use either as a promise that data is valid UTF-8.

The example is source-reviewed only; no delimiter was assigned at runtime.

**External references**

- [Embarcadero character types](https://docwiki.embarcadero.com/RADStudio/en/Character_Types_(Delphi)) - native Delphi character model; note Velox's documented PascalScript difference.
- [Free Pascal character types](https://www.freepascal.org/docs-html/ref/refsu8.html) - character-type comparison reference.

<small>Created 2026-07-15</small>
