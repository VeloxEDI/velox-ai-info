---
title: "URLEncode3"
description: "Applies Velox's non-standard legacy byte encoder while retaining selected punctuation such as comma, equals and parentheses."
sidebar_position: 73
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - url
  - percent-encoding
  - legacy
---

```Delphi
Function URLEncode3( const S : String) : String
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := URLEncode3('filter=(A,B)&active=true');
  // filter=(A,B)%26active=true
end;
```

### Usage

`URLEncode3` applies Velox's non-standard legacy byte encoder while retaining selected punctuation such as comma, equals and parentheses.

**Safe-character set**

```text
A-Z a-z 0-9 _ , . - ~ = ( )
```

Velox tests letters case-insensitively and appends the original character, preserving input case. Space becomes `%20`; plus becomes `%2B`; percent becomes `%25`; ampersand becomes `%26`. An embedded `#0` is processed by the length-based loop and becomes `%00`.

This is not a standard encoder for a complete URL or a universally safe query value. In particular, it deliberately leaves `=` unchanged, so its result can alter query parsing if placed in a context where equals is structural. Use it only when an existing Velox integration or receiving system requires this exact safe-character convention.

**Unicode limitation**

Like [`URLEncode2`](URLEncode2.md), this function does not convert text to UTF-8. It casts each UTF-16 string element to one byte. General Unicode input can consequently be truncated or raise a range-check error, and surrogate pairs are not encoded correctly. Prefer [`URLEncode`](URLEncode.md) for Unicode values.

### Additional Technical Info
`URLEncode3` retains ASCII letters, digits and a Velox-specific punctuation set. Every other input element is converted to `%` followed by a two-digit uppercase hexadecimal byte value.

The example is fictional and source-reviewed only. The raw equals signs, comma and parentheses are a deliberate consequence of this function's safe set; the ampersand is encoded.

**Performance and concurrency**

The result is assembled using repeated string concatenation, which can cause quadratic-style copying for large encoded values. The input is not modified and no shared state is used.

**Related entries**

- [`URLEncode`](URLEncode.md) - Delphi UTF-8 form-style encoder.
- [`URLEncode2`](URLEncode2.md) - byte-oriented variant with the narrower RFC-3986-like ASCII safe set.
- [`URLDecode`](URLDecode.md) - Delphi UTF-8 form-style decoder; it is not guaranteed to reverse arbitrary non-ASCII output from this function.

<small>Created 2026-07-15</small>
