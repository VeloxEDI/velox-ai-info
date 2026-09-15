---
title: "String"
description: "Functions for constructing, splitting, searching, filtering, casing, formatting, tokenising and encoding text."
sidebar_position: 23
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - text
  - regex
  - encoding
---

The String group contains Velox helpers, modified PascalScript standard operations and selected Delphi RTL functions. Use it for text construction and mutation, substring searches, character filtering, case conversion, token lists, regular expressions, SQL-literal compatibility and URL-style encoding.

The implementation family matters. A familiar Delphi name can use modified runtime dispatch, while a Velox name can contain compatibility behavior or a known defect. Each child page traces the callable to its real terminal source.

## Choosing an entry

- Use intrinsic pages such as [`Copy`](String/Copy.md), [`Delete`](String/Delete.md), [`Insert`](String/Insert.md), [`Length`](String/Length.md) and [`SetLength`](String/SetLength.md) for their effective compiler-injected syntax and actual-type restrictions.
- Use [`Pos`](String/Pos.md), [`PosEx`](String/PosEx.md), `Index...` or `LastDelimiter` according to one-based/zero-based results, substring versus delimiter-set semantics and required case behavior.
- Use [`SplitString`](String/SplitString.md) for a dynamic array, or the `StringToToken...` family for a caller-owned `TStringList` with the documented blank/marker rules.
- Use the `RegEx...` entries only after reviewing default non-empty matching, first-match/group behavior and the current [`RegExReplace`](String/RegExReplace.md) defect.
- Use [`URLEncode`](String/URLEncode.md) for UTF-8 form-style encoding. `URLEncode2` and `URLEncode3` are incompatible legacy byte-oriented variants.

## String representation and positions

String indexes are generally one-based, while array/list indexes can be zero-based and no-match sentinels vary by entry. Positions and lengths count Delphi/PascalScript string elements, not user-perceived Unicode grapheme clusters. A slice or reversal can split surrogate pairs and combining sequences.

Case conversion is also implementation-specific. Normal `UpperCase`/`LowerCase` are ASCII-only on the ordinary current String path, WideString branches can use Windows locale behavior, and `Ansi...` helpers cross code-page and locale boundaries. Do not use simple casing as a language-neutral identity or security canonicalization rule.

## NUL, encoding and external-text safety

Some helpers are length-aware and preserve embedded `#0`; others scan through `PChar` and silently stop at the first NUL. The affected child pages state that boundary explicitly. URL, ANSI and legacy byte helpers also use different encodings and safe-character sets.

Text helpers do not make content safe for its destination. [`SafeSQL`](String/SafeSQL.md) and [`SQLString`](String/SQLString.md) build lossy quoted literal fragments and are not substitutes for database parameters. URL encoding is not URL validation, and regex-shaped HTTP extraction is not authorization against SSRF or untrusted destinations.

## Ownership, allocation and known naming defects

`StringToToken...` returns native `TStringList` objects that the caller must free; array-output procedures replace caller storage. Repetition, replacement, regex and concatenation can allocate output much larger than input, so bound untrusted counts and patterns.

Several names are deliberately called out on their pages: `LeftPad` appends, `RightPad` prepends, `StringIndex` reverses its case flag, `IdentifierEncode` appends rather than prepends its intended prefix in one path, `Join` can add a leading delimiter after skipped blanks, and `RegExReplace` discards its computed result. Do not code from the name alone.
