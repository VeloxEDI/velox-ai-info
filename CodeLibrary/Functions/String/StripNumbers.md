---
title: "StripNumbers"
description: "Removes ASCII digits from the source prefix scanned before its first embedded NUL character."
sidebar_position: 64
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - digits
  - nul
---

```Delphi
Function StripNumbers( const S : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StripNumbers('AB12-CD34'); // AB-CD
end;
```

### Usage

`StripNumbers` removes ASCII digits from the source prefix scanned before its first embedded NUL character.

**Important behavior and quirks**

- Embedded NUL terminates the scan. The NUL and complete suffix are omitted, not merely preserved without digits.
- Empty input and a string beginning with NUL return empty.
- All non-ASCII-digit characters before NUL are preserved exactly, including letters, punctuation, whitespace and non-ASCII digits.
- The result is built one code unit at a time and the input is not mutated.

For the inverse operation that collects ASCII digits, see [`ExtractInteger`](ExtractInteger.md).

### Additional Technical Info
`StripNumbers` removes characters in the exact ASCII range `'0'..'9'`. Despite the broader word “numbers”, it does not recognise signs, decimal separators, superscripts or non-ASCII digit scripts.

The example is fictional and source-reviewed only.

**How it works**

Velox views `S` as `PChar`, scans until `P^ = #0`, and appends each code unit that is not an ASCII digit.

**Performance and concurrency**

The scanned prefix is visited once, but repeated concatenation may reallocate the growing result. No shared state is used.

<small>Created 2026-07-15</small>
