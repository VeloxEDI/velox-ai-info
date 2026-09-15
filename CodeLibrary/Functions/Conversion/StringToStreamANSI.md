---
title: "StringToStreamANSI"
description: "Encodes a string with the system ANSI encoding into a supplied stream from position zero."
sidebar_position: 25
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - string
  - stream
  - ansi
  - code page
---

```Delphi
procedure StringToStreamANSI(const aData : string; M : TStream);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Buffer: TMemoryStream;
begin
  Buffer := TMemoryStream.Create;
  try
    StringToStreamANSI('EDI-1001', Buffer);
    Value := StreamToStringANSI(Buffer);
  finally
    Buffer.Free;
  end;
end;
```

### Usage

`StringToStreamANSI` encodes a string with the system ANSI encoding into a supplied stream from position zero.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aData` | `string`, `const` | Text to encode using the process-wide ANSI encoding captured from Windows `GetACP` on first use. |
| `M` | `TStream` | Existing writable, seekable caller-owned stream. |

**Returns**

No value. Success resets position to zero; old bytes beyond the encoded length remain.

**Errors**

Nil-stream, seek, encoding, allocation and exact-write failures propagate without rollback.

**Usage notes**

Record the required code page in the integration specification. If the format simply says "text", prefer an explicit Unicode encoding such as UTF-8.

### Additional Technical Info
`StringToStreamANSI` converts text through the Windows/system ANSI code page and writes the resulting bytes at stream offset zero. It is for explicitly legacy code-page contracts, not for portable Unicode interchange.

The example round-trips a fictional ASCII-range identifier. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The wrapper selects `TEncoding.ANSI` and calls shared `StringToMemoryStream`. The helper creates a non-owning `TBinaryWriter`, rewinds, allocates `GetBytes(aData)`, writes the complete array through `WriteBuffer`, rewinds again and frees only the writer.

**Edge cases and quirks**

- Characters not representable in the active code page can be substituted by the current Windows conversion. No round-trip or loss check is performed.
- The output can differ across Velox hosts whose Windows system ANSI code pages differ. Changing only the service account on one configured host does not make this function choose a different code page.
- No BOM or code-page identifier is written.
- Existing content is not truncated. Shorter text leaves a stale tail; empty text leaves all old bytes intact.
- Failure can leave a partially overwritten stream and a non-zero position.

**Side effects**

Overwrites from offset zero, can extend and repositions `M`; never shortens or frees it.

**Performance and concurrency**

Allocates the full encoded array, then copies it into the stream. Shared-stream access requires external coordination; the process-wide encoding singleton is stable after its thread-safe first creation.

**Related entries**

- [`StreamToStringANSI`](StreamToStringANSI.md) performs the corresponding decode.
- [`StringToStreamUTF8`](StringToStreamUTF8.md) writes portable UTF-8.
- [`BytesToStream`](BytesToStream.md) supplies replacement semantics for a prepared byte array.

**External references**

- [Embarcadero `TEncoding.ANSI`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.ANSI), [`GetBytes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.TEncoding.GetBytes) and [`TStream.WriteBuffer`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.WriteBuffer) - the installed Delphi terminal APIs.
- [Free Pascal `TEncoding.ANSI`](https://www.freepascal.org/docs-html/rtl/sysutils/tencoding.ansi.html) and [`TStream.WriteBuffer`](https://www.freepascal.org/docs-html/rtl/classes/tstream.writebuffer.html) - compatible context; code-page details remain Delphi/Windows-specific.

<small>Created 2026-07-15</small>
