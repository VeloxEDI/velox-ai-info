---
title: "LeftStr"
description: "Returns up to ACount leading units from an AnsiString by delegating directly to Delphi StrUtils Copy behavior."
sidebar_position: 27
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - left
  - substring
  - ansi
---

```Delphi
Function LeftStr(const AText: AnsiString; const ACount: Integer): AnsiString
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := LeftStr('ABCDEFGHIJ', 4); // ABCD
end;
```

### Usage

`LeftStr` returns up to `ACount` leading units from an `AnsiString`.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `AText` | `AnsiString` | Source text. |
| `ACount` | `Integer` | Maximum leading units to return. |
| Result | `AnsiString` | Leading substring, full input if the count exceeds its length, or empty for a non-positive count. |

Empty input returns empty. No trimming, case conversion or padding occurs. Oversized counts truncate safely to the available source.

**Encoding boundary**

In this build an ANSI string length and copy count are byte/code-unit based. If the active code page represents a character with multiple bytes, a boundary can split that encoding. Avoid arbitrary slicing of international text unless its encoding and valid boundaries are known.

[`MidStr`](MidStr.md) performs the same ANSI-unit slicing from a caller-supplied start position.

### Additional Technical Info
`LeftStr` returns the leading portion of `AText`, limited to `ACount` ANSI string units. It leaves the input unchanged and is equivalent in the installed terminal to `Copy(AText, 1, ACount)`.

The example is fictional and source-reviewed only.

**External references**

- [Embarcadero DocWiki: `System.StrUtils.LeftStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.LeftStr)
- [Free Pascal: `StrUtils.LeftStr`](https://www.freepascal.org/docs-html/rtl/strutils/leftstr.html)

<small>Created 2026-07-15</small>
