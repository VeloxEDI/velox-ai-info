---
title: "StreamToStringUTF16"
description: "Reads an entire stream from the beginning and decodes it as little-endian UTF-16."
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - stream
  - utf-16
  - little endian
---

```Delphi
function StreamToStringUTF16(M : TStream) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Buffer: TMemoryStream;
begin
  Buffer := TMemoryStream.Create;
  try
    StringToStreamUTF16('AB', Buffer);
    Value := StreamToStringUTF16(Buffer);
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`StreamToStringUTF16` reads an entire stream from the beginning and decodes it as little-endian UTF-16.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `M` | `TStream` | Existing readable, seekable caller-owned stream. Its incoming position is ignored. |

**Returns**

The decoded Velox UTF-16 string. Empty input returns an empty string.

**Errors**

Nil-object, seek, read and allocation failures propagate. Odd length and malformed surrogate structure do not themselves raise in this installed decoder.

**Usage notes**

Use this only for an explicitly UTF-16LE payload. If a BOM is part of the transport contract and should be consumed, use [`StreamToString`](StreamToString.md).

### Additional Technical Info
`StreamToStringUTF16` interprets the complete stream as UTF-16 little-endian code units. It selects the byte order explicitly; it does not inspect a BOM or switch encodings.

The example round-trips fictional text through the matching writer. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The wrapper delegates to `MemoryStreamToString(M, TEncoding.Unicode)`. After the shared rewind/read step, installed `TUnicodeEncoding.GetString` calculates `ByteCount div 2` characters and copies each little-endian 16-bit code unit into the result.

**Edge cases and quirks**

- A leading `FF FE` BOM is decoded as U+FEFF because explicit decoding does not skip a preamble.
- An odd final byte is silently ignored by the current Delphi `ByteCount div 2` implementation.
- The decoder copies UTF-16 code units without validating surrogate pairing. Unpaired surrogates can therefore remain in the resulting Delphi string.
- Big-endian bytes decode incorrectly rather than triggering byte-order detection.
- The helper rewinds the stream, ignores a short `Read` result and has a signed-`LongInt` size boundary.

**Side effects**

Changes `M.Position`; does not modify or free the stream.

**Performance and concurrency**

Linear in byte count; the complete bytes and decoded string coexist. Shared-stream access requires external synchronisation.

**Related entries**

- [`StringToStreamUTF16`](StringToStreamUTF16.md) writes BOM-free UTF-16LE.
- [`StreamToStringUTF16BE`](StreamToStringUTF16BE.md) selects the opposite byte order.
- [`StreamToString`](StreamToString.md) recognises and removes a UTF-16 BOM.

**External references**

- [Embarcadero `TEncoding.Unicode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.Unicode) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString) - the selected Delphi UTF-16LE decoder.
- [Free Pascal `TEncoding.Unicode`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.unicode.html) and [`TUnicodeEncoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tunicodeencoding.html) - compatible UTF-16 context; current edge behaviour is verified from Delphi source.

<small>Created 2026-07-15</small>
