---
title: "MD5HashStream"
description: "Hashes bytes from a stream's current position to its end with MD5 and returns uppercase hexadecimal text."
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - stream
  - md5
  - hash
---

```Delphi
Function MD5HashStream( aStream : TStream) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Buffer: TMemoryStream;
begin
  Buffer := TMemoryStream.Create;
  try
    StringToStreamUTF8('fictional integration payload', Buffer);
    Buffer.Position := 0;
    Value := MD5HashStream(Buffer);
    // Buffer.Position is now at Buffer.Size.
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`MD5HashStream` hashes bytes from a stream's current position to its end with MD5 and returns uppercase hexadecimal text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aStream` | `TStream` | Existing non-`nil` readable stream whose `Position` and `Size` can be queried. Hashing begins at its incoming position and changes that position. |

**Returns**

A 32-character uppercase MD5 value using `0-9` and `A-F`. If the stream has zero bytes remaining, the result is the standard empty-byte MD5 value `D41D8CD98F00B204E9800998ECF8427E`.

**Behaviour**

- Hashing starts at the exact incoming stream position, not automatically at offset zero.
- For a normal seekable stream, all remaining bytes are read and the final position equals the size observed at the start.
- Bytes are hashed without text decoding or transformation.
- Rewind explicitly before the call when the contract is to hash complete content.

**Errors**

A `nil` object, unsupported size/position operations, read failures, invalid stream state, hashing-interface/provider failures, allocation failures and Velox hash exceptions propagate. There is no partial digest or error return.

**Usage notes**

Save and restore the position in caller code only if that is safe for the stream and required by the surrounding workflow. If another component can mutate the source while hashing, coordinate an immutable view. Use MD5 only for required legacy compatibility.

### Additional Technical Info
`MD5HashStream` hashes the remaining bytes of an existing stream, beginning at its current `Position`, and returns a 32-character uppercase hexadecimal MD5 value. The caller retains ownership of the stream, but the function consumes the hashed range and does not restore the position.

The example is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox creates a shipped Indy `TIdHashMessageDigest5` for each call and invokes `HashStreamAsHex(aStream)`. Indy's no-range overload delegates with start and size set to `-1`: it does not assign a start position and calculates `aStream.Size - aStream.Position`. Indy then uses its registered hashing interface when that interface and MD5 are available (the shipped application can bind it to OpenSSL), otherwise it uses its native MD5 block implementation. Both branches read the remaining range and convert the 16-byte result through Indy's uppercase `ToHex`. The hasher is freed in a `finally` block; the supplied stream is not freed.

**Edge cases and quirks**

- The stream position is a material input. The same stream content produces a different digest when the call starts at a different offset.
- A stream already positioned at its end returns the standard empty-byte digest, not `''`.
- The function does not restore the position after success or failure. On a read error it may leave the stream partly consumed.
- Streams that cannot report `Size`/`Position`, have a position outside the normal `0..Size` range, return short reads or change concurrently do not have a stable supported result and can raise.
- Output is uppercase, unlike Delphi-based [`MD5HashHex`](MD5HashHex.md), which emits lowercase.
- MD5 is collision-broken and cannot prove authenticity or adversarial integrity.

**Side effects**

The caller's stream position changes. Reading can also trigger implementation-specific effects in file, network, decompression or custom streams. The wrapper does not close, clear or free the supplied stream.

**Performance and concurrency**

Time is linear in the remaining byte count. Indy reads incrementally: its interface branch uses bounded chunks and its native branch processes fixed-size MD5 blocks, so neither copies the entire stream into one array. Do not call concurrently against the same stream: position and content access are mutable and unsynchronised. Independent streams use independent hash objects, although an available hashing interface can rely on process-wide provider state.

**Related entries**

- [`LoadAndHashFile`](LoadAndHashFile.md) owns a new file stream, starts at offset zero and delegates to this function.
- [`MD5HashHex`](MD5HashHex.md) hashes UTF-8 text and returns lowercase hexadecimal.
- [`StringToStreamUTF8`](../Conversion/StringToStreamUTF8.md) writes the UTF-8 bytes used in the example.

**External references**

- [Embarcadero DocWiki: `THashMD5.GetHashString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Hash.THashMD5.GetHashString) - comparable Delphi core MD5 string/stream formatting; Velox reaches shipped Indy for this helper.
- [Free Pascal: `MD5Print`](https://www.freepascal.org/daily/packages/hash/md5/md5print.html) - compatibility context for hexadecimal digest formatting, not the Velox terminal implementation.

<small>Created 2026-07-15</small>
