---
title: "IncludeCorrectPathDelimeter"
description: "Appends a forward or backslash selected from the input's leading web-path heuristic."
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - paths
  - delimiter
  - legacy-spelling
---

```Delphi
Function IncludeCorrectPathDelimeter( const S : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IncludeCorrectPathDelimeter('C:\Fictional\Inbound');
  // C:\Fictional\Inbound\
end;
```

### Usage

`IncludeCorrectPathDelimeter` appends a forward or backslash selected from the input's leading web-path heuristic.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Path-like text whose final delimiter is to be ensured. |

**Returns**

`''` for empty input. Otherwise `S` unchanged when it already ends in the selected delimiter, or `S` followed by that delimiter.

**Behaviour**

- `'C:\Folder'` becomes `'C:\Folder\'`.
- `'/api/orders'` becomes `'/api/orders/'`.
- `'https://example.test/api'` becomes `'https://example.test/api/'`.
- `'relative/path'` selects backslash and becomes `'relative/path\'`; existing separators are not converted.
- Empty input remains empty.

**Errors**

No normal content-dependent exception; conversion/allocation failures can propagate.

**Usage notes**

Use [`EnsureCorrectPathDelimiter`](EnsureCorrectPathDelimiter.md) when existing separators must also be normalised. Preserve the misspelled identifier in code for compatibility.

### Additional Technical Info
`IncludeCorrectPathDelimeter` appends one selected trailing delimiter to a non-empty string when it does not already end in that delimiter. The selected delimiter is `/` when the input begins `/` or case-insensitive `'http'`; otherwise it is `\`.

The callable's public name is historically misspelled **Delimeter**. Scripts must use that exact identifier. The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The Velox function selects `/` when `S.StartsWith('/')` or `S.StartsWith('http', True)`; all other strings select `\`. It compares only the final character and appends the selected value when different.

**Edge cases and quirks**

- Any case-insensitive `'http...'` prefix is treated as web-style without validating a scheme.
- Mixed separators are preserved, so the helper can deliberately produce a mixed final delimiter.
- A slash can be appended after a URL query or fragment because the whole string is treated as a path.
- No leading delimiter, path normalisation, traversal resolution, URL encoding, existence check or filesystem action occurs.
- The corrected-spelling [`IncludeTrailingPathDelimiter`](IncludeTrailingPathDelimiter.md) is a different platform-RTL function and is not a rename of this heuristic.

**Side effects**

None.

**Performance and concurrency**

Linear result copy with constant-time boundary tests and no shared state.

**Related entries**

- [`EnsureCorrectPathDelimiter`](EnsureCorrectPathDelimiter.md) normalises separators before calling this helper.
- [`IncludeWebPathDelimeter`](IncludeWebPathDelimeter.md) additionally enforces a leading `/` for non-HTTP text.
- [`IncludeTrailingPathDelimiter`](IncludeTrailingPathDelimiter.md) uses only the current platform delimiter.

**External references**

- [Embarcadero `TStringHelper.StartsWith`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TStringHelper.StartsWith) - the exact core prefix helper used beneath Velox; delimiter selection itself is Velox-owned.

No applicable same-symbol Free Pascal function exists for this Velox-specific, historically misspelled heuristic.

<small>Created 2026-07-15</small>
