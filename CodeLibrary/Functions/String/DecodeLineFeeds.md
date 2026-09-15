---
title: "DecodeLineFeeds"
description: "Replaces every exact occurrence of a caller-supplied marker with a Windows CRLF line break."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - line-breaks
  - crlf
  - decoding
---

```Delphi
Function DecodeLineFeeds(aInputString: string; aReplace: string): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DecodeLineFeeds('first{LF}second', '{LF}');
  // Result is 'first' + #13 + #10 + 'second'.
end;
```

### Usage

`DecodeLineFeeds` replaces every exact occurrence of a caller-supplied marker with a Windows CRLF line break.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aInputString` | `string` | Text containing the marker to expand. |
| `aReplace` | `string` | Exact, case-sensitive marker to replace. Despite its name, this is the old pattern, not the replacement output. |
| Result | `string` | Input with each marker replaced by CRLF. |

**Exact behaviour**

The Velox helper is one Velox `StringReplace` call with `rfReplaceAll`. Matching is case-sensitive, literal, left-to-right and non-recursive. If a replacement creates text resembling the marker, that new text is not scanned again.

An empty `aReplace` returns the original input unchanged in Velox. Existing CRLF, lone CR and lone LF characters that are not equal to the selected marker remain untouched. This is therefore not a general backslash/JSON/URL decoder.

Choose a marker that cannot occur as ordinary data, or escape the data at the format boundary. Otherwise legitimate occurrences are indistinguishable and will become line breaks.

### Additional Technical Info
`DecodeLineFeeds` replaces every non-overlapping, exact occurrence of `aReplace` in `aInputString` with the two-character Windows CRLF sequence (`#13#10`). It returns a new string and leaves the input unchanged.

The example is fictional and source-reviewed only.

**Related entries**

- [`EncodeLineBreaks`](EncodeLineBreaks.md) converts CRLF and lone LF to a marker.
- [`EncodeLineFeeds`](EncodeLineFeeds.md) converts CRLF pairs only.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.StringReplace`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StringReplace)
- [Free Pascal: `SysUtils.StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html)

<small>Created 2026-07-15</small>
