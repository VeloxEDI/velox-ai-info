---
title: "URLEncode2"
description: "Applies a legacy ASCII-oriented percent encoder with an RFC-3986-like safe-character set."
sidebar_position: 72
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
Function URLEncode2( const S : String) : String
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := URLEncode2('A value+tax'); // A%20value%2Btax
end;
```

### Usage

`URLEncode2` applies a legacy ASCII-oriented percent encoder with an RFC-3986-like safe-character set.

**Safe-character set**

```text
A-Z a-z 0-9 _ . - ~
```

Velox tests letters case-insensitively but appends the original character, so lower-case input remains lower case. Space becomes `%20`; plus becomes `%2B`; percent becomes `%25`. An embedded `#0` is processed by the length-based loop and becomes `%00` rather than terminating the input.

**Unicode limitation**

This function does **not** encode the source as UTF-8. It casts each UTF-16 string element to one byte before formatting it. It therefore cannot correctly encode general Unicode text: non-ASCII values can be truncated or can raise a range-check error depending on build/runtime checking, and surrogate pairs are processed separately.

Use [`URLEncode`](URLEncode.md) for Unicode data. Reserve `URLEncode2` for an existing integration whose required wire format is known to match this exact legacy behavior.

**Important behavior and quirks**

- The safe set resembles RFC 3986's unreserved ASCII set, but byte handling prevents the function from being a complete standards-compliant encoder.
- Structural URL characters such as `/`, `?`, `&` and `=` are encoded. Apply it to the intended component, not blindly to an already assembled URL.
- The result is built by repeated string concatenation, so large inputs can cause substantially more allocation and copying than [`URLEncode`](URLEncode.md).
- The function does not modify its input or use shared state.

### Additional Technical Info
`URLEncode2` retains ASCII letters, digits, underscore, full stop, hyphen and tilde. Every other input element is converted to `%` followed by a two-digit uppercase hexadecimal byte value.

The example is fictional and source-reviewed only.

**Related entries**

- [`URLEncode`](URLEncode.md) - UTF-8-capable Delphi encoder with a different legacy safe set and `+` for space.
- [`URLEncode3`](URLEncode3.md) - another byte-oriented Velox variant with a more permissive, non-standard safe set.
- [`URLDecode`](URLDecode.md) - UTF-8 form-style decoder; it is not guaranteed to reverse arbitrary non-ASCII output from this function.

<small>Created 2026-07-15</small>
