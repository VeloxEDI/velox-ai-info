---
title: "EnsureWebPathDelimiter"
description: "Converts backslashes to forward slashes and ensures leading and trailing web delimiters."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - web-path
  - delimiter
  - url
---

```Delphi
Function EnsureWebPathDelimiter( const S : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EnsureWebPathDelimiter('api\orders');
  // /api/orders/
end;
```

### Usage

`EnsureWebPathDelimiter` converts backslashes to forward slashes and ensures leading and trailing web delimiters.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Whole path-like or URL-like text to transform. |

**Returns**

`''` for empty input. Otherwise, forward-slash text ending in `/` and beginning in `/` unless it is classified as an `http...` string.

**Behaviour**

- `'api\orders'` becomes `'/api/orders/'`.
- `'/api/orders'` becomes `'/api/orders/'`.
- `'https:\\example.test\api'` becomes `'https://example.test/api/'`.
- Existing repeated forward slashes are retained.
- Empty input stays empty rather than becoming `'/'`.

**Errors**

There is no normal content-dependent exception. Conversion/allocation failures can propagate.

### Additional Technical Info
`EnsureWebPathDelimiter` replaces every backslash with `/`, adds a trailing `/`, and adds a leading `/` unless the resulting text already begins with `/` or case-insensitive `'http'`. It operates on text and does not parse or request a URL.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The function calls Delphi `StringReplace(S, '\', '/', [rfReplaceAll])`, then [`IncludeWebPathDelimeter`](IncludeWebPathDelimeter.md). That helper appends `/` when needed and prepends `/` unless `StartsWith('/')` or case-insensitive `StartsWith('http', True)` succeeds.

**Edge cases and quirks**

- Ordinary relative text is changed into leading-slash/root-style text. Use [`EnsureCorrectPathDelimiter`](EnsureCorrectPathDelimiter.md) if a Windows-relative result is intended.
- Any case-insensitive string beginning `'http'` avoids the added leading slash, even when it is not a valid HTTP URL.
- Query strings and fragments are not parsed. The trailing slash is appended to the end of the complete input, potentially after `?query` or `#fragment`.
- The function does not encode spaces/reserved URL characters, validate percent escapes, resolve dot segments or separate scheme/authority/path.
- Backslashes are replaced everywhere, including query/fragment data where that might not be intended.

**Side effects**

None.

**Performance and concurrency**

Linear in input length with result allocation; no mutable shared state.

**Remarks**

This helper is suitable for Velox web-path conventions, not general URL canonicalisation. Parse a structured URL before changing its path, query or fragment independently.

**Related entries**

- [`IncludeWebPathDelimeter`](IncludeWebPathDelimeter.md) adds boundary slashes without converting backslashes.
- [`EnsureCorrectPathDelimiter`](EnsureCorrectPathDelimiter.md) chooses web or Windows style from a leading heuristic.

**External references**

- [Embarcadero `TStringHelper.StartsWith`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TStringHelper.StartsWith)
- [Embarcadero `System.SysUtils.StringReplace`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StringReplace)
- [Free Pascal `StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html) - compatible replacement context; boundary rules are Velox-owned.

<small>Created 2026-07-15</small>
