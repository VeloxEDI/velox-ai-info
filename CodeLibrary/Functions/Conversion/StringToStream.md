---
title: "StringToStream"
description: "Writes BOM-free UTF-8 through the legacy generic alias, rewinding but not truncating the supplied stream."
sidebar_position: 24
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
procedure StringToStream(const aData : string; M : TStream);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Buffer: TMemoryStream;
begin
  Buffer := TMemoryStream.Create;
  try
    StringToStream('AB', Buffer);
    Value := StreamToHex(Buffer);  // '4142'
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`StringToStream` writes BOM-free UTF-8 through the legacy generic alias, rewinding but not truncating the supplied stream.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aData` | `string`, `const` | Complete text to encode as UTF-8. |
| `M` | `TStream` | Existing writable, seekable caller-owned stream. The reference must not be `nil`. |

**Returns**

No value. On success, position is reset to zero. The resulting size is not necessarily the encoded length because old trailing bytes are retained.

**Errors**

Nil-stream, seek, encoding, exact-write and allocation failures propagate. `WriteBuffer` raises if the stream writes fewer bytes than requested. There is no rollback of bytes already written.

**Usage notes**

For replacement semantics, clear or resize the stream before calling. Do not rely on an empty string to empty a stream.

### Additional Technical Info
`StringToStream` encodes a Delphi string as UTF-8 bytes and writes them at offset zero of an existing stream. It does not create, return, truncate or free the stream. Despite its generic name, the current encoding is explicitly UTF-8 and matches [`StringToStreamUTF8`](StringToStreamUTF8.md).

The example writes fictional ASCII-range text and inspects the bytes. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The registered wrapper calls `StringToMemoryStream(aData, TEncoding.UTF8, M)`. That helper constructs an installed Delphi `TBinaryWriter` which does not own `M`, sets position zero, obtains a temporary byte array from `TEncoding.UTF8.GetBytes`, and passes it to `TBinaryWriter.Write(TBytes)`. The writer calls `TStream.WriteBuffer`, requiring the complete byte count, and the helper then resets position to zero. Freeing the writer leaves the stream open.

`GetBytes` returns payload bytes only; the UTF-8 preamble `EF BB BF` is not written.

**Edge cases and quirks**

- The helper never sets `M.Size`. If the new bytes are shorter than existing content, stale trailing bytes remain. If `aData` is empty, no bytes change at all.
- Success rewinds the stream to zero, ready for a reader. Failure during writing can leave position advanced and content partially overwritten because the final rewind is skipped.
- Invalid UTF-16 surrogate input follows the current Windows UTF-8 encoder's permissive conversion path; this function is not a Unicode-validity test.
- A `nil`, read-only or non-seekable stream fails. The writer does not take ownership.
- Calling this function on a stream already holding a longer payload is not a replacement operation unless the caller truncates it separately.

**Side effects**

Overwrites bytes from position zero, can extend the stream and changes position. It never shortens the stream or changes ownership.

**Performance and concurrency**

The complete encoded byte array is allocated before writing, so memory and time are linear in text size. The function is synchronous and not safe against concurrent access to the same stream.

**Related entries**

- [`StringToStreamUTF8`](StringToStreamUTF8.md) uses the same implementation path.
- [`StreamToStringUTF8`](StreamToStringUTF8.md) decodes explicit UTF-8.
- [`BytesToStream`](BytesToStream.md) clears a memory stream before writing bytes.

**External references**

- [Embarcadero `TEncoding.GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) and [`TStream.WriteBuffer`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.WriteBuffer) - the exact Delphi encoding and complete-write terminals.
- [Free Pascal `TEncoding.UTF8`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.utf8.html) and [`TStream.WriteBuffer`](https://www.freepascal.org/docs-html/rtl/classes/tstream.writebuffer.html) - compatible encoding/stream context; Velox uses Delphi's writer.

<small>Created 2026-07-15</small>
