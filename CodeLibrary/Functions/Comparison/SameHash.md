---
title: "SameHash"
description: "Returns true only when two hash strings are exactly equal and at least one is non-empty."
sidebar_position: 26
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - hash
  - string
  - equality
---

```Delphi
Function SameHash(const aHash1, aHash2 : string) : boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := SameHash('A1B2C3', 'A1B2C3');
end;
```

### Usage

`SameHash` returns true only when two hash strings are exactly equal and at least one is non-empty.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aHash1` | `string`, `const` | First already-calculated hash representation. |
| `aHash2` | `string`, `const` | Second already-calculated hash representation. |

**Returns**

`True` only when the strings are exactly equal and are not both empty. Because equal strings have the same emptiness, this is equivalent to requiring two equal non-empty strings.

**Behaviour**

`SameHash('', '')` returns `False`. Empty versus non-empty returns `False`. Matching case, whitespace and prefix characters are all required for a `True` result.

**Errors**

There is no normal content-dependent exception path. Values that cannot be converted to `string` can fail before the function is entered.

**Usage notes**

Standardise the algorithm and textual encoding before calling. For security-sensitive verification, use the purpose-built cryptographic validation path that owns the key, algorithm and constant-time comparison requirements.

### Additional Technical Info
`SameHash` compares two supplied strings exactly, but deliberately refuses to treat two empty strings as a successful hash comparison. It does not calculate, decode or validate a hash.

The example returns `True`. The values are fictional, and the example is source-reviewed rather than executed.

**Implementation**

Velox registers `vxCommonString.SameHash`. The implementation evaluates:

```text
((aHash1 <> '') or (aHash2 <> '')) and (aHash1 = aHash2)
```

The managed-string comparisons are case-sensitive and include every character. No trim, case conversion, hexadecimal parsing, algorithm identifier or constant-time comparison is applied.

**Edge cases and quirks**

- Textual encodings of the same bytes can compare different, for example upper- versus lower-case hexadecimal or padded versus unpadded Base64.
- Leading/trailing whitespace and embedded null characters remain significant managed-string content.
- The function cannot tell whether the strings came from the same hash algorithm, salt, encoding or input canonicalisation process.
- A matching hash is not proof that the original values are trustworthy, nor does this routine prevent deliberate collision or replay scenarios.
- Delphi string equality is not constant-time. Do not use this helper as a timing-resistant credential or message-authentication verifier.

**Side effects**

None.

**Performance and concurrency**

Comparison is proportional to the string length and can stop at the first mismatch. The function allocates no result buffer, uses no mutable shared state and is re-entrant.

**Related entries**

- [`SameText`](SameText.md) performs case-insensitive text equality and is not suitable for normal hash encodings.
- [`IsNullorEmpty`](IsNullorEmpty.md) tests absence without implying a valid comparison.

**External references**

Not applicable. `SameHash` is a Velox-owned string predicate and does not delegate to a named Delphi or Free Pascal hash routine.

<small>Created 2026-07-15</small>
