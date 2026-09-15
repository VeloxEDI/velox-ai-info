---
title: "RightPad"
description: "Prepends a chosen character until text reaches a minimum length, despite the function's right-padding name."
sidebar_position: 49
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - padding
  - defect
---

```Delphi
Function RightPad( S : string; Ch : Char; Len : Integer) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := RightPad('42', '0', 5); // 00042
end;
```

### Usage

`RightPad` prepends a chosen character until text reaches a minimum length, despite the function's right-padding name.

**Parameters and return value**

| Item | Meaning |
|---|---|
| `S` | Text to retain. It is passed by value and not mutated. |
| `Ch` | Character prepended when padding is needed. |
| `Len` | Minimum result length in Velox string code units. |
| Result | `S` unchanged when `Len <= Length(S)`; otherwise left padding followed by `S`. |

**Important behavior and quirks**

- The name does not describe the implemented direction. For conventional space padding, [`PadL`](PadL.md) also pads on the left and [`PadR`](PadR.md) pads on the right.
- [`LeftPad`](LeftPad.md) contains the reciprocal defect and appends its padding on the right.
- The function never truncates text.
- Zero or negative `Len` returns `S` unchanged.
- A NUL padding character creates embedded NULs before the visible text and can confuse pointer-based consumers.
- This is raw text padding. With a signed number such as `-42`, zero padding produces `00-42`, not `-0042`.

### Additional Technical Info
`RightPad` currently pads on the **left**. When `S` is shorter than `Len`, it returns `StringOfChar(Ch, Len - Length(S)) + S`. The public name is therefore directionally reversed.

The example is fictional and source-reviewed only.

**Performance and concurrency**

The helper allocates the padding and concatenated result. It reads no shared state.

**External references**

- [Embarcadero DocWiki: `System.StringOfChar`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.StringOfChar)
- [Free Pascal: `System.StringOfChar`](https://www.freepascal.org/docs-html/rtl/system/stringofchar.html)

<small>Created 2026-07-15</small>
