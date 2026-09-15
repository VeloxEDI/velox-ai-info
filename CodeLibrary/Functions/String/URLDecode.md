---
title: "URLDecode"
description: "Decodes Delphi form-style URL text, including plus signs and percent-encoded UTF-8 bytes."
sidebar_position: 70
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - url
  - percent-decoding
  - utf-8
---

```Delphi
Function URLDecode( const S : String) : String
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := URLDecode('Customer+%26+Supplier'); // Customer & Supplier
end;
```

### Usage

`URLDecode` decodes Velox form-style URL text, including plus signs and percent-encoded UTF-8 bytes.

**Important behavior and quirks**

An embedded `#0` therefore terminates decoding and silently drops the suffix. Reject or handle embedded nulls before calling it when the input is not trusted.

Its unescaped non-ASCII branch converts one UTF-16 element at a time and does not combine a supplementary character's surrogate pair. Do not rely on unescaped supplementary Unicode round-tripping through this decoder; use the matching [`URLEncode`](URLEncode.md), which emits its UTF-8 bytes as `%HH` sequences, or supply already valid percent-encoded UTF-8.

Decoded data can contain control characters, separators or path characters. URL decoding does not validate a path, authorise a resource, make text safe for SQL/HTML, or enforce an expected character set. Validate the decoded value for its destination.

### Additional Technical Info
`URLDecode` delegates to Delphi `TNetEncoding.URL.Decode`. It converts `+` to an ordinary space, decodes `%HH` byte escapes, then interprets the decoded byte sequence as UTF-8 text.

The example is fictional and source-reviewed only.

**Decoding rules**

- `+` becomes space. To retain a literal plus, the input must contain `%2B`.
- Each valid `%HH` escape contributes one byte; consecutive escaped bytes can therefore reconstruct a multi-byte UTF-8 character.
- Unescaped non-ASCII BMP characters are converted to UTF-8 bytes before the final UTF-8 decode.
- A doubled percent sequence `%%` is treated as a literal percent by this installed implementation.
- An incomplete or otherwise malformed percent escape raises Delphi `EConvertError`; the function does not return a partial result.

Because plus means space, this is HTML-form/query-component style decoding rather than a general operation that can be applied blindly to an entire URL. Decode only the intended component and only once. A second decode can turn data such as `%252F` into `/` and change its meaning.

**Errors and performance**

Malformed escapes raise `EConvertError`. The implementation allocates intermediate byte storage and a decoded string, with time proportional to input length. It uses no mutable shared state.

**Related entries**

- [`URLEncode`](URLEncode.md) - matching Delphi form-style encoder.
- [`URLEncode2`](URLEncode2.md) and [`URLEncode3`](URLEncode3.md) - legacy Velox byte-oriented alternatives with different safe-character sets.

**External references**

- [Embarcadero DocWiki: `System.NetEncoding.TURLEncoding`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.NetEncoding.TURLEncoding)
- [Embarcadero DocWiki: `TNetEncoding.Decode`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.NetEncoding.TNetEncoding.Decode)

<small>Created 2026-07-15</small>
