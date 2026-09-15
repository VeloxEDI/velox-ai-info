---
title: "SafeSQL"
description: "Builds a single-quoted SQL text literal after deleting NUL characters and doubling apostrophes."
sidebar_position: 51
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - sql
  - escaping
---

```Delphi
Function SafeSQL (const aValue : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := SafeSQL('O''Brien'); // 'O''Brien' as a SQL literal: 'O' + doubled quote + 'Brien'
end;
```

### Usage

`SafeSQL` builds a single-quoted SQL text literal after deleting NUL characters and doubling apostrophes.

**Security and correctness boundaries**

- Prefer parameters in every database API that supports them. Parameters keep data separate from SQL syntax, preserve types and avoid dialect-specific quoting mistakes.
- The name does not guarantee safety for every SQL dialect, character set, collation or execution API. Backslash escapes, Unicode literal prefixes, connection modes and other syntax rules are not considered.
- NUL removal is lossy: two distinct inputs can produce the same SQL literal.
- This function does not validate SQL length, column type, encoding, truncation or semantic constraints.
- Do not use the result as an identifier, table name, column name, keyword or complete SQL fragment. It only attempts to form a text literal.
- Logging the returned value can disclose the original data.

`SafeSQL` and [`SQLString`](SQLString.md) currently have identical behaviour.

### Additional Technical Info
`SafeSQL` converts a typed string into a single-quoted SQL literal. It removes every NUL character, doubles every apostrophe and adds one apostrophe at each end.

The example is fictional and source-reviewed only. In the comment, the returned literal contains outer quotes and the source apostrophe is represented by two adjacent apostrophes.

**Transformation**

```Delphi
'''' + StringReplace(
  StringReplace(aValue, #0, '', [rfReplaceAll]),
  '''', '''''', [rfReplaceAll]) + ''''
```

| Input property | Output behavior |
|---|---|
| Empty string | `''` (a quoted empty SQL string). |
| Apostrophe | Doubled according to common SQL string-literal syntax. |
| NUL | Deleted, not escaped or rejected. |
| Other characters | Copied unchanged between the outer quotes. |

**Performance and concurrency**

The value is scanned twice and intermediate strings are allocated. The function is otherwise stateless.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.StringReplace`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StringReplace)
- [Free Pascal: `StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html) - compatible string operation; SQL behavior remains database-specific.

<small>Created 2026-07-15</small>
