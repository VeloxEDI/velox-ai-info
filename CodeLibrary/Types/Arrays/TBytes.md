---
title: TBytes
description: Stores a zero-based managed sequence of raw 8-bit values for binary Velox data boundaries.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, array, bytes, binary, buffer]
---

```Delphi
TBytes = array of Byte
```

### Example

```Delphi
procedure BuildHeader(var Data: TBytes);
begin
  SetLength(Data, 4);
  Data[0] := $56; // V
  Data[1] := $58; // X
  Data[2] := 1;   // version
  Data[3] := 0;   // flags
end;
```

### Usage

`TBytes` stores a zero-based managed sequence of raw 8-bit values for binary Velox data boundaries.

#### Allocation and indexing

- `SetLength(Data, N)` allocates `N` byte elements. New elements are initialized to zero.
- `Length(Data)` returns the byte count, not a character count or encoded-text length.
- For a nonempty buffer, valid indexes are `0 .. High(Data)`. An empty buffer has `High(Data) = -1`.
- Shrinking preserves the first `N` bytes. Growing preserves existing bytes and adds zero-valued bytes.
- A negative requested length is silently clamped to zero by the current Velox scripting runtime. Pass zero explicitly when clearing.
- Out-of-range reads or writes raise a Velox scripting range error; validate external offsets and lengths before indexing.

#### Binary and text boundaries

`TBytes` has no character encoding. The bytes `$56,$58` happen to be ASCII/UTF-8 for `VX`, but arbitrary buffers may contain zero bytes or invalid text sequences. Choose the conversion by contract:

- Use [`Base64EncodeBytes`](../../Functions/EncryptionHashEncode/Base64EncodeBytes.md) and [`Base64DecodeBytes`](../../Functions/EncryptionHashEncode/Base64DecodeBytes.md) for text-only interchange.
- Use [`LoadFileToBytes`](../../Functions/File/LoadFileToBytes.md) and [`SaveBytesToFile`](../../Functions/File/SaveBytesToFile.md) for whole-file binary transfer, after applying path and size controls.
- Use [`BytesToStream`](../../Functions/Conversion/BytesToStream.md) and [`StreamToBytes`](../../Functions/Conversion/StreamToBytes.md) when an API requires a memory stream.
- Compression helpers return or consume compressed bytes; compressed output must not be interpreted as text.

The `RawContent` surface of an API request also uses `TBytes`. Treat it as the exact payload and obtain content type/encoding from the protocol rather than guessing from the bytes.

#### Aliasing, lifetime and limits

After assigning one `TBytes` variable to another, changing an element through either variable can change the value seen through the other. Resizing can separate them, but a same-length `SetLength` does not create a copy. When an independent buffer is required, allocate a separate destination and copy the elements.

Memory use is proportional to the requested byte count, and several helper functions read complete payloads into memory. Validate file sizes, decoded Base64 sizes and decompression limits before allocating. Velox releases the array automatically after it is no longer used.

### Additional Technical Info
`TBytes` is the script-visible dynamic byte-buffer type registered by the modified PascalScript compiler. Each element is an unsigned [`Byte`](../DataTypes/Byte.md) in the range 0..255. Array positions are zero-based.

**Related Code Library entries**

- [Byte](../DataTypes/Byte.md) - element range and conversion rules.
- [Arrays](../Arrays.md) - shared dynamic-array behavior and interchange guidance.

**External references**

- [Embarcadero System.TBytes](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TBytes) - Delphi byte-array alias.
- [Embarcadero structured types](https://docwiki.embarcadero.com/RADStudio/Athens/en/Structured_Types_%28Delphi%29) - dynamic-array indexing, sharing and lifetime.
- [Free Pascal dynamic arrays](https://www.freepascal.org/docs-html/ref/refsu14.html) - compatible zero-based array model.

<small>Created 2026-07-15</small>
