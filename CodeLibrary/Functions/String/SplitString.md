---
title: "SplitString"
description: "Splits trimmed text on one separator character, discarding every empty field and replacing the output array."
sidebar_position: 53
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - split
  - array
---

```Delphi
Procedure SplitString( const aString : String; const aSeparator : Char; var aStrings : TStringArray)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Parts: TStringArray;
begin
  SplitString('North||South|', '|', Parts);
  Value := Parts[1]; // South; the empty fields are discarded
end;
```

### Usage

`SplitString` splits trimmed text on one separator character, discarding every empty field and replacing the output array.

**Important behavior and quirks**

- Leading, trailing and repeated separators do not create empty array elements.
- Empty or whitespace-only input produces an empty array.
- Trimming applies only to the outside of the complete input. With comma separation, `' A , B '` becomes tokens `'A '` and `' B'`; token-adjacent spaces remain.
- If the separator itself is an ordinary space, leading/trailing spaces disappear and runs of spaces collapse because empty tokens are discarded.
- The procedure does not understand quotes, escapes, CSV rules or nested syntax.
- `aStrings` is destructive output: its previous contents are released before parsing.
- Embedded NUL is handled as an ordinary length-counted character unless NUL is the chosen separator.

### Additional Technical Info
`SplitString` replaces `aStrings` with the non-empty tokens found by splitting `aString` on one exact `Char`. It trims the complete input before splitting, but it does not trim each individual token.

The example is fictional and source-reviewed only.

**Parameters and mutation**

| Parameter | Meaning |
|---|---|
| `aString` | Input text. A Delphi `Trim` is applied to the whole value. |
| `aSeparator` | One exact separator character. There is no multi-character delimiter or character-set interpretation. |
| `aStrings` | Output array. Its length is set to zero before scanning and it is expanded once for each non-empty token. |

**Exact algorithm**

Velox computes `Trim(aString) + aSeparator`, then scans from position 1. Non-separator characters are appended to a temporary token. On a separator, the token is appended only when it is non-empty; otherwise the separator is simply skipped. The appended sentinel separator flushes the final token.

**Performance and concurrency**

The implementation grows both the current token and result array incrementally. Long tokens or many fields can cause repeated allocations and copies. It is stateless apart from the caller-owned output array.

**Related entries**

- [`StringToToken`](StringToToken.md) - tokenises using a separator set into a `TStringList`.
- [`ProperCase`](ProperCase.md) - uses this exact splitter with an ordinary-space separator.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.Trim`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.Trim)
- [Free Pascal: `SysUtils.Trim`](https://www.freepascal.org/docs-html/rtl/sysutils/trim.html) - compatibility context.

<small>Created 2026-07-15</small>
