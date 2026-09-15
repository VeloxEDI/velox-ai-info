---
title: "AddQuotes"
description: "Wraps text in a chosen quote character and doubles that character unless both outer quotes already exist."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - quotes
  - escaping
---

```Delphi
Function AddQuotes(const aValue: string; aChar: Char): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := AddQuotes('O''Brien', ''''); // 'O''Brien' enclosed in apostrophes
end;
```

### Usage

`AddQuotes` wraps text in a chosen quote character and doubles that character unless both outer quotes already exist.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `string` | Text to inspect, escape and enclose. |
| `aChar` | `Char` | Character used for both the outer pair and embedded-character doubling. It need not be an apostrophe or quotation mark. |

**Return value**

Returns either the original already-wrapped value or a new string formed as:

```text
aChar + ReplaceEvery(aValue, aChar, aChar + aChar) + aChar
```

An empty value therefore returns two copies of `aChar`.

### Additional Technical Info
`AddQuotes` encloses a string in the supplied character. Before adding the outer pair, it doubles every occurrence of that character so quote-delimited text can represent an embedded quote. If the value already begins **and** ends with the character, the function returns it unchanged.

The example is fictional and source-reviewed only.

**Implementation and exact edge behaviour**

The Velox helper first tests `aValue[1]` and `aValue[Length(aValue)]`, with an explicit empty-string guard. Only when **both** ends equal `aChar` does it bypass all processing. It does not inspect whether the inner text is correctly escaped.

Otherwise it calls Delphi `StringReplace` with `rfReplaceAll` and `rfIgnoreCase`, then adds the outer characters. Case-insensitive matching has no practical effect when the old pattern is a single punctuation quote, but can matter if a letter is supplied as `aChar`.

Partially quoted input is not normalised. For example, an input that has only a leading apostrophe has that existing apostrophe doubled before a new leading and trailing apostrophe are added. Validate or strip one-sided delimiters before calling the function.

This is a mechanical quoting helper, not a general SQL, CSV, JSON or Pascal string encoder. It does not apply the complete escaping rules of those formats. Use the format-specific serializer or parameter binding at a trust boundary.

**Related entries**

- [`StripQuotes`](StripQuotes.md) removes one recognised outer quote pair.
- [`SafeSQL`](SafeSQL.md) performs Velox's separate SQL-text escaping operation; database parameters remain preferable.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.StringReplace`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StringReplace)
- [Free Pascal: `SysUtils.StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html)

<small>Created 2026-07-15</small>
