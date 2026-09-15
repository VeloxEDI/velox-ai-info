---
title: "CompressImageStreamToStream"
description: "Detects and re-encodes JPEG or PNG from one caller-owned stream into another without resizing."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - image
  - jpeg
  - png
  - compression
  - stream
  - ownership
---

```Delphi
Function CompressImageStreamToStream(
  const aOriginalImageStream: TStream;
  out aNewImageStream: TStream;
  const aQuality: integer): boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Source, Destination: TMemoryStream;
  Succeeded: Boolean;
begin
  Source := TMemoryStream.Create;
  Destination := TMemoryStream.Create;
  try
    Source.LoadFromFile('C:\VeloxData\Examples\source.jpg');
    Source.Position := 0;
    Succeeded := CompressImageStreamToStream(Source, Destination, 75);
    if Succeeded then
      Destination.Position := 0;
    Value := Succeeded;
  finally
    Destination.Free;
    Source.Free;
  end;
end;
```

### Usage

`CompressImageStreamToStream` detects and re-encodes JPEG or PNG from one caller-owned stream into another without resizing.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aOriginalImageStream` | `TStream`, `const` | Non-nil, nonempty, readable, seekable source. Detection/loading starts at current `Position`. |
| `aNewImageStream` | `TStream`, `out` | Misdeclared destination that must already be a non-nil writable object. Caller owns it. |
| `aQuality` | `integer`, `const` | Direct JPEG quality or defective PNG compression mapping. |

**Returns**

Returns `False` for a `nil` source, zero total source size or a `nil` destination. Returns `True` only after saving. Unsupported nonempty image content can raise an object-reference error instead of returning `False`.

**Errors**

Seek, read, write, codec, quality and memory errors are raised to the script. The function does not restore a partially changed destination.

**Usage notes**

Use distinct streams, explicitly control both positions/sizes, validate the source type and enforce resource limits. Treat a `False` or exception as leaving both positions and destination content requiring caller cleanup.

### Additional Technical Info
`CompressImageStreamToStream` detects JPEG/PNG at the source's current position, decodes and re-encodes that same format, then writes to an already existing destination stream. It neither resizes nor creates, clears, truncates or frees either stream.

The example is fictional and source-reviewed only. No image function, codec or test bed was executed.

**`out` is operationally `var`**

The function reads `Assigned(aNewImageStream)` and calls `SaveToStream` on it but never assigns a stream reference. Modified PascalScript passes the existing variable address. Construct the destination before the call and free it afterward. No ownership transfer occurs.

The destination must support the writes performed by the VCL encoder. If the caller wants a standalone image at byte zero, set `Position := 0` and `Size := 0` before calling.

**Implementation trace**

1. Reject nil/zero-size source and nil destination.
2. Probe JPEG, then PNG, restoring source position after each signature check.
3. Create the detected graphic and load from the source's current position.
4. Set JPEG quality and force compression, or set mapped PNG compression level.
5. Save the same format to the destination's current position.
6. Return true and free only the temporary graphic.

**Source stream contract**

- `Size` is read, and probes read then restore `Position`; the source must be seekable.
- Detection starts at current position, not necessarily byte zero.
- A nonempty stream positioned at its end passes the `Size <> 0` guard but cannot be decoded there.
- Decoding advances the source; the function does not restore its position.
- Exceptions can leave the source partially consumed.

**Destination stream contract**

- Writes start at current position.
- Existing prefix bytes remain before the encoded image.
- Existing bytes beyond the newly written payload are not truncated and may remain as a stale tail.
- Position advances on successful/partial writes.
- On failure, partial destination bytes remain; there is no transaction or rollback.
- Caller owns and must free the stream on every path.

**Same-stream hazard**

Velox does not check whether source and destination are the same object. The decoder consumes the source and the encoder then writes at the resulting current position, potentially appending to or overwriting the same backing data. Do not pass the same stream or two wrappers over the same mutable storage.

**Format and quality behavior**

Output format always matches detected input. JPEG is lossy; current range-checked builds raise `ERangeError` when direct quality is outside `1..100`. PNG is lossless, but `MapTo10` maps every input 90 or greater to invalid level 10 for the `0..9` property, so current builds raise `ERangeError`; level 0 is unreachable.

**Unsupported-content defect**

The local graphic pointer is uninitialized when neither JPEG nor PNG probe succeeds. The function nevertheless dereferences/frees it, so arbitrary nonimage or unrecognized content can cause an access violation. The Boolean return must not be used as a safe format validator.

**Side effects**

Advances/reads the source and mutates the destination. Both streams remain open and caller-owned. Codec allocation can be large relative to compressed input.

**Performance, limits and concurrency**

Full in-memory decode/re-encode with no compressed-size, remaining-length, pixel-count or dimension bound. Validate untrusted data upstream. The wrapper provides no synchronization for concurrent VCL codec use or shared streams.

**Related entries**

- [`CompressImageStreamToFile`](CompressImageStreamToFile.md) writes the detected format destructively to a path.
- [`CompressImageFileToStream`](CompressImageFileToStream.md) chooses source format from extension.
- [`ResizeImageStreamToStream`](ResizeImageStreamToStream.md) resizes while preserving detected format.

**External references**

- [Embarcadero `Vcl.Imaging.jpeg.TJPEGImage`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Imaging.jpeg.TJPEGImage)
- [Embarcadero `Vcl.Imaging.pngimage.TPngImage`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Imaging.pngimage.TPngImage)
- [Embarcadero `TStream.Position`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Position)
- [Free Pascal `TStream`](https://www.freepascal.org/docs-html/rtl/classes/tstream.html) - compatible stream ownership/position context; current codec behavior is installed VCL.

<small>Created 2026-07-15</small>
