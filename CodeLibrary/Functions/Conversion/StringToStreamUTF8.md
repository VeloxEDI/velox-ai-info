---
title: "StringToStreamUTF8"
description: "Writes BOM-free UTF-8 through the explicitly named entry, rewinding but not truncating the supplied stream."
sidebar_position: 29
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - string
  - stream
  - utf-8
---

```Delphi
procedure StringToStreamUTF8(const aData : string; M : TStream);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Buffer: TMemoryStream;
begin
  Buffer := TMemoryStream.Create;
  try
    StringToStreamUTF8('ABC', Buffer);
    Value := StreamToHex(Buffer);  // '414243'
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`StringToStreamUTF8` writes BOM-free UTF-8 through the explicitly named entry, rewinding but not truncating the supplied stream.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aData` | `string`, `const` | Complete text to encode as UTF-8. |
| `M` | `TStream` | Existing writable, seekable caller-owned stream. |

**Returns**

No value. Success resets position to zero. Because no truncation occurs, stream size can exceed the UTF-8 payload length.

**Errors**

Nil-stream, seek, encoding, allocation and `WriteBuffer` failures propagate with no transaction or rollback.

**Usage notes**

Prefer this explicit name in integrations whose wire format is UTF-8. Clear or resize a reused stream before the call when stale tail bytes are unacceptable.

### Additional Technical Info
`StringToStreamUTF8` encodes a Delphi string as BOM-free UTF-8 and writes it from position zero of an existing stream. Its implementation and output are currently identical to [`StringToStream`](StringToStream.md).

The example writes fictional ASCII-range text and inspects its bytes. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The registered wrapper calls `StringToMemoryStream` with installed `TEncoding.UTF8`. The helper creates a non-owning `TBinaryWriter`, rewinds the stream, allocates `GetBytes(aData)`, writes the complete array through `WriteBuffer`, rewinds and frees the writer. `GetBytes` does not prepend the encoding's advertised BOM.

**Edge cases and quirks**

- Output is byte-for-byte the same as current `StringToStream`; the explicit name communicates the intended contract.
- No UTF-8 BOM is written.
- The current Windows encoder does not request strict invalid-surrogate failure during `GetBytes`; malformed Delphi UTF-16 input follows the OS conversion path rather than serving as validation.
- Existing tail bytes remain after shorter or empty input. Empty text does not empty the stream.
- Failure during an exact write can leave partial bytes and a non-zero position.

**Side effects**

Overwrites from offset zero, can extend and repositions `M`; never truncates or frees it.

**Performance and concurrency**

Allocates the full UTF-8 array before writing. Time and memory are linear in text size; shared streams require external synchronisation.

**Related entries**

- [`StreamToStringUTF8`](StreamToStringUTF8.md) decodes explicit UTF-8.
- [`StringToStream`](StringToStream.md) is the current alias-equivalent writer.
- [`BytesToStream`](BytesToStream.md) clears a memory stream before copying bytes.

**External references**

- [Embarcadero `TEncoding.UTF8`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.UTF8), [`GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) and [`TStream.WriteBuffer`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.WriteBuffer) - the exact Delphi terminal APIs.
- [Free Pascal `TEncoding.UTF8`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.utf8.html), [`TUTF8Encoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tutf8encoding.html) and [`TStream.WriteBuffer`](https://www.freepascal.org/docs-html/rtl/classes/tstream.writebuffer.html) - compatible context; Velox executes Delphi's encoder/writer.

<small>Created 2026-07-15</small>
