---
title: "TitleCase"
description: "Applies Velox's fixed English-oriented title-casing rules to space-delimited words."
sidebar_position: 67
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - title-case
  - proper-case
---

```Delphi
Function TitleCase( const aString : String) : String
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := TitleCase('AN INTRODUCTION TO EDI'); // An Introduction to Edi
end;
```

### Usage

`TitleCase` applies Velox's fixed English-oriented title-casing rules to space-delimited words.

**Important behavior and quirks**

- Input is split on ordinary spaces by [`SplitString`](SplitString.md). Leading and trailing whitespace is removed, repeated spaces collapse and the result is rejoined with one space.
- Override punctuation must be its own space-delimited token. `part: next` does not trigger the `:` rule; `part : next` does.
- Every token is first passed through locale-dependent `AnsiLowerCase`. Except for fixed all-uppercase values, only the first ASCII `a` through `z` found in the token is then uppercased.
- The fixed list does not include business acronyms such as `EDI`, personal-name rules, apostrophe rules or hyphenated-word rules.
- Empty or whitespace-only input returns empty.

Use `ProperCase` when a mapping needs domain-specific acronyms or different exception words.

### Additional Technical Info
`TitleCase` calls [`ProperCase`](ProperCase.md) with fixed Velox rule lists. It is intended for simple English-oriented labels and titles, not linguistically complete title casing.

The example is fictional and source-reviewed only. `EDI` becomes `Edi` because it is not in the function's fixed all-uppercase list.

**Fixed rule lists**

| Rule | Values |
|---|---|
| Keep lower case in an unforced middle position | `a`, `an`, `and`, `but`, `by`, `for`, `in`, `into`, `is`, `of`, `off`, `on`, `onto`, `or`, `the`, `to` |
| Capitalise the following token | `-`, `:`, `;` |
| Force all upper case | `a.m.`, `p.m.`, `b.c.`, `a.d.` |

The first and last token are always capitalised unless the token is in the all-uppercase list. A lower-case exception is also overridden when its preceding original token exactly matches one of the three standalone punctuation tokens.

**Performance and concurrency**

The implementation allocates token and rule arrays for each call, then performs linear comparisons against the small fixed lists. It uses no mutable shared state, although locale-sensitive casing can depend on the process environment.

**Related entries**

- [`ProperCase`](ProperCase.md) - the configurable implementation used by this function.
- [`SplitString`](SplitString.md) - the exact space tokeniser used by `ProperCase`.

<small>Created 2026-07-15</small>
