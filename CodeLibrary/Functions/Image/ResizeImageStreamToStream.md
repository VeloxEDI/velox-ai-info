---
title: "ResizeImageStreamToStream"
description: "Detects JPEG or PNG in a source stream, proportionally fits it inside a box and writes the same format to a destination stream."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - image
  - resize
  - jpeg
  - png
  - stream
  - aspect-ratio
  - ownership
---

```Delphi
Function ResizeImageStreamToStream(
  const aOriginalImageStream: TStream;
  out aNewImageStream: TStream;
  const NewWidth, NewHeight, aQuality: integer): boolean
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
    Succeeded := ResizeImageStreamToStream(
      Source, Destination, 1200, 1200, 80);
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

`ResizeImageStreamToStream` detects JPEG or PNG in a source stream, proportionally fits it inside a box and writes the same format to a destination stream.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aOriginalImageStream` | `TStream`, `const` | Non-nil, nonempty, readable/seekable source; starts at current position. |
| `aNewImageStream` | `TStream`, `out` | Existing writable destination, used like `var`; never allocated, cleared, truncated or freed. |
| `NewWidth` | `integer`, `const` | Positive bounded fit-box width; caller must validate. |
| `NewHeight` | `integer`, `const` | Positive bounded fit-box height; caller must validate. |
| `aQuality` | `integer`, `const` | Direct JPEG quality or defective PNG compression mapping. |

**Returns**

`False` for nil/zero-size source, nil destination or unrecognized JPEG/PNG signature. `True` after destination save. Decode/resize/encode/write errors raise.

**Errors**

Seek/read/decode/dimension/GDI/quality/encode/write/memory errors propagate. No position/content rollback.

**Usage notes**

Use distinct streams, explicit positions and an empty/truncated destination. Enforce source/target pixel limits, validate positive dimensions/quality, and verify orientation/alpha requirements in the future image test bed before operational reliance.

### Additional Technical Info
`ResizeImageStreamToStream` detects JPEG/PNG at the source's current position, proportionally fits decoded pixels inside a bounding box, and writes a newly encoded image of the same detected format to an existing destination stream. It can upscale and uses a 32-bit DIB plus GDI `HALFTONE` stretch.

Both streams remain caller-owned. The `out` destination is not allocated. The example is fictional/source-reviewed only; no image function was executed.

**Destination `out` defect**

The native function immediately tests `Assigned(aNewImageStream)` and invokes it, but never assigns a new stream reference. Modified PascalScript passes the existing variable address. Construct the destination before entry and free it afterward; treat the parameter as `var` with no ownership transfer.

**Implementation trace**

1. Reject nil/zero-total-size source and nil destination.
2. Allocate bitmaps, initialize graphic pointers nil.
3. Probe JPEG then PNG and create the detected source graphic; probes restore position.
4. Decode from source position and assign to `pf32bit` DIB bitmap.
5. Compute minimum bounding-box scale; round proportional dimensions.
6. GDI `HALFTONE` stretch to target bitmap.
7. Create same-format target graphic. JPEG is non-progressive; PNG receives `MapTo10` level.
8. Save at destination current position, return true; free only temporary images/bitmaps.

**Source position and detection**

The source must support `Size`, `Position`, reading and seeking. Total size zero is checked, not remaining length. Detection begins at current position. Probes restore it, then decoding advances it and Velox does not restore it. Unrecognized content safely returns false in this resize function because source graphic starts nil.

**Destination position and content**

Velox neither rewinds nor truncates destination:

- output begins at current position;
- earlier prefix data remains;
- longer old content can leave a stale tail;
- partial output remains after exceptions;
- position advances on write;
- the caller must set `Position`/`Size` for the desired replacement semantics.

**Same-stream/backing-store hazard**

There is no identity/alias check. Passing the same object, or distinct streams over the same mutable backing store, can make decoding and subsequent writing interfere and can corrupt content. Use separate storage.

**Dimensions and scaling**

`Aspect := Min(NewWidth/sourceWidth, NewHeight/sourceHeight)` and final sides are rounded. This creates the largest aspect-preserving image within the box, with no crop/padding. It upscales when both limits are larger. Zero/negative/extreme values and zero-rounded sides are not guarded and can raise or exhaust resources.

**Format, quality and PNG defect**

Detected JPEG remains JPEG; detected PNG remains PNG. There is no output-format parameter. JPEG output is non-progressive and direct quality outside `1..100` raises `ERangeError` in current range-checked builds. PNG is lossless, but every input 90 or greater maps to 10 and raises `ERangeError` against installed range `0..9`; level 0 cannot be selected.

**Fidelity, metadata and transparency**

Fresh bitmap/encoder conversion has no preservation contract for metadata, color profiles, JPEG markers, PNG chunks or EXIF orientation. GDI stretch is not explicitly alpha-aware, so PNG transparency can change. Compressed bytes will not be stable even when dimensions happen to match.

**Side effects**

Advances/reads source, mutates destination and allocates codec/GDI resources. Does not close either stream.

**Performance, limits and concurrency**

Several decoded pixel buffers can coexist. No source-size, pixel-count or target-dimension cap protects against decompression/resource exhaustion. No VCL/GDI synchronization or shared-stream locking is provided.

**Related entries**

- [`ResizeImageStreamToFile`](ResizeImageStreamToFile.md) selects/possibly converts output by destination suffix.
- [`ResizeImageFileToStream`](ResizeImageFileToStream.md) selects source format from filename extension.
- [`CompressImageStreamToStream`](CompressImageStreamToStream.md) re-encodes without resizing.

**External references**

- [Embarcadero `TCanvas.StretchDraw`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Graphics.TCanvas.StretchDraw)
- [Embarcadero `TStream.Position`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Position)
- [Embarcadero `TJPEGImage`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Imaging.jpeg.TJPEGImage) and [`TPngImage`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Imaging.pngimage.TPngImage)
- [Free Pascal `TStream`](https://www.freepascal.org/docs-html/rtl/classes/tstream.html) - compatible stream context; current image behavior follows VCL/GDI.

<small>Created 2026-07-15</small>
