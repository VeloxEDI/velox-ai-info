---
title: "EnsureCorrectPathDelimiter"
description: "Normalises slash direction from a leading web-path heuristic and ensures a trailing delimiter."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - paths
  - delimiter
  - url
---

```Delphi
Function EnsureCorrectPathDelimiter( const S : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EnsureCorrectPathDelimiter('C:/Fictional/Inbound');
  // C:\Fictional\Inbound\
end;
```

### Usage

`EnsureCorrectPathDelimiter` normalises slash direction from a leading web-path heuristic and ensures a trailing delimiter.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Whole path-like string to transform. |

**Returns**

`''` for empty input. Otherwise, a slash-normalised string ending in `/` when the original begins with `/` or case-insensitive `'http'`; all other input is normalised to backslashes and ends in `\`.

**Behaviour**

- `'C:/Folder/File'` becomes `'C:\Folder\File\'`.
- `'/api\orders'` becomes `'/api/orders/'`.
- `'https:\\example.test\api'` starts with `http`, so it becomes `'https://example.test/api/'`.
- `'relative/path'` does not begin `/` or `http`, so it becomes `'relative\path\'`.
- Existing repeated separators are preserved; only slash direction is changed.

**Errors**

There is no normal content-dependent exception. Argument conversion and allocation failures can propagate.

**Usage notes**

Use only when this exact Velox heuristic matches the consumer's contract. For a known Windows path, prefer explicit Windows handling; for a URL, parse and modify the URL path rather than the complete string.

### Additional Technical Info
`EnsureCorrectPathDelimiter` chooses web-style or Windows-style separators from the beginning of `S`, replaces every separator of the other kind, and ensures one selected delimiter at the end. It is a Velox string heuristic, not a path or URL parser.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The function tests `S.StartsWith('/')` case-sensitively or `S.StartsWith('http', True)` case-insensitively. The web branch calls Delphi `StringReplace(S, '\', '/', [rfReplaceAll])`; the other branch replaces every `/` with `\`. It then calls [`IncludeCorrectPathDelimeter`](IncludeCorrectPathDelimeter.md), which applies the same leading heuristic and appends the selected delimiter when absent.

**Edge cases and quirks**

- The web test accepts any case-insensitive prefix `'http'`, including `'httpstuff'`; it does not require `http://` or `https://`.
- A URL is treated as one undifferentiated string. A missing trailing delimiter is appended after a query or fragment, so `https://host/path?x=1` becomes `https://host/path?x=1/`. Parse structured URLs before modifying their path component.
- The function does not validate a scheme, host, drive, UNC share, rootedness, traversal segment or illegal character.
- `.` and `..` are not resolved, duplicate separators are not collapsed, and environment/configuration tokens are not expanded.
- A Windows path deliberately beginning `/` is classified as web-style.

**Side effects**

None.

**Performance and concurrency**

The whole input can be scanned and copied by `StringReplace`, making work linear in length. There is no mutable shared state.

**Related entries**

- [`EnsureWebPathDelimiter`](EnsureWebPathDelimiter.md) always chooses forward slashes and can add a leading slash.
- [`IncludeCorrectPathDelimeter`](IncludeCorrectPathDelimeter.md) appends a delimiter without converting existing separators.
- [`IncludeTrailingPathDelimiter`](IncludeTrailingPathDelimiter.md) follows the platform delimiter only and does not use the web heuristic.

**External references**

- [Embarcadero `TStringHelper.StartsWith`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TStringHelper.StartsWith)
- [Embarcadero `System.SysUtils.StringReplace`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StringReplace)
- [Free Pascal `StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html) - compatible replacement context; the leading heuristic is Velox-owned.

<small>Created 2026-07-15</small>
