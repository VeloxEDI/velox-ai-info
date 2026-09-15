---
title: "RemoveChars"
description: "Removes every occurrence of each character listed in a string by applying repeated case-sensitive replace-all passes."
sidebar_position: 43
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - remove
  - characters
---

```Delphi
Function RemoveChars( const s : string; const aCharsToRemove : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := RemoveChars('INV-2026/0042', '-/'); // INV20260042
end;
```

### Usage

`RemoveChars` removes every occurrence of each character listed in a string by applying repeated case-sensitive replace-all passes.

**Parameters and return value**

| Item | Meaning |
|---|---|
| `s` | Source string. It is not mutated. |
| `aCharsToRemove` | String whose individual characters are to be removed. It is not interpreted as a substring or regex. |
| Result | A new string with the selected characters removed. |

**Important behavior and quirks**

- An empty removal list returns the original text.
- Duplicate characters in the removal list do not change the result, but cause redundant full-string passes.
- `RemoveChars('AaA', 'A')` returns `a`; lowercase and uppercase are distinct.
- The routine removes UTF-16 code units, not user-perceived grapheme clusters. Supplying one half of a surrogate pair can create invalid Unicode text.
- Unlike [`RemoveChars2`](RemoveChars2.md), Velox is length-based and does not stop merely because the source contains an embedded NUL.

### Additional Technical Info
`RemoveChars` returns `s` after removing every occurrence of every code unit listed in `aCharsToRemove`. The removal list is a string, so each of its positions is processed independently and in order.

The example is fictional and source-reviewed only.

**How it works**

Velox starts with `Result := s`. For each one-based position in `aCharsToRemove`, it runs Delphi `StringReplace(Result, aCharsToRemove[i], '', [rfReplaceAll])`. Search is case-sensitive because `rfIgnoreCase` is not supplied.

**Performance and concurrency**

The function performs one complete replace-all operation per removal-list position and allocates intermediate strings. For a long source or large removal list, a set-based single pass can be substantially cheaper. It uses no mutable Velox state.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.StringReplace`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StringReplace)
- [Free Pascal: `StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html) - compatible operation; Velox runs Delphi's implementation.

<small>Created 2026-07-15</small>
