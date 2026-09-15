---
title: "LeftPad"
description: "Pads to a minimum length with a chosen character but, contrary to its name, appends that padding on the right."
sidebar_position: 26
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - padding
  - implementation-defect
---

```Delphi
Function LeftPad(S: string; Ch: Char; Len: Integer): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := LeftPad('AB', '.', 5); // AB...
end;
```

### Usage

`LeftPad` pads to a minimum length with a chosen character but, contrary to its name, appends that padding on the right.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `S` | `string` | Text to return and possibly extend. |
| `Ch` | `Char` | Character repeated as padding. |
| `Len` | `Integer` | Minimum result length. It is not a number of characters to add. |
| Result | `string` | `S + StringOfChar(Ch, Len - Length(S))` when padding is required; otherwise `S`. |

If `Len <= Length(S)`, including a negative `Len`, the original value is returned unchanged. The function never truncates. Empty input with a positive target returns only the repeated character.

### Additional Technical Info
`LeftPad` returns `S` extended to at least `Len` code units using `Ch`. Despite the public name, the current Velox implementation adds padding **after** the input, on its right-hand side.

The example is fictional and source-reviewed only.

**Directional defect and alternatives**

The source calculates the deficit correctly but executes:

```Delphi
Result := S + StringOfChar(Ch, RestLen);
```

This is conventional right-padding. The later [`RightPad`](RightPad.md) helper performs the reciprocal operation and prepends its padding. Treat both names as reversed until the product behavior is corrected.

For space padding with conventional names, use [`PadL`](PadL.md) or [`PadR`](PadR.md). For leading zeroes use [`PadZ`](PadZ.md). Those standard helpers also avoid the direction-name defect but offer fixed pad characters.

Length and padding operate on string code units, not display columns or grapheme clusters. Proportional fonts, combining marks and wide characters will not align visually by this count. Very large untrusted targets can cause allocation failure and must be bounded.

**External references**

- [Embarcadero DocWiki: `System.StringOfChar`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StringOfChar)
- [Free Pascal: `System.StringOfChar`](https://www.freepascal.org/docs-html/rtl/system/stringofchar.html)

<small>Created 2026-07-15</small>
