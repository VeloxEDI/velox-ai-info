---
title: "StreamToString"
description: "Reads an entire stream and decodes a recognised BOM, falling back to the system ANSI encoding."
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - stream
  - encoding
  - byte order mark
---

```Delphi
function StreamToString(M : TStream) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Buffer: TMemoryStream;
  Data: TBytes;
begin
  Buffer := TMemoryStream.Create;
  try
    Data := Base64DecodeBytes('77u/T0s=');  // UTF-8 BOM followed by OK
    BytesToStream(Data, Buffer);
    Value := StreamToString(Buffer);        // 'OK'
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`StreamToString` reads an entire stream and decodes a recognised BOM, falling back to the system ANSI encoding.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `M` | `TStream` | Existing readable, seekable caller-owned stream. The function rewinds it. |

**Returns**

The decoded Velox string. An empty stream returns an empty string.

**Errors**

Nil-object, seek, read, allocation and encoding errors propagate. In particular, a detected malformed UTF-8 sequence is rejected by the current Velox UTF-8 decoder. No prior position or partial string is returned.

**Usage notes**

Use this entry only when the input contract genuinely permits BOM selection with ANSI fallback. For integration wire formats, an explicit encoding is normally safer and reproducible across machines.

### Additional Technical Info
`StreamToString` reads all bytes in a stream, detects a leading UTF-8, UTF-16LE or UTF-16BE byte-order mark (BOM), removes that preamble and decodes the remainder. When none of those BOMs is present, it decodes with Delphi's system ANSI encoding.

The example uses fictional Base64 data containing a UTF-8 BOM and `OK`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The registration calls `vxStream.StreamToString`, which delegates to `MemoryStreamToString(M, nil)`. That helper sets position zero, narrows `Size` to `LongInt`, allocates and reads one complete byte array, then calls installed Studio 37.0 `TEncoding.GetBufferEncoding` with `TEncoding.ANSI` as the explicit fallback. The helper skips the detected preamble length and calls that encoding's `GetString` overload on the remaining bytes.

Detection checks UTF-8 first, then UTF-16LE, then UTF-16BE. It is BOM recognition, not statistical encoding detection; UTF-32 and BOM-free Unicode are not inferred.

**Edge cases and quirks**

- BOM-free UTF-8 containing only ASCII happens to decode the same through ANSI, but non-ASCII UTF-8 does not have a portable result. Use [`StreamToStringUTF8`](StreamToStringUTF8.md) for that contract.
- A recognised BOM is removed. Explicit encoding functions do not perform this removal and can return a leading U+FEFF character.
- ANSI fallback uses a process-wide `TEncoding.ANSI` singleton created with the Windows `GetACP` value on first use. Results can therefore differ between hosts whose system ANSI code pages differ.
- The helper ignores the byte count returned by `Read`. If a custom stream returns short data without raising, unread array bytes remain zero and participate in decoding.
- Position is always reset to zero and normally ends at the captured size. Very large streams exceed the helper's `LongInt` count contract.

**Side effects**

Mutates `M.Position`; no stream bytes or ownership change.

**Performance and concurrency**

The complete byte array and decoded string coexist, so peak memory is proportional to both representations. Concurrent stream mutation is not coordinated by this function; the captured ANSI singleton itself is process-wide and stable after creation.

**Related entries**

- [`StreamToStringUTF8`](StreamToStringUTF8.md), [`StreamToStringUTF16`](StreamToStringUTF16.md) and [`StreamToStringUTF16BE`](StreamToStringUTF16BE.md) select fixed Unicode encodings.
- [`StreamToBytes`](StreamToBytes.md) avoids text interpretation.

**External references**

- [Embarcadero `TEncoding.GetBufferEncoding`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBufferEncoding) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString) - the exact Delphi detection and decoding APIs.
- [Free Pascal `TEncoding.GetBufferEncoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.getbufferencoding.html) and [`TEncoding.GetString`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.getstring.html) - compatible API context; current Velox behaviour follows installed Delphi source.

<small>Created 2026-07-15</small>
