---
title: "PadZ"
description: "Prepends zero characters until text reaches a minimum code-unit length; it pads raw text rather than formatting a signed number."
sidebar_position: 33
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - padding
  - zero
  - numeric-text
---

```Delphi
function PadZ(S: String; I: LongInt): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := PadZ('42', 5); // 00042
end;
```

### Usage

`PadZ` prepends zero characters until text reaches a minimum code-unit length; it pads raw text rather than formatting a signed number.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `S` | `String` | Text to copy and possibly prefix with `'0'`. |
| `I` | `LongInt` | Minimum result length. |
| Result | `String` | `StringOfChar('0', I - Length(S)) + S`. |

If the target is not greater than the current length, the original input is returned unchanged. Empty input with target 3 returns `'000'`.

### Additional Technical Info
`PadZ` prepends ASCII zero characters until `S` reaches at least `I` code units. It treats `S` as raw text, does not parse a number and never truncates.

The example is fictional and source-reviewed only.

**Not numeric formatting**

The zeroes are placed before the complete string. Consequently `PadZ('-42', 5)` returns `'00-42'`, not the conventional signed-number form `'-0042'`. Decimal separators, prefixes and whitespace are handled the same way. Format or split those components explicitly when their placement matters.

This is modified PascalScript standard-function selector 27. The runtime has parallel ANSI, `WideString` and `UnicodeString` helpers, selected from the actual input kind. Counts are code units rather than display characters.

Target length can cause a large allocation; apply a sensible limit to external values.

**External references**

- [Embarcadero DocWiki: `System.StringOfChar`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StringOfChar)
- [Free Pascal: `System.StringOfChar`](https://www.freepascal.org/docs-html/rtl/system/stringofchar.html)

<small>Created 2026-07-15</small>
