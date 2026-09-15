---
title: "MatchPattern"
description: "Matches text against Velox's case-insensitive asterisk and question-mark wildcard algorithm after truncating each input to 400 characters."
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - wildcard
  - pattern
  - text
---

```Delphi
Function MatchPattern( const Source, Pattern : String) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := MatchPattern('orders.csv', '*.CSV');
end;
```

### Usage

`MatchPattern` matches text against Velox's case-insensitive asterisk and question-mark wildcard algorithm after truncating each input to 400 characters.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Source` | `String`, `const` | Text to test. Only the first 400 characters participate. |
| `Pattern` | `String`, `const` | Complete wildcard pattern. Only the first 400 characters participate. |

**Returns**

`True` when the complete truncated source is consumed by the complete truncated pattern; otherwise `False`.

**Behaviour**

The match is anchored at both ends. Pattern `*.CSV` can match `orders.csv`, but pattern `orders` does not match `orders.csv`. Wildcards have no escape syntax: a literal asterisk or question mark cannot be distinguished from the wildcard by this function.

Both empty strings match. An empty pattern does not match non-empty source. The one-character pattern `*` matches every source after truncation.

**Errors**

Ordinary input does not raise a validation exception. A pathological backtracking pattern can exhaust stack or processing resources; treat user-controlled patterns as bounded input rather than a free-form search language.

**Usage notes**

Use this function for small Velox wildcard rules whose 400-character and ASCII-case contracts are acceptable. It is not equivalent to a filesystem glob or regular expression.

### Additional Technical Info
`MatchPattern` performs a complete, case-insensitive wildcard match. In ordinary patterns, an asterisk (`*`) matches zero or more characters and a question mark (`?`) matches exactly one character. All other characters must match literally. The current recursive implementation has a documented exception for repeated trailing asterisks when the source has already ended.

The example returns `True`. It uses fictional text, is source-reviewed and is not executed by the documentation workflow.

**Implementation**

Velox registers its own `vxCommon.MatchPattern` implementation. It copies each input into a local fixed `PChar` buffer with `System.SysUtils.StrPLCopy(..., 400)`, converts ASCII `a` through `z` in both buffers to uppercase with the `PWideChar` overload of `StrUpper`, and then calls a recursive matcher:

1. a remaining pattern of exactly `*` succeeds immediately;
2. end of source succeeds only when the pattern has also ended;
3. `*` first tries consuming no source character, then retries after consuming one;
4. `?` consumes one source and one pattern character; and
5. a literal consumes one character only when the uppercased code units are equal.

The uppercasing step is ASCII-only in the current Delphi RTL. It is not a locale-aware or full-Unicode case fold.

**Edge cases and quirks**

- Source and pattern are independently truncated to 400 UTF-16 code units before matching. Differences after that boundary are invisible and can produce a result that would not apply to the original complete strings.
- An embedded null character terminates the `PChar` view. Content after the first null is ignored even when it occurs before character 400.
- Case-insensitivity covers only ASCII letters. Non-ASCII characters must have exactly equal UTF-16 code units.
- Matching is by UTF-16 code unit, not Unicode grapheme. `?` can consume one half of a surrogate pair.
- A remaining run of two or more asterisks does not match an empty suffix because the end-of-source check occurs before wildcard dispatch. For example, `MatchPattern('', '**')` and `MatchPattern('A', 'A**')` are `False`; use one trailing `*` instead.
- `*` uses naive backtracking. Several stars followed by a late mismatch can explore many recursive branches even though each input is capped at 400 characters.
- There are no character classes, alternation, path-separator rules or regular-expression constructs.

**Side effects**

None. Both buffers and all matcher state are local to the call.

**Performance and concurrency**

Copying and uppercasing are linear in the truncated input sizes. Literal and `?` patterns are linear; `*` backtracking can be exponential in an adverse case. The function uses no shared mutable state and is otherwise re-entrant.

**Related entries**

- [`MatchText`](MatchText.md) checks membership in a case-insensitive list without wildcards.
- [`SameText`](SameText.md) compares two complete strings without wildcard syntax.
- [`StartsText`](StartsText.md) tests one case-insensitive prefix.
- [`ContainsText`](ContainsText.md) searches for a case-insensitive substring.

**External references**

- [Embarcadero `System.SysUtils.StrPLCopy`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StrPLCopy)
- [Embarcadero `System.SysUtils.StrUpper`](https://docwiki.embarcadero.com/Libraries/Athens/en/API:System.SysUtils.StrUpper)
- [Free Pascal `StrPLCopy`](https://www.freepascal.org/docs-html/rtl/sysutils/strplcopy.html)
- [Free Pascal `StrUpper`](https://www.freepascal.org/docs-html/rtl/strings/strupper.html) - compatibility context only; Velox's recursive matcher and 400-character contract are product-specific.

<small>Created 2026-07-15</small>
