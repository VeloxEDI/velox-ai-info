---
title: "StreamToHex"
description: "Reads an entire stream from the beginning and returns two uppercase hexadecimal characters per byte."
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - stream
  - hexadecimal
---

```Delphi
Function StreamToHex( S : TStream) : String
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Buffer: TMemoryStream;
begin
  Buffer := TMemoryStream.Create;
  try
    StringToStreamASCII('AB', Buffer);
    Value := StreamToHex(Buffer);  // '4142'
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`StreamToHex` reads an entire stream from the beginning and returns two uppercase hexadecimal characters per byte.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `TStream` | Existing readable, seekable caller-owned stream. The reference must not be `nil`. |

**Returns**

A string of `Size * 2` uppercase hexadecimal characters. An empty stream returns an empty string.

**Errors**

Nil-object, seek, exact-read, arithmetic and allocation failures propagate. No prior position is restored.

**Usage notes**

Hexadecimal doubles the displayed character count. Use [`StreamToBytes`](StreamToBytes.md) when the next consumer accepts binary data, or an encoding-specific string function when the bytes are text.

### Additional Technical Info
`StreamToHex` represents every byte in a stream as two uppercase hexadecimal characters. It rewinds the stream and processes its complete `Size`; it does not preserve the incoming position.

The example converts fictional in-memory ASCII text to hexadecimal. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The registered Velox wrapper sets `S.Position := 0`, narrows `S.Size` to a `LongInt`, allocates a result twice that length, then loops once per byte. Each iteration calls `ReadBuffer` for exactly one byte and passes that byte to the installed Delphi `System.Classes.BinToHex(Pointer, PWideChar, 1)` overload at the corresponding two-character result position.

**Edge cases and quirks**

- The incoming position is lost; success leaves the stream at the end.
- The output contains no `0x` or `$` prefix, separators or line wrapping.
- `ReadBuffer` requires every byte reported by the initial size. A stream that shrinks or reaches an early end raises instead of returning a partial string.
- `Size` is held in a 32-bit signed `LongInt`, and the output-length expression doubles it. Streams near or beyond those limits are unsupported and can fail through range, overflow or allocation behaviour in the current build.
- The wrapper invokes `BinToHex` once per byte. The result is correct but has more call overhead than one bulk conversion.

**Side effects**

Mutates `S.Position`; it does not change the stream's content or ownership.

**Performance and concurrency**

Time is linear in byte count and the managed result requires two UTF-16 characters per byte. The operation is synchronous. Concurrent writes can invalidate the captured size and cause an exact-read failure or inconsistent output.

**Related entries**

- [`StreamToBytes`](StreamToBytes.md) returns the raw bytes.
- [`HexToBin`](HexToBin.md) creates a stream from hexadecimal text.

**External references**

- [Embarcadero `BinToHex`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.BinToHex) and [`TStream.ReadBuffer`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.ReadBuffer) - the exact Delphi terminal operations.
- [Free Pascal `BinToHex`](https://www.freepascal.org/docs-html/rtl/strutils/bintohex.html) and [`TStream.ReadBuffer`](https://www.freepascal.org/docs-html/rtl/classes/tstream.readbuffer.html) - compatible conversion and exact-read references; Velox uses Delphi's implementations.

<small>Created 2026-07-15</small>
