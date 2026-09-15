---
title: "URLEncode"
description: "Encodes Unicode text as Delphi form-style URL data using UTF-8 percent escapes and plus signs for spaces."
sidebar_position: 71
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - url
  - percent-encoding
  - utf-8
---

```Delphi
Function URLEncode( const S : String) : String
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := URLEncode('Customer & Supplier'); // Customer+%26+Supplier
end;
```

### Usage

`URLEncode` encodes Unicode text as Velox form-style URL data using UTF-8 percent escapes and plus signs for spaces.

**Encoding rules**

ASCII letters and digits are retained. Velox also retains these characters unchanged:

```text
* @ . _ - $ ! ' ( )
```

All other bytes are written as an uppercase `%HH` escape. Consequences include:

- space becomes `+`;
- a literal plus becomes `%2B`;
- `%`, `/`, `?`, `&` and `=` are escaped;
- `~` is escaped by this legacy safe set even though modern RFC 3986 treats it as unreserved; and
- non-ASCII characters are first represented correctly as UTF-8 and can therefore produce several `%HH` sequences.

This safe set and plus-for-space rule make the result suitable for a form/query value convention, not necessarily for every URL component. Encode individual values before assembling the URL; do not encode a complete URL when its structural separators must remain meaningful.

**Important behavior and quirks**

An embedded `#0` terminates processing and silently drops the suffix. Validate inputs if embedded nulls are possible.

Do not encode the same value twice: a percent from the first result is encoded again (`%26` becomes `%2526`). [`URLDecode`](URLDecode.md) is the matching decoding convention.

### Additional Technical Info
`URLEncode` delegates to Delphi `TNetEncoding.URL.Encode`. It converts Unicode text to UTF-8 and percent-encodes bytes outside the installed encoder's legacy safe-character set. Ordinary spaces are encoded as `+`.

The example is fictional and source-reviewed only.

**Performance and concurrency**

Encoding is linear in the number of input code units plus generated UTF-8 bytes and allocates a new result. It uses no mutable shared state.

**Related entries**

- [`URLDecode`](URLDecode.md) - matching form-style decoder.
- [`URLEncode2`](URLEncode2.md) - ASCII-oriented RFC-3986-like safe set, but not Unicode-safe.
- [`URLEncode3`](URLEncode3.md) - non-standard Velox legacy safe set, also not Unicode-safe.

**External references**

- [Embarcadero DocWiki: `System.NetEncoding.TURLEncoding`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.NetEncoding.TURLEncoding)
- [Embarcadero DocWiki: `TNetEncoding.Encode`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.NetEncoding.TNetEncoding.Encode)

<small>Created 2026-07-15</small>
