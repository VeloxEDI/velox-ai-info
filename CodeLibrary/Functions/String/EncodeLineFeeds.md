---
title: "EncodeLineFeeds"
description: "Replaces Windows CRLF pairs with an exact marker but, despite its name, leaves lone LF and lone CR characters unchanged."
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - line-breaks
  - crlf
  - implementation-quirk
---

```Delphi
Function EncodeLineFeeds(aInputString: string; aReplace: string): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EncodeLineFeeds('first' + #13 + #10 + 'second', '{LF}');
  // first{LF}second
end;
```

### Usage

`EncodeLineFeeds` replaces Windows CRLF pairs with an exact marker but, despite its name, leaves lone LF and lone CR characters unchanged.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aInputString` | `string` | Text whose CRLF pairs are encoded. |
| `aReplace` | `string` | Literal replacement text. Empty text removes CRLF pairs. |
| Result | `string` | Input with all exact CRLF pairs replaced. |

Velox is one case-sensitive Velox `StringReplace` call with `rfReplaceAll`. Replacements are non-overlapping and non-recursive. Existing Unix LF-only line endings pass through unchanged, which can leave a mixed-line-ending result.

Use [`EncodeLineBreaks`](EncodeLineBreaks.md) when both CRLF and lone LF must be converted. Use this narrower helper only when preserving lone LF is intentional. If the result will later be passed to [`DecodeLineFeeds`](DecodeLineFeeds.md), ensure that `aReplace` cannot occur as ordinary input data; the decoder has no escape or provenance information.

### Additional Technical Info
`EncodeLineFeeds` replaces every Windows CRLF pair (`#13#10`) with `aReplace`. Contrary to the broad function name, it does **not** replace a lone line-feed character and does not replace a lone carriage return.

The example is fictional and source-reviewed only.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.StringReplace`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StringReplace)
- [Free Pascal: `SysUtils.StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html)

<small>Created 2026-07-15</small>
