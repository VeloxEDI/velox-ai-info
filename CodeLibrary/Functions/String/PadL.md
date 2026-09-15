---
title: "PadL"
description: "Prepends ASCII spaces until a string reaches a requested minimum code-unit length, without truncating longer input."
sidebar_position: 31
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - padding
  - left
  - spaces
---

```Delphi
function PadL(S: String; I: LongInt): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := '[' + PadL('42', 5) + ']'; // [   42]
end;
```

### Usage

`PadL` prepends ASCII spaces until a string reaches a requested minimum code-unit length, without truncating longer input.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `S` | `String` | Text to copy and possibly pad. |
| `I` | `LongInt` | Minimum result length, not the number of spaces to add. |
| Result | `String` | `StringOfChar(' ', I - Length(S)) + S`. |

If `I <= Length(S)`, including zero or a negative value, the repeated-space count is non-positive and the result equals `S`. Empty input with a positive target returns that number of spaces.

ANSI, `WideString` and `UnicodeString` values are supported. Length is measured in code units and padding always uses U+0020/ASCII space.

Padding to code-unit width does not guarantee visual alignment in a proportional font or for tabs, combining marks, surrogate pairs and full-width characters. Bound any target derived from external data to prevent excessive allocation.

Unlike [`LeftPad`](LeftPad.md), which appends a caller-selected character despite its name, `PadL` has conventional left direction but only a fixed space character. [`PadZ`](PadZ.md) provides fixed leading zeroes.

### Additional Technical Info
`PadL` left-pads a string with ordinary ASCII spaces until its length is at least `I`. Existing text is right-aligned within the resulting code-unit width. It never truncates.

The example is fictional and source-reviewed only.

**External references**

- [Embarcadero DocWiki: `System.StringOfChar`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StringOfChar)
- [Free Pascal: `System.StringOfChar`](https://www.freepascal.org/docs-html/rtl/system/stringofchar.html)

<small>Created 2026-07-15</small>
