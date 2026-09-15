---
title: "EncodeLineBreaks"
description: "Replaces every CRLF pair and every remaining lone LF with an exact caller-supplied marker while leaving lone CR unchanged."
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - line-breaks
  - crlf
  - lf
---

```Delphi
Function EncodeLineBreaks(aInputString: string; aReplace: string): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EncodeLineBreaks('first' + #13 + #10 + 'second' + #10 + 'third', '{LF}');
  // first{LF}second{LF}third
end;
```

### Usage

`EncodeLineBreaks` replaces every CRLF pair and every remaining lone LF with an exact caller-supplied marker while leaving lone CR unchanged.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aInputString` | `string` | Text whose line breaks are encoded. |
| `aReplace` | `string` | Literal text substituted for each recognised CRLF or LF. Empty text removes them. |
| Result | `string` | Encoded text. |

### Additional Technical Info
`EncodeLineBreaks` converts Windows CRLF pairs and Unix-style lone LF characters to the supplied marker. It returns a new string and leaves the input unchanged. A lone carriage return (`#13`) is not converted.

The example is fictional and source-reviewed only.

**Two-pass implementation**

The function applies Delphi `StringReplace` with `rfReplaceAll` twice:

1. replace every `#13#10` pair with `aReplace`;
2. replace every `#10` still present with `aReplace`.

The ordering prevents a CRLF pair from being counted twice. It also means that a CRLF introduced by `aReplace` during the first pass is subject to the second pass: its LF is replaced, leaving its CR plus another copy of the marker. Avoid markers containing LF when a reversible encoding is required.

Matching is exact and case-sensitive. Existing lone CR characters remain in the result. The routine does not recognise Unicode line separator characters or any textual escape such as `'\\n'` unless that exact text is itself chosen as the marker.

For reversible transport, choose a marker that cannot naturally occur in the data and that contains neither CR nor LF, or escape marker occurrences separately. [`DecodeLineFeeds`](DecodeLineFeeds.md) cannot distinguish an inserted marker from the same text that was already present.

**Related entries**

- [`EncodeLineFeeds`](EncodeLineFeeds.md) replaces CRLF pairs only.
- [`RemoveLineBreaks`](RemoveLineBreaks.md) removes CRLF and remaining LF.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.StringReplace`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StringReplace)
- [Free Pascal: `SysUtils.StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html)

<small>Created 2026-07-15</small>
