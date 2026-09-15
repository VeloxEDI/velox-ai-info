---
title: "BreakStringLast"
description: "Splits at the last matching delimiter character; multi-character separator input triggers a current length-handling defect."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - split
  - last-delimiter
  - implementation-defect
---

```Delphi
Procedure BreakStringLast(S: string; const aSep: string; var Head, Tail: string)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Head, Tail: string;
begin
  BreakStringLast('archive.2026.csv', '.', Head, Tail);
  Value := Head + ' / ' + Tail; // archive.2026 / csv
end;
```

### Usage

`BreakStringLast` splits at the last matching delimiter character; multi-character separator input triggers a current length-handling defect.

**Parameters**

| Name | Mode | Description |
|---|---|---|
| `S` | input | Source text; not modified. |
| `aSep` | input | Delimiter characters passed to Velox `LastDelimiter`. For reliable results, supply exactly one character. |
| `Head` | output through `var` | Text before the located character, or all of `S` if none is located. |
| `Tail` | output through `var` | Text after the removed region, or empty if no delimiter is located. |

### Additional Technical Info
`BreakStringLast` divides text at the last occurrence of a delimiter character. With the supported, safe usage of a one-character `aSep`, it returns the text before that character in `Head` and the text after it in `Tail`.

The example is fictional and source-reviewed only.

**Current implementation defect**

The name and declaration suggest that `aSep` is one substring, but the implementation combines incompatible rules:

1. `LastDelimiter(aSep, S)` treats every character in `aSep` as a separate valid delimiter and locates the last occurrence of **any** one of them.
2. The helper then advances by `Length(aSep)` as though the entire string had matched at that location.

For example, passing `'::'` does not search for the last two-character token. It finds the last `':'` character and skips two characters from there, which can remove the first character of the intended tail. Passing `'/\\'` searches for either slash but then skips two code units. This mismatch can silently corrupt a split result.

Restrict `aSep` to one character. To split around the first exact multi-character token, use [`BreakString`](BreakString.md). To find a last multi-character substring, use an explicit search strategy rather than this helper.

**Other edge cases**

- A delimiter at the first position produces an empty `Head`.
- A delimiter at the last position produces an empty `Tail`.
- No match, including an empty delimiter set, produces `Head = S` and `Tail = ''`.
- Matching is case-sensitive and delimiter-character based; it does not honour escaping or quoting.
- Delphi's terminal ignores the NUL character as a delimiter, so `#0` is not a reliable separator here.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.LastDelimiter`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.LastDelimiter)
- [Free Pascal: `SysUtils.LastDelimiter`](https://www.freepascal.org/docs-html/rtl/sysutils/lastdelimiter.html)

<small>Created 2026-07-15</small>
