---
title: "StringToStreamUTF16BE"
description: "Encodes a string as BOM-free big-endian UTF-16 into a supplied stream from position zero."
sidebar_position: 28
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - string
  - stream
  - utf-16be
  - big endian
---

```Delphi
procedure StringToStreamUTF16BE(const aData : string; M : TStream);
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
    Value := StreamToHex(Buffer);  // '00410042'
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`StringToStreamUTF16BE` encodes a string as BOM-free big-endian UTF-16 into a supplied stream from position zero.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aData` | `string`, `const` | Velox UTF-16 text to encode big-endian. |
| `M` | `TStream` | Existing writable, seekable caller-owned stream. |

**Returns**

No value. Success leaves position zero; retained old tail bytes can make `Size` exceed twice the string length.

**Important usage notes**

- The `FE FF` preamble is not emitted.
- Surrogate pairs are copied as two code units and unpaired surrogates are not rejected.
- Existing bytes beyond the new payload remain; empty input leaves all existing bytes intact.
- Using the little-endian decoder on this output produces byte-swapped characters rather than automatic correction.
- A failed exact write can leave partial mutation and skip the final rewind.

**Errors**

Nil-stream, seek, allocation and exact-write failures propagate without rollback.

**Usage notes**

Use big-endian only when the integration contract requires it. Clear or resize the stream first for replacement semantics.

### Additional Technical Info
`StringToStreamUTF16BE` writes each Delphi UTF-16 code unit in big-endian byte order at offset zero of a supplied stream. It emits no BOM and does not truncate a previous longer payload.

The example shows the exact bytes for fictional text. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The wrapper selects `TEncoding.BigEndianUnicode`. Installed `TBigEndianUnicodeEncoding.GetBytes` writes the high then low byte of every Delphi `WideChar`. Shared `StringToMemoryStream` rewinds, writes the complete temporary array via non-owning `TBinaryWriter.Write(TBytes)`/`WriteBuffer`, and rewinds after success.

**Side effects**

Overwrites bytes from zero, can extend and repositions the stream; never truncates or frees it.

**Performance and concurrency**

Allocates two bytes per UTF-16 code unit, then copies them to the stream. Concurrent use of the same stream is unsafe without locking.

**Related entries**

- [`StreamToStringUTF16BE`](StreamToStringUTF16BE.md) decodes explicit UTF-16BE.
- [`StringToStreamUTF16`](StringToStreamUTF16.md) writes little-endian UTF-16.
- [`StreamToString`](StreamToString.md) can consume a supported BOM and choose byte order.

**External references**

- [Embarcadero `TEncoding.BigEndianUnicode`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.BigEndianUnicode), [`GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) and [`TStream.WriteBuffer`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.WriteBuffer) - the selected Delphi terminals.
- [Free Pascal `TEncoding.BigEndianUnicode`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.bigendianunicode.html) and [`TBigEndianUnicodeEncoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tbigendianunicodeencoding.html) - compatible byte-order context; current semantics come from Delphi source.

<small>Created 2026-07-15</small>
