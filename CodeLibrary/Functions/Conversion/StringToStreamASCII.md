---
title: "StringToStreamASCII"
description: "Encodes a string with Delphi's ASCII encoding into a supplied stream from position zero."
sidebar_position: 26
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - string
  - stream
  - ascii
---

```Delphi
procedure StringToStreamASCII(const aData : string; M : TStream);
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
    Value := StreamToHex(Buffer);  // '4544492D31303031'
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`StringToStreamASCII` encodes a string with Velox's ASCII encoding into a supplied stream from position zero.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aData` | `string`, `const` | Text intended to contain only ASCII characters. |
| `M` | `TStream` | Existing writable, seekable caller-owned stream. |

**Returns**

No value. On success position is zero; stream size can exceed the new ASCII byte length because the helper does not truncate.

**Important usage notes**

- Characters above U+007F are outside the intended contract and can be substituted or fail according to the installed OS conversion; no loss check occurs.
- No BOM is written.
- Old trailing bytes remain when the encoded value is shorter. Empty input writes nothing and does not empty the stream.
- Embedded U+0000 encodes as a zero byte; stream writing is length-based.
- A write failure can leave partial mutation and skip the final rewind.

**Errors**

Nil-stream, seek, encoding, allocation and exact-write errors propagate with no rollback.

**Usage notes**

Validate the character repertoire before this call when substitution would corrupt a business identifier. UTF-8 is a safer default for general text.

### Additional Technical Info
`StringToStreamASCII` encodes text with Delphi's seven-bit ASCII encoding and writes the bytes from offset zero of a supplied stream. Use it only after the data has been restricted to the ASCII repertoire.

The example writes a fictional ASCII identifier. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The wrapper passes `TEncoding.ASCII` to shared `StringToMemoryStream`. The helper rewinds, obtains a complete byte array, writes it through non-owning `TBinaryWriter.Write(TBytes)`/`WriteBuffer`, and rewinds after success. Installed Delphi requests Windows code page 20127, falling back to OEM US 437 only if 20127 is unavailable.

**Side effects**

Overwrites from position zero, can extend and repositions the stream; never truncates or frees it.

**Performance and concurrency**

Linear allocation and copy. Do not share the target stream across concurrent writers/readers without locking.

**Related entries**

- [`StreamToStringASCII`](StreamToStringASCII.md) decodes the corresponding byte contract.
- [`StringToStreamUTF8`](StringToStreamUTF8.md) supports general Unicode text.
- [`BytesToStream`](BytesToStream.md) clears a memory stream before copying bytes.

**External references**

- [Embarcadero `TEncoding.ASCII`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.ASCII), [`GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) and [`TStream.WriteBuffer`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.WriteBuffer) - the exact Delphi path.
- [Free Pascal `TEncoding.ASCII`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.ascii.html) and [`TStream.WriteBuffer`](https://www.freepascal.org/docs-html/rtl/classes/tstream.writebuffer.html) - compatible context; Velox uses Delphi's installed implementation.

<small>Created 2026-07-15</small>
