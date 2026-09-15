---
title: "StringToStreamUTF16"
description: "Encodes a string as BOM-free little-endian UTF-16 into a supplied stream from position zero."
sidebar_position: 27
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - string
  - stream
  - utf-16
  - little endian
---

```Delphi
procedure StringToStreamUTF16(const aData : string; M : TStream);
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
    Value := StreamToHex(Buffer);  // '41004200'
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`StringToStreamUTF16` encodes a string as BOM-free little-endian UTF-16 into a supplied stream from position zero.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aData` | `string`, `const` | Velox UTF-16 text to encode little-endian. |
| `M` | `TStream` | Existing writable, seekable caller-owned stream. |

**Returns**

No value. Success resets position to zero. The stream can remain longer than `Length(aData) * 2` because it is not truncated.

**Errors**

Nil-stream, seek, allocation and exact-write errors propagate. No rollback is provided.

**Usage notes**

Add a BOM separately only when the wire format requires it. Clear or resize the stream first when the call must replace a previous longer payload.

### Additional Technical Info
`StringToStreamUTF16` writes the Delphi string's UTF-16 code units in little-endian byte order at stream offset zero. It emits no byte-order mark and does not replace existing content beyond the bytes written.

The example shows the exact BOM-free bytes for fictional text. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The wrapper selects `TEncoding.Unicode` and delegates to `StringToMemoryStream`. Installed `TUnicodeEncoding.GetBytes` allocates exactly two bytes per Delphi `Char` and copies the UTF-16 code units in native Windows little-endian order. The shared helper writes the byte array exactly through a non-owning `TBinaryWriter`, then rewinds.

**Edge cases and quirks**

- The `FF FE` UTF-16LE preamble is not written; `GetBytes` returns payload only.
- Unpaired surrogate code units are copied without validation. This function preserves Delphi code units but does not prove well-formed Unicode scalar text.
- Existing bytes beyond the new payload remain. Empty text leaves the stream content unchanged.
- Embedded U+0000 produces two zero bytes and does not terminate the payload.
- A write failure can leave partially replaced bytes and a non-zero position.

**Side effects**

Overwrites from zero, can extend and repositions `M`; never truncates or frees it.

**Performance and concurrency**

Allocates a two-byte-per-code-unit array before copying it to the stream. Shared-stream access needs external synchronisation.

**Related entries**

- [`StreamToStringUTF16`](StreamToStringUTF16.md) decodes explicit UTF-16LE.
- [`StringToStreamUTF16BE`](StringToStreamUTF16BE.md) writes the opposite byte order.
- [`BytesToStream`](BytesToStream.md) clears before writing a prepared byte array.

**External references**

- [Embarcadero `TEncoding.Unicode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.Unicode), [`GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) and [`TStream.WriteBuffer`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.WriteBuffer) - the Delphi terminal APIs.
- [Free Pascal `TEncoding.Unicode`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.unicode.html) and [`TUnicodeEncoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tunicodeencoding.html) - compatible UTF-16 context; Velox follows Delphi's code-unit copy.

<small>Created 2026-07-15</small>
