---
title: "StreamToStringASCII"
description: "Reads an entire stream from the beginning and decodes it with Delphi's ASCII encoding."
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - stream
  - ascii
---

```Delphi
function StreamToStringASCII(M : TStream) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Buffer: TMemoryStream;
begin
  Buffer := TMemoryStream.Create;
  try
    StringToStreamASCII('EDI-1001', Buffer);
    Value := StreamToStringASCII(Buffer);
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`StreamToStringASCII` reads an entire stream from the beginning and decodes it with Velox's ASCII encoding.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `M` | `TStream` | Existing readable, seekable caller-owned stream. The function rewinds it. |

**Returns**

The decoded string, or an empty string for an empty stream.

**Errors**

Nil-object, seek, read, allocation and encoding errors propagate. No previous position is restored.

**Usage notes**

ASCII is suitable for deliberately restricted protocols and identifiers. Use UTF-8 when the data can contain general Unicode text.

### Additional Technical Info
`StreamToStringASCII` decodes a complete stream through Delphi's seven-bit ASCII encoding. Use it only when the byte contract is ASCII; it is not a generic single-byte or UTF-8 decoder.

The example round-trips a fictional ASCII identifier. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The registered wrapper calls `MemoryStreamToString(M, TEncoding.ASCII)`. The helper sets position zero, narrows size to `LongInt`, reads a complete allocated byte array and passes it to the installed encoding's `GetString`. On Windows, Delphi requests code page 20127; only if that code page is unavailable does the installed RTL fall back to OEM US code page 437.

**Edge cases and quirks**

- Bytes `0`-`127` have the portable ASCII meaning. High bytes are outside the declared contract and follow the current OS/RTL conversion or failure path.
- A UTF-8 or UTF-16 BOM is not detected or removed.
- Embedded zero bytes decode to U+0000 inside the managed string; they do not terminate the read.
- The helper ignores a short `Read` count, rewinds the stream and leaves it after the captured byte count.
- Stream sizes outside signed `LongInt` and concurrent mutation are unsupported.

**Side effects**

Changes `M.Position`; does not change bytes, size or ownership.

**Performance and concurrency**

Linear time and memory in stream size. The complete byte array and result string coexist; external synchronisation is required for shared streams.

**Related entries**

- [`StringToStreamASCII`](StringToStreamASCII.md) performs the corresponding encoding.
- [`StreamToStringUTF8`](StreamToStringUTF8.md) decodes UTF-8.
- [`StreamToString`](StreamToString.md) performs BOM detection with ANSI fallback.

**External references**

- [Embarcadero `TEncoding.ASCII`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.ASCII) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString) - the exact Delphi encoding path.
- [Free Pascal `TEncoding.ASCII`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.ascii.html) and [`TEncoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.html) - compatible encoding context; Velox uses Delphi's installed RTL.

<small>Created 2026-07-15</small>
