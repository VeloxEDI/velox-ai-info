---
title: "ResizeImageFileToStream"
description: "Fits a JPEG or PNG file proportionally inside a requested box and writes the source format to a caller-owned stream."
sidebar_position: 6
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
Function ResizeImageFileToStream(
  const aOriginalImageFile: string;
  out aNewImageStream: TStream;
  const NewWidth, NewHeight, aQuality: integer): boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Output: TMemoryStream;
  Succeeded: Boolean;
begin
  Output := TMemoryStream.Create;
  try
    Succeeded := ResizeImageFileToStream(
      'C:\VeloxData\Examples\source.png', Output,
      1200, 1200, 70);
    if Succeeded then
      Output.Position := 0;
    Value := Succeeded;
  finally
    Output.Free;
  end;
end;
```

### Usage

`ResizeImageFileToStream` fits a JPEG or PNG file proportionally inside a requested box and writes the source format to a caller-owned stream.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aOriginalImageFile` | `string`, `const` | Existing JPEG/PNG selected by `.jpg`, `.jpeg` or `.png` suffix. |
| `aNewImageStream` | `TStream`, `out` | Existing writable destination; never created, assigned, cleared or freed by Velox. |
| `NewWidth` | `integer`, `const` | Positive caller-validated bounding width. |
| `NewHeight` | `integer`, `const` | Positive caller-validated bounding height. |
| `aQuality` | `integer`, `const` | Direct JPEG quality or defective mapped PNG level; unrelated to resampling quality. |

**Returns**

`False` when the source file is absent, destination is nil or source extension is unsupported. `True` after `SaveToStream`. Invalid dimensions, malformed content, encoding and stream write failures raise.

**Format behavior**

Stream output format matches source extension because no destination extension exists. JPEG stays JPEG; PNG stays PNG. Use a file-output resize function or another governed conversion path when the output format must change.

**Errors**

Decoder, dimension, GDI, quality, encoder, stream and memory errors propagate. No rollback of destination bytes.

**Usage notes**

Use a new empty destination stream where possible. Validate source suffix/content, positive bounded dimensions and format-specific quality. Do not expect `out` allocation or metadata/alpha preservation.

### Additional Technical Info
`ResizeImageFileToStream` loads JPEG/PNG selected by source extension, proportionally fits it within a bounding box, and writes the same source format into an already existing destination stream. It uses a 32-bit bitmap and GDI `HALFTONE` `StretchDraw` and can upscale.

The `out TStream` parameter is misleading: the caller must construct and own it. The example is fictional/source-reviewed only; no image function was executed.

**Implementation trace**

1. Reject absent source/nil destination.
2. Allocate source/target bitmaps and initialize graphic pointers nil.
3. Create JPEG/PNG from source extension and load it.
4. Convert to `pf32bit` DIB source bitmap (`DIBNeeded` first for JPEG).
5. Calculate `Aspect := Min(NewWidth / sourceWidth, NewHeight / sourceHeight)` and rounded proportional target size.
6. Stretch with GDI `HALFTONE` over the whole target bitmap.
7. Create a fresh encoder of the source format. JPEG is non-progressive; PNG receives `MapTo10(aQuality)`.
8. Save at destination's current position, return true, free only temporaries.

**`out` stream defect and ownership**

The body reads and uses the existing `aNewImageStream`; it never returns a new object through the `out` slot. Modified PascalScript passes the current variable by address, so the caller must instantiate it first. Treat it as `var` and retain responsibility for freeing it on false, success or exception.

**Destination position and stale bytes**

Velox does not set `Position := 0` or `Size := 0`:

- writes begin at current position;
- existing prefix bytes remain;
- a shorter result can leave a stale tail from prior content;
- success leaves position after encoded bytes;
- exceptions can leave partial bytes;
- callers reusing a memory/file stream should explicitly rewind/truncate before entry and rewind after success.

**Dimensions and scaling**

Scale is the smaller of width/source-width and height/source-height. Output fits inside the box while retaining aspect ratio; it is not padded/cropped to exact box dimensions. Both larger limits cause upscaling. Integer `Round` decides final sides.

There is no check for zero, negative, overflow-prone or resource-exhausting values. A tiny scale can round a side to zero. Validate dimensions and maximum target pixels before calling.

**Quality and PNG defect**

JPEG receives direct quality `1..100` and is forced non-progressive; current range-checked builds raise `ERangeError` outside that range. PNG `MapTo10` maps every input 90 or greater to invalid level 10 for the installed `0..9` property, so current builds raise `ERangeError`; level 0 is unreachable. Do not treat the shared parameter as equivalent visual quality between formats.

**Fidelity and metadata**

Fresh bitmap/encoder creation discards the original encoded representation and provides no contract to preserve EXIF/IPTC/XMP, orientation, color profiles or PNG ancillary chunks. GDI bitmap stretch has no explicit alpha-aware interpolation; PNG transparency can be lost or altered. Validate rendered output in the future image test bed before relying on transparency fidelity.

**Side effects**

Reads/decodes the source file and mutates destination stream at its current position. Caller stream remains open/owned by caller.

**Performance, limits and concurrency**

Multiple full decoded/bitmap representations coexist; compressed source size is not a safe memory estimate. No pixel/dimension limits or VCL/GDI synchronization are provided.

**Related entries**

- [`ResizeImageFileToFile`](ResizeImageFileToFile.md) selects/possibly converts output format by destination suffix.
- [`ResizeImageStreamToStream`](ResizeImageStreamToStream.md) detects source bytes and preserves that format.
- [`CompressImageFileToStream`](CompressImageFileToStream.md) re-encodes without resizing.
- [`SaveStreamToFile`](../File/SaveStreamToFile.md) persists a completed stream under its own position/error rules.

**External references**

- [Embarcadero `TCanvas.StretchDraw`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Graphics.TCanvas.StretchDraw)
- [Embarcadero `TStream.Position`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Position)
- [Embarcadero `TJPEGImage`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Imaging.jpeg.TJPEGImage) and [`TPngImage`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Imaging.pngimage.TPngImage)
- [Free Pascal `TStream`](https://www.freepascal.org/docs-html/rtl/classes/tstream.html) - compatible stream context; resizing/codecs are VCL/GDI-specific.

<small>Created 2026-07-15</small>
