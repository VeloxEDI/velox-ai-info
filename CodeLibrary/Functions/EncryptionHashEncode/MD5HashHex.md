---
title: "MD5HashHex"
description: "Returns a hexadecimal MD5 digest of non-empty UTF-8 text."
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - md5
  - hash
  - hexadecimal
---

```Delphi
Function MD5HashHex( const Input : String) : String
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := MD5HashHex('fictional integration payload');
  // Non-empty input produces 32 lowercase hexadecimal characters.
end;
```

### Usage

`MD5HashHex` returns a hexadecimal MD5 digest of non-empty UTF-8 text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Input` | `String`, `const` | Text to hash. Non-empty input is converted to UTF-8 without trimming or Unicode normalisation. |

**Returns**

For non-empty input, 32 lowercase hexadecimal characters using `0-9` and `a-f`. Empty input returns `''`, not the standard MD5 text for an empty byte sequence.

**Behaviour**

- Output is deterministic, unsalted and unkeyed.
- Input is text encoded as UTF-8; this is not a raw-byte or file hashing helper.
- Casing is part of the public representation: alphabetic digits are lowercase.
- No prefix, separator or line break is added.

**Errors**

UTF-8 conversion, allocation and hash failures propagate. There is no error flag or sentinel other than the deliberate empty-input result.

### Additional Technical Info
`MD5HashHex` calculates MD5 over a string's UTF-8 bytes and returns the 16-byte digest as 32 lowercase hexadecimal characters. Use it only when a legacy integration contract explicitly requires MD5 text in this form.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox first exits with an empty result when `Input = ''`. Otherwise it calls the installed Delphi 37.0 string overload `System.Hash.THashMD5.GetHashString`. Delphi creates an MD5 record, feeds it `TEncoding.UTF8.GetBytes(Input)`, finalises the 16-byte digest and converts each nibble through its lowercase hexadecimal table.

**Edge cases and quirks**

- Empty input returns `''` because of the Velox wrapper, even though the Delphi terminal can hash an empty string.
- MD5 has practical collision attacks and is unsuitable for security-sensitive identity, integrity, password or authentication decisions.
- [`LoadAndHashFile`](LoadAndHashFile.md) and [`MD5HashStream`](MD5HashStream.md) use shipped Indy and emit uppercase hexadecimal; string comparison is therefore case-sensitive unless the caller normalises a representation intentionally.
- Free Pascal `MD5String` hashes `RawByteString` bytes. Its input bytes can differ from Velox UTF-8 for non-ASCII text.
- Visually identical Unicode strings are not normalised and can produce different results.

**Side effects**

None beyond temporary managed memory.

**Performance and concurrency**

Time and temporary input storage are linear in UTF-8 byte length. Each call uses local hash state, so independent calls do not share mutable state.

**Remarks**

When persisting or comparing the result, record `MD5`, UTF-8 and lowercase hexadecimal as part of the data contract. Hexadecimal casing does not change the digest bytes, but it does affect ordinary string equality.

**Related entries**

- [`MD5Hash`](MD5Hash.md) returns the same digest bytes as padded Base64.
- [`MD5HashStream`](MD5HashStream.md) hashes remaining stream bytes and returns uppercase hexadecimal.
- [`SHA1HashHex`](SHA1HashHex.md) provides the corresponding legacy SHA-1 representation.
- [`HashString`](HashString.md) provides a stronger SHA-384 text fingerprint.

**External references**

- [Embarcadero DocWiki: `THashMD5.GetHashString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Hash.THashMD5.GetHashString) - the exact Delphi core terminal overload family reached by Velox.
- [Free Pascal: `MD5String`](https://www.freepascal.org/daily/packages/hash/md5/md5string.html) - analogous digest creation from `RawByteString` bytes.
- [Free Pascal: `MD5Print`](https://www.freepascal.org/daily/packages/hash/md5/md5print.html) - analogous conversion of an MD5 digest to text.

<small>Created 2026-07-15</small>
