---
title: "ExtractHttpLink"
description: "Returns the first regex-shaped candidate whose captured text begins with HTTP, or an empty string when none qualifies."
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - url
  - http
  - regex
  - heuristic
---

```Delphi
function ExtractHttpLink(const aText: string): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ExtractHttpLink('Track at https://example.test/orders?id=42 today');
  // https://example.test/orders?id=42
end;
```

### Usage

`ExtractHttpLink` returns the first regex-shaped candidate whose captured text begins with HTTP, or an empty string when none qualifies.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aText` | `string` | Text in which to search. |
| Result | `string` | First qualifying matched text in source order, preserving its original case, or `''`. |

### Additional Technical Info
`ExtractHttpLink` scans arbitrary text with a built-in regular expression and returns the first captured candidate that begins with `http`, case-insensitively. It returns an empty string if no candidate passes both stages.

This is a heuristic extractor, not a URI parser or security validator. The example is fictional and source-reviewed only; the reserved `.test` domain is used intentionally.

**Current implementation**

Velox calls Delphi `TRegEx.Matches` with `roIgnoreCase` and this fixed pattern:

```regex
(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-&?=%.]+
```

The pattern permits an optional HTTP, HTTPS or FTP scheme and also permits bare dotted candidates. Velox then iterates all matches and accepts only the first whose **captured value** starts with `'http'`. Therefore FTP and bare candidates are discarded, even though the regex recognises them.

**Known limitations**

- The match is not anchored to URI boundaries and can begin or end inside surrounding text.
- The character classes omit valid URI characters such as `:`, `#`, `@` and `+` in many positions, so a valid URI can be truncated or missed.
- Conversely, allowed punctuation can be captured at the end even when it is prose punctuation rather than part of the URI.
- Internationalised host names, bracketed IPv6 addresses, `mailto:`, `file:` and relative links are not supported by the acceptance rule.
- No scheme normalisation, percent-decoding, DNS check or reachability check occurs.
- A malformed but regex-shaped `http...` candidate can be returned.

Treat the result as untrusted input. Parse and validate it for the intended use before making a request, especially where server-side request forgery, local-network access or credentials are relevant.

**External references**

- [Embarcadero DocWiki: `System.RegularExpressions.TRegEx.Matches`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.RegularExpressions.TRegEx.Matches)

<small>Created 2026-07-15</small>
