---
title: "RightStr"
description: "Returns up to a requested number of trailing characters through the explicitly imported ANSI StrUtils overload."
sidebar_position: 50
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - right
  - ansi
---

```Delphi
Function RightStr( const AText : AnsiString; const ACount : Integer) : AnsiString
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := RightStr('INV-0042', 4); // 0042
end;
```

### Usage

`RightStr` returns up to a requested number of trailing characters through the explicitly imported ANSI StrUtils overload.

**Important behavior and quirks**

- Conversion into `AnsiString` uses the active code page. Characters not representable in that code page can be lost or substituted before slicing.
- `ACount` is interpreted in ANSI character/index terms of the selected overload. In a multibyte code page, character and byte counts are not interchangeable.
- The function does not trim whitespace and does not mutate the input.
- Use [`Copy`](Copy.md) when the starting position must be explicit.

### Additional Technical Info
`RightStr` returns the rightmost `ACount` characters of `AText`. The generated Velox import explicitly selects the `AnsiString` overload, matching the import comment that `LeftStr`, `RightStr` and `MidStr` must remain ANSI.

The example is fictional and source-reviewed only.

**Return rule**

The Delphi terminal executes:

```Delphi
Copy(AText, Length(AText) + 1 - ACount, ACount)
```

| Condition | Result |
|---|---|
| `ACount <= 0` | Empty string. |
| `0 < ACount < Length(AText)` | Exactly the requested trailing characters. |
| `ACount >= Length(AText)` | Complete input. |
| Empty input | Empty string. |

**Performance and concurrency**

The result is one bounded copy. Code-page conversion may occur at the script/native boundary; there is no mutable Velox state.

**External references**

- [Embarcadero DocWiki: `System.StrUtils.RightStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.StrUtils.RightStr)
- [Free Pascal: `StrUtils.RightStr`](https://www.freepascal.org/docs-html/rtl/strutils/rightstr.html) - compatible overload family; Velox specifically imports Delphi's ANSI overload.

<small>Created 2026-07-15</small>
