---
title: "StreamToStringANSI"
description: "Reads an entire stream from the beginning and decodes it with the system ANSI encoding."
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - stream
  - ansi
  - code page
---

```Delphi
function StreamToStringANSI(M : TStream) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Buffer: TMemoryStream;
begin
  Buffer := TMemoryStream.Create;
  try
    StringToStreamANSI('Fictional order 1001', Buffer);
    Value := StreamToStringANSI(Buffer);
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`StreamToStringANSI` reads an entire stream from the beginning and decodes it with the system ANSI encoding.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `M` | `TStream` | Existing readable, seekable caller-owned stream. Its current position is ignored. |

**Returns**

The code-page-decoded Velox string. Empty input returns an empty string.

**Errors**

Nil-object, seek, read, allocation and encoding failures propagate. No previous position is restored.

**Usage notes**

Use ANSI only for a legacy contract that names the expected code page operationally. Prefer UTF-8 for new interchange formats.

### Additional Technical Info
`StreamToStringANSI` reads all bytes from a stream and decodes them with Delphi `TEncoding.ANSI`. On Windows the process-wide singleton captures the machine's active ANSI code page through `GetACP` on first use; it is not UTF-8 and no encoding identifier is read from the stream.

The example round-trips fictional ASCII-range text. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox wrapper calls the shared `MemoryStreamToString` helper with the installed singleton `TEncoding.ANSI`. The helper rewinds the stream, narrows its size to `LongInt`, allocates and reads that byte count, then calls `GetString` on the entire array. Because an encoding is supplied, `GetBufferEncoding` is not called.

**Edge cases and quirks**

- A BOM is treated as ordinary encoded bytes; it is not detected or removed.
- Results for byte values above ASCII depend on the captured Windows system ANSI code page. The same bytes can decode differently on another Velox host whose system code page differs; switching service accounts on the same configured host does not select a different code page through this function.
- The current Delphi MBCS decoder calls the operating-system conversion with permissive flags. Invalid or unmappable data follows that code page's conversion/failure behaviour and must not be used as validation.
- The helper ignores a short `Read` result and includes any zero-filled unread tail in the decoding input.
- The stream is rewound and left after the bytes read. Sizes outside signed `LongInt` are unsupported.

**Side effects**

Mutates `M.Position`; it does not mutate or free the stream.

**Performance and concurrency**

The complete bytes and decoded string coexist in memory. The call is synchronous and does not coordinate concurrent stream access. The encoding singleton is process-wide and stable after its thread-safe first creation.

**Related entries**

- [`StreamToString`](StreamToString.md) uses ANSI only when no recognised BOM is present.
- [`StringToStreamANSI`](StringToStreamANSI.md) performs the corresponding ANSI encoding.
- [`StreamToStringUTF8`](StreamToStringUTF8.md) provides a portable Unicode byte contract.

**External references**

- [Embarcadero `TEncoding.ANSI`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.ANSI) and [`TEncoding.GetString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetString) - the exact Delphi encoding object and decoder API.
- [Free Pascal `TEncoding.ANSI`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.ansi.html) and [`TEncoding`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.html) - compatible code-page context; Velox executes Delphi's Windows implementation.

<small>Created 2026-07-15</small>
