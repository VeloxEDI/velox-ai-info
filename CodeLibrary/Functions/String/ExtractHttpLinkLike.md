---
title: "ExtractHttpLinkLike"
description: "Returns the first regex-shaped candidate included by one case-insensitive prefix and excluded by another."
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - url
  - regex
  - prefix
  - heuristic
---

```Delphi
function ExtractHttpLinkLike(const aLike, aNotLike, aText: string): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ExtractHttpLinkLike(
    'https://',
    'https://internal.',
    'See https://internal.example/a and https://public.example/b');
  // https://public.example/b
end;
```

### Usage

`ExtractHttpLinkLike` returns the first regex-shaped candidate included by one case-insensitive prefix and excluded by another.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aLike` | `string` | Required case-insensitive prefix of the captured candidate. Empty means every candidate passes the inclusion test. |
| `aNotLike` | `string` | Disallowed case-insensitive prefix. **Empty rejects every candidate**, because every string starts with the empty prefix. |
| `aText` | `string` | Text to scan. |
| Result | `string` | First qualifying captured candidate in source order, preserving original case, or `''`. |

### Additional Technical Info
`ExtractHttpLinkLike` scans text with Velox's fixed link-shaped regular expression, then returns the first match that starts with `aLike` and does **not** start with `aNotLike`. Both prefix comparisons ignore case. Empty string is returned when no candidate qualifies.

The example is fictional and source-reviewed only. The names `aLike` and `aNotLike` do not mean SQL `LIKE`, wildcard or regular-expression patterns.

**Selection algorithm**

The built-in regex is:

```regex
(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-&?=%.]+
```

It is evaluated with `roIgnoreCase`. For each match, Velox performs the equivalent of:

```Delphi
Match.StartsWith(aLike, True) and
not Match.StartsWith(aNotLike, True)
```

The first match satisfying that expression is returned. The exclusion is applied only to the beginning of the match; it cannot exclude a substring elsewhere. A broader excluded prefix wins whenever both prefixes match.

**Important empty-prefix trap**

Do not pass `''` as `aNotLike` to mean “no exclusion.” Delphi `StartsWith('', True)` is true for every candidate, so the `not` condition is always false and the function always returns empty. Use a non-empty prefix that cannot match if exclusion is not needed, or use [`ExtractHttpLink`](ExtractHttpLink.md) for ordinary HTTP extraction.

The same heuristic limitations as `ExtractHttpLink` apply: valid URIs can be truncated or missed; invalid candidates can be returned; and no URI, host, reachability or security validation occurs. If `aLike` is empty and the exclusion is non-empty, the first non-excluded match may be bare or FTP because the regular expression itself allows those forms.

**External references**

- [Embarcadero DocWiki: `System.RegularExpressions.TRegEx.Matches`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.RegularExpressions.TRegEx.Matches)

<small>Created 2026-07-15</small>
