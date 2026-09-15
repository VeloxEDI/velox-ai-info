---
title: Word
description: Stores one unsigned 16-bit integer from zero through 65,535 for narrow fields, tags and masks.
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, type, word, unsigned, 16-bit, range]
---

```Delphi
Word
```

### Example

```Delphi
procedure SetPort(var Port: Word);
begin
  Port := 443;
end;
```

### Usage

`Word` stores one unsigned 16-bit integer from zero through 65,535 for narrow fields, tags and masks.

### Additional Technical Info
`Word` is PascalScript base type `btU16`: one unsigned 16-bit integer in range `0..65,535`.

Use it for APIs and schemas explicitly defined as unsigned 16-bit values, such as ports, date/time components, narrow codes and [`TVarType`](TVarType.md). Use [`Byte`](Byte.md), Cardinal or UInt64 when the contract has another width.

Validate negative or larger Integer/Variant values before assignment. A Word converted to signed 16-bit storage can also change meaning above 32,767; ensure the destination is genuinely unsigned.

A Word may contain a bit mask or a numeric value, but the type itself gives no meaning to bits. Use documented symbolic constants and masks rather than magic numbers.

The example is source-reviewed only; no port was assigned at runtime.

**External references**

- [Embarcadero integer types](https://docwiki.embarcadero.com/RADStudio/en/Integer_Types_(Delphi)) - Word width and range.
- [Free Pascal integer types](https://www.freepascal.org/docs-html/ref/refsu5.html) - compatible unsigned integer reference.

<small>Created 2026-07-15</small>
