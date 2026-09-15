---
title: "StreamToStringUTF16BE"
description: "Reads an entire stream from the beginning and decodes it as big-endian UTF-16."
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - stream
  - utf-16be
  - big endian
---

```Delphi
function StreamToStringUTF16BE(M : TStream) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Buffer: TMemoryStream;
begin
  Buffer := TMemoryStream.Create;
  try
    StringToStreamUTF16BE('AB', Buffer);
    Value := StreamToStringUTF16BE(Buffer);
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`StreamToStringUTF16BE` reads an entire stream from the beginning and decodes it as big-endian UTF-16.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `M` | `TStream` | Existing readable, seekable caller-owned stream. The function resets its position. |

**Returns**

The decoded Velox string, or an empty string for empty input.

**Errors**

Nil-object, seek, read and allocation errors propagate. Odd length and malformed surrogate structure are not rejected by this installed decoder.

**Usage notes**

Big-endian UTF-16 is less common on Windows. Confirm the wire contract explicitly; do not select it solely because a payload contains a BOM.

### Additional Technical Info
`StreamToStringUTF16BE` interprets the complete stream as big-endian UTF-16 code units. It does not negotiate byte order or strip a preamble.

The example round-trips fictional text through the matching writer. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The wrapper calls `MemoryStreamToString(M, TEncoding.BigEndianUnicode)`. The installed `TBigEndianUnicodeEncoding` inherits the UTF-16 character-count calculation and combines each pair of bytes in big-endian order into one Delphi `WideChar` code unit.

**Edge cases and quirks**

- A leading `FE FF` BOM becomes U+FEFF in the result; explicit decoding does not remove it.
- An odd trailing byte is silently ignored because the inherited character count is `ByteCount div 2`.
- Surrogate pairs are not validated. The decoder copies code units, including unpaired surrogates.
- Little-endian input is byte-swapped into different characters rather than auto-detected.
- The shared helper rewinds the stream, ignores a short-read count and supports only a signed-`LongInt` byte count safely.

**Side effects**

Changes `M.Position`; no content or ownership change.

**Performance and concurrency**

Linear time and memory. The input array and output string coexist; do not mutate a shared stream concurrently.

**Related entries**

- [`StringToStreamUTF16BE`](StringToStreamUTF16BE.md) writes BOM-free UTF-16BE.
- [`StreamToStringUTF16`](StreamToStringUTF16.md) selects little-endian UTF-16.
- [`StreamToString`](StreamToString.md) detects and consumes supported BOMs.

**External references**

- [Embarcadero `TEncoding.BigEndianUnicode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.BigEndianUnicode) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString) - the exact Delphi selection and decode API.
- [Free Pascal `TEncoding.BigEndianUnicode`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.bigendianunicode.html) and [`TBigEndianUnicodeEncoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tbigendianunicodeencoding.html) - compatible byte-order context; Velox follows Delphi source.

<small>Created 2026-07-15</small>
