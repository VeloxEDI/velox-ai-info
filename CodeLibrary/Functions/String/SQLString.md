---
title: "SQLString"
description: "Builds a single-quoted SQL text literal by removing NUL characters and doubling each apostrophe."
sidebar_position: 54
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - sql
  - literal
---

```Delphi
Function SQLString( const S : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := SQLString('Batch ''A''');
  // returns a quoted SQL literal whose two source apostrophes are doubled
end;
```

### Usage

`SQLString` builds a single-quoted SQL text literal by removing NUL characters and doubling each apostrophe.

**Important security and data rules**

- Use database parameters whenever possible. This helper returns text, not a typed parameter, and cannot provide a universal SQL-injection boundary across dialects and connection settings.
- NUL deletion changes data and can create collisions between distinct inputs.
- No database-specific Unicode prefix, escape mode, maximum length, type conversion, truncation or identifier quoting is applied.
- The result is for a text literal only. It must not be used to quote table/column names or arbitrary SQL fragments.
- Sensitive input remains visible in the returned text and can be disclosed by logging.

### Additional Technical Info
`SQLString` returns `S` between apostrophes after deleting all NUL characters and replacing each remaining apostrophe with two apostrophes. Its current native implementation is identical to [`SafeSQL`](SafeSQL.md).

The example is fictional and source-reviewed only.

**Transformation contract**

| Input | Result concept |
|---|---|
| Empty string | Quoted empty literal `''`. |
| Ordinary text | Same text surrounded by apostrophes. |
| Apostrophe | Doubled inside the outer apostrophes. |
| NUL | Removed entirely. |

**Performance and concurrency**

Two replace-all passes and outer concatenation allocate intermediate strings. There is no shared state.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.StringReplace`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StringReplace)
- [Free Pascal: `StringReplace`](https://www.freepascal.org/docs-html/rtl/sysutils/stringreplace.html) - string-operation compatibility only; SQL quoting rules are database-specific.

<small>Created 2026-07-15</small>
