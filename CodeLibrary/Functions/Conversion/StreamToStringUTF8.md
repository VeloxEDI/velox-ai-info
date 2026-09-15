---
title: "StreamToStringUTF8"
description: "Reads an entire stream from the beginning and decodes it explicitly as UTF-8."
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - stream
  - utf-8
---

```Delphi
function StreamToStringUTF8(M : TStream) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Buffer: TMemoryStream;
begin
  Buffer := TMemoryStream.Create;
  try
    StringToStreamUTF8('Fictional order 1001', Buffer);
    Value := StreamToStringUTF8(Buffer);
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`StreamToStringUTF8` reads an entire stream from the beginning and decodes it explicitly as UTF-8.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `M` | `TStream` | Existing readable, seekable caller-owned stream. The current position is ignored. |

**Returns**

The decoded Velox Unicode string. Empty input returns an empty string.

**Errors**

Nil-object, seek, read, allocation and `EEncodingError` failures propagate. No partial string or previous position is restored.

**Usage notes**

For a UTF-8 contract that permits an optional BOM and wants it consumed, use [`StreamToString`](StreamToString.md) only if its ANSI fallback is also acceptable; otherwise remove the BOM in controlled byte-processing code.

### Additional Technical Info
`StreamToStringUTF8` decodes the complete stream as UTF-8 regardless of its contents. Use it for BOM-free UTF-8 and for contracts where a leading BOM should remain visible to the caller.

The example round-trips fictional text in memory. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The wrapper calls `MemoryStreamToString(M, TEncoding.UTF8)`. The shared helper rewinds and reads the complete stream, then installed `TUTF8Encoding.GetString` converts the array using Windows code page UTF-8 with `MB_ERR_INVALID_CHARS` enabled.

**Edge cases and quirks**

- A leading UTF-8 BOM (`EF BB BF`) is decoded as U+FEFF; it is not stripped by this explicit path.
- Malformed, overlong, truncated or otherwise invalid UTF-8 is rejected by the current decoder rather than silently treated as ANSI.
- Embedded U+0000 is preserved inside the managed string.
- The helper ignores a short `Read` result, changes stream position and safely supports only signed-`LongInt` byte counts.
- The function performs no Unicode normalisation; canonically equivalent strings can remain byte-distinct before decoding and code-point-distinct after it.

**Side effects**

Changes `M.Position`; does not change stream content or ownership.

**Performance and concurrency**

Linear time and memory; input bytes and output string coexist. External synchronisation is required for shared streams.

**Related entries**

- [`StringToStreamUTF8`](StringToStreamUTF8.md) writes BOM-free UTF-8.
- [`StringToStream`](StringToStream.md) currently uses the same UTF-8 writer path.
- [`StreamToString`](StreamToString.md) detects and removes a leading UTF-8 BOM.

**External references**

- [Embarcadero `TEncoding.UTF8`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.UTF8) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString) - the selected Delphi UTF-8 implementation and decoder API.
- [Free Pascal `TEncoding.UTF8`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.utf8.html) and [`TUTF8Encoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tutf8encoding.html) - compatible UTF-8 context; current failure behaviour is Delphi-specific.

<small>Created 2026-07-15</small>
