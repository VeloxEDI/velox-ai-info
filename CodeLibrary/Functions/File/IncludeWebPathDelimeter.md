---
title: "IncludeWebPathDelimeter"
description: "Ensures a non-empty web-path string has a trailing slash and either a leading slash or an http-style prefix."
sidebar_position: 23
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - files
  - web-path
  - delimiter
  - legacy-spelling
---

```Delphi
Function IncludeWebPathDelimeter( const S : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IncludeWebPathDelimeter('api/orders');
  // /api/orders/
end;
```

### Usage

`IncludeWebPathDelimeter` ensures a non-empty web-path string has a trailing slash and either a leading slash or an http-style prefix.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Web-path-like text whose boundary slashes are to be ensured. Existing separators within the path are not converted. |

**Returns**

`''` for empty input. Otherwise a string ending `/` and beginning `/` unless it is treated as an `http...` string.

**Behaviour**

- `'api/orders'` becomes `'/api/orders/'`.
- `'/api/orders'` becomes `'/api/orders/'`.
- `'https://example.test/api'` becomes `'https://example.test/api/'` without an extra leading slash.
- `'api\orders'` becomes `'/api\orders/'`; backslashes within the path remain unchanged.
- Empty input remains empty.

**Important usage notes**

- Relative text becomes root-style text because a leading slash is inserted.
- Any case-insensitive prefix `'http'` suppresses the leading slash, even when the input is not a valid URL.
- A trailing slash is appended after any query string or fragment because no URL components are parsed.
- Duplicate slashes at the start, end or within the path are not collapsed.
- No backslash conversion, URL encoding, validation, canonicalisation or network/file-system access occurs.

**Usage notes**

Use [`EnsureWebPathDelimiter`](EnsureWebPathDelimiter.md) when backslashes within the path must be converted. Parse complete URLs rather than passing queries/fragments through this whole-string helper.

### Additional Technical Info
`IncludeWebPathDelimeter` ensures `/` at the end of a non-empty string, then prepends `/` unless the result already begins `/` or begins case-insensitive `'http'`.

The public identifier is historically misspelled **Delimeter** and must be used exactly in scripts. The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The function first appends `/` if `S[Length(S)] <> '/'`. It then calls Delphi `TStringHelper.StartsWith` to test `/` case-sensitively and `'http'` case-insensitively; when neither matches, it prefixes `/`.

**Side effects**

None.

**Errors**

No normal content-dependent exception; conversion/allocation failures can propagate.

**Performance and concurrency**

Linear in result-copy length, with no mutable shared state.

**Related entries**

- [`EnsureWebPathDelimiter`](EnsureWebPathDelimiter.md) converts internal backslashes before using these boundary rules.
- [`IncludeCorrectPathDelimeter`](IncludeCorrectPathDelimeter.md) selects web or Windows trailing style but does not add a leading delimiter.

**External references**

- [Embarcadero `TStringHelper.StartsWith`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TStringHelper.StartsWith) - exact core prefix testing beneath the Velox-owned boundary rules.

No applicable same-symbol Free Pascal function exists for this Velox-specific, historically misspelled helper.

<small>Created 2026-07-15</small>
