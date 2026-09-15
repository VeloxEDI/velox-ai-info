---
title: "DecodeSoundexInt"
description: "Decodes an integer produced by SoundexInt into its Soundex code string."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - soundex
  - phonetic
  - decoding
---

```Delphi
Function DecodeSoundexInt( AValue : Integer) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Encoded: Integer;
begin
  Encoded := SoundexInt('Robert', 4);
  Value := DecodeSoundexInt(Encoded);
end;
```

### Usage

`DecodeSoundexInt` decodes an integer produced by SoundexInt into its Soundex code string.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `Integer` | Encoded integer produced by Velox `SoundexInt`. Arbitrary or negative integers are outside the supported round-trip contract. |

**Returns**

The reconstructed Soundex code. For normal encoded values, the intended length is carried in the value and is between one and eight characters.

**Behaviour**

For valid encodings of ordinary lengths, the result is the normalised Soundex code, not the source spelling. The result can be passed to equality or grouping logic, but Soundex collisions are expected and must not be treated as proof that names are identical.

**Errors**

Valid values produced by `SoundexInt` have no expected exception path. Invalid negative or out-of-contract values can cause range/conversion failures or meaningless output; the function does not report a dedicated validation error.

**Usage notes**

Keep the encoded integer and decoder paired, and avoid the decoder for requested Soundex lengths one and two. If a readable code is required for interchange or diagnosis, storing the Soundex string itself avoids dependence on this integer layout and exposes the short-code quirks directly.

### Additional Technical Info
`DecodeSoundexInt` reconstructs a Soundex code string from the integer representation returned by [`SoundexInt`](SoundexInt.md). It decodes the compact representation; it cannot recover the original input word, and different words can share the same Soundex code.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

Velox registers `System.StrUtils.DecodeSoundexInt` directly. Current Delphi source performs the reverse of the mixed-radix integer encoding:

1. take `AValue mod 9` as the encoded output length, then divide by 9;
2. recover Soundex digit positions from the end by repeated base-7 remainder/division operations;
3. for lengths greater than two, recover the remaining pre-digit component in base 26; and
4. map the remaining quotient to the initial letter starting at `A`.

The routine assumes that the integer was produced by the matching Delphi `SoundexInt` implementation. It does not validate that assumption.

**Edge cases and quirks**

- `SoundexInt('')` produces zero in the current RTL, while `DecodeSoundexInt(0)` reconstructs `A`. Empty input therefore does not round-trip to an empty code.
- The current upstream decoder has short-code quirks. Its base-26 recovery branch runs only when the encoded length is greater than two, but the following division by 26 is unconditional. A valid one-character encoding therefore decodes as `A` regardless of its encoded initial, and a valid two-character encoding loses its digit and decodes as only the initial letter. Lengths three through eight follow the matching encoder layout.
- Because the encoded length is `AValue mod 9`, arbitrary integers can request nonsensical reconstruction states.
- Arbitrary large positive values can yield multi-character decimal fragments or a first character outside `A` through `Z`; the function does not constrain them to a valid Soundex alphabet.
- Negative values can produce negative remainders and an invalid `Chr` input. The exact failure or output can depend on Delphi range-check configuration. Do not pass them.
- This operation is tied to Delphi's encoding layout. Do not persist the integer as an implementation-independent phonetic data standard without versioning that contract.

**Side effects**

None. The function allocates only its result string.

**Performance and concurrency**

The valid encoded length is small, so decoding is bounded and effectively constant-time. The function uses no shared mutable state.

**Related entries**

- [`SoundexInt`](SoundexInt.md) creates the matching integer representation.
- [`DecodeSoundexWord`](DecodeSoundexWord.md) decodes the fixed four-character Word representation.
- [`SoundexWord`](SoundexWord.md) creates that fixed Word representation.

**External references**

- [Embarcadero `System.StrUtils.DecodeSoundexInt`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.DecodeSoundexInt)
- [Free Pascal `DecodeSoundexInt`](https://www.freepascal.org/docs-html/rtl/strutils/decodesoundexint.html) — compatible API context; current Delphi source defines Velox's encoded layout and quirks.

<small>Created 2026-07-15</small>
