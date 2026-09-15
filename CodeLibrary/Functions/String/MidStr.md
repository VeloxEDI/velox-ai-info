---
title: "MidStr"
description: "Returns up to ACount AnsiString units from a one-based start by delegating to Delphi StrUtils Copy."
sidebar_position: 30
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - substring
  - ansi
  - indexing
---

```Delphi
Function MidStr(const AText: AnsiString;
  const AStart, ACount: Integer): AnsiString
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := MidStr('ABCDEFGHIJ', 4, 3); // DEF
end;
```

### Usage

`MidStr` returns up to `ACount` `AnsiString` units from a one-based start position.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `AText` | `AnsiString` | Source text. |
| `AStart` | `Integer` | One-based start. In Velox, values below 1 are normalised to the beginning. Prefer `1` explicitly. |
| `ACount` | `Integer` | Maximum units to return. Non-positive returns empty. |
| Result | `AnsiString` | Requested segment, truncated at the source end or empty beyond it. |

If `AStart` exceeds the source length, the result is empty. If `AStart + ACount` extends beyond the end, the available suffix is returned. No error is raised for these normal boundaries.

Counts are ANSI bytes or code units in this version. A boundary can split a multibyte encoded character. Use the same known encoding to establish safe boundaries, or use a Unicode-aware design.

[`LeftStr`](LeftStr.md) fixes the start at one.

### Additional Technical Info
`MidStr` returns up to `ACount` units from `AText`, beginning at one-based position `AStart`. It is the installed Delphi StrUtils ANSI wrapper around `Copy` and leaves the input unchanged.

The example is fictional and source-reviewed only.

**External references**

- [Embarcadero DocWiki: `System.StrUtils.MidStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.MidStr)
- [Free Pascal: `StrUtils.MidStr`](https://www.freepascal.org/docs-html/rtl/strutils/midstr.html)

<small>Created 2026-07-15</small>
