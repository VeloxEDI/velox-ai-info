---
title: "ResizeImageStreamToFile"
description: "Detects JPEG or PNG in a stream, proportionally fits it inside a box and writes the format selected by destination extension."
sidebar_position: 7
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
  - file
  - aspect-ratio
  - destructive
---

```Delphi
Function ResizeImageStreamToFile(
  const aOriginalImageStream: TStream;
  const aNewImageFile: string;
  const NewWidth, NewHeight, aQuality: integer): boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Source: TMemoryStream;
begin
  Source := TMemoryStream.Create;
  try
    Source.LoadFromFile('C:\VeloxData\Examples\source.png');
    Source.Position := 0;
    Value := ResizeImageStreamToFile(
      Source, 'C:\VeloxData\Examples\resized.jpg',
      1200, 1200, 80);
  finally
    Source.Free;
  end;
end;
```

### Usage

`ResizeImageStreamToFile` detects JPEG or PNG in a stream, proportionally fits it inside a box and writes the format selected by destination extension.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aOriginalImageStream` | `TStream`, `const` | Non-nil, nonempty, readable/seekable source; detection/loading starts at current position. Caller owns it. |
| `aNewImageFile` | `string`, `const` | `.jpg`/`.jpeg` or `.png` destination selecting encoder; directories may be created and existing file deleted. |
| `NewWidth` | `integer`, `const` | Positive, bounded width of the fit box; not validated. |
| `NewHeight` | `integer`, `const` | Positive, bounded height of the fit box; not validated. |
| `aQuality` | `integer`, `const` | Direct JPEG quality or defective mapped PNG compression level. |

**Returns**

`False` for nil/zero-size source, failed `CheckFolder`, unrecognized source signature or unrecognized destination extension. `True` after saving. Other failures raise.

**Errors**

Seek/decode/dimension/GDI/quality/encode/path/write/memory errors propagate. False covers recognized guards only.

**Usage notes**

Set source position explicitly, validate remaining bytes/dimensions/output suffix/quality, enforce pixel limits, normalize orientation/transparency where required and save to a temporary path for robust replacement.

### Additional Technical Info
`ResizeImageStreamToFile` detects JPEG/PNG from source bytes at current position, fits decoded pixels proportionally within a bounding box, and writes JPEG/PNG selected by destination filename extension. It supports JPEG-to-PNG and PNG-to-JPEG conversion through a 32-bit bitmap/GDI stretch.

The source is consumed and existing destination is replaced non-atomically. The example is fictional/source-reviewed only; no image function was executed.

**Implementation trace**

1. Reject nil source or total `Size = 0`; verify/create destination folder.
2. Allocate source/target bitmaps and initialize graphic pointers nil.
3. Probe JPEG then PNG at current source position; probes restore position.
4. Decode from that position, force JPEG DIB if needed, assign to `pf32bit` DIB bitmap.
5. Calculate minimum width/height scale and rounded proportional target size.
6. GDI `HALFTONE` `StretchDraw` source bitmap to target bitmap.
7. Select fresh JPEG/PNG from destination extension, apply compression/non-progressive JPEG, assign target bitmap.
8. Delete existing destination, save, return true; free temporaries and leave source caller-owned.

**Source stream contract**

- Must support `Size`, reading, seeking and `Position` assignment.
- Total size zero is rejected; remaining bytes are not checked. A stream at its end can pass the guard and then be unrecognized.
- Detection starts at current position, not automatically at zero.
- Probes restore position, but `LoadFromStream` consumes and advances it; Velox does not restore after success/error.
- JPEG's probe uses a limited initial-marker heuristic; PNG requires exact eight-byte signature.
- Caller must restore position if later logic needs the same bytes.

Unlike the Compress stream functions, unrecognized content is handled safely here because `SourceGraphic` is initialized nil and guarded with `Assigned`; the function returns false after any directory side effect.

**Dimensions and output size**

`Aspect := Min(NewWidth/sourceWidth, NewHeight/sourceHeight)`. The output fits within the box with no crop/pad and can be upscaled. Both sides are rounded independently. Velox does not reject zero/negative dimensions, zero-rounded sides, extreme allocation requests or target pixel counts.

**Output format and transparency**

Destination extension selects encoding:

- `.jpg`/`.jpeg`: new non-progressive JPEG at supplied quality;
- `.png`: new PNG at mapped compression level;
- other suffix: false after decoding/resizing, with no output save.

JPEG-to-PNG changes encoding but cannot recreate metadata lost during bitmap conversion. PNG-to-JPEG cannot represent alpha and has no configurable background/matte. The GDI bitmap stretch is not explicitly alpha-aware; even PNG-to-PNG transparency is not guaranteed to survive correctly.

**Quality mapping defect**

JPEG direct quality outside `1..100` raises `ERangeError` in current range-checked builds. PNG `MapTo10` maps every input 90 or greater to level 10, which raises `ERangeError` against installed range `0..9`; level 0 cannot be requested. PNG setting changes lossless work, not visual quality.

**Metadata and orientation**

The function creates new bitmap/encoder objects and has no copy policy for EXIF/IPTC/XMP, color profiles, JPEG markers, PNG ancillary chunks or EXIF orientation. Treat output as newly rendered pixels, not a metadata-preserving transformation.

**Destination effects and atomicity**

- `CheckFolder` may create directories before source is fully validated.
- Bare filename causes installed `ForceDirectories('')` to raise.
- Existing file is deleted before save; deletion result is ignored.
- No temporary file, atomic rename, rollback or backup.
- Save failure after deletion loses prior destination.

**Side effects**

Reads/advances source, may create directories, allocates GDI resources, may delete destination and writes a file. Caller retains source ownership.

**Performance, limits and concurrency**

Multiple full pixel representations coexist, with no compressed-size, dimension or pixel-count limit. Untrusted images can exhaust memory/CPU/GDI handles. The wrapper supplies no VCL/GDI concurrency synchronization.

**Related entries**

- [`ResizeImageStreamToStream`](ResizeImageStreamToStream.md) preserves detected source format in a stream.
- [`ResizeImageFileToFile`](ResizeImageFileToFile.md) chooses source type from filename extension.
- [`CompressImageStreamToFile`](CompressImageStreamToFile.md) re-encodes without resizing and ignores output suffix for format.

**External references**

- [Embarcadero `TCanvas.StretchDraw`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Graphics.TCanvas.StretchDraw)
- [Embarcadero `TStream.Position`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Position)
- [Embarcadero `TJPEGImage`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Imaging.jpeg.TJPEGImage) and [`TPngImage`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Imaging.pngimage.TPngImage)
- [Free Pascal `TStream`](https://www.freepascal.org/docs-html/rtl/classes/tstream.html) - compatible stream context; VCL/GDI define current image behavior.

<small>Created 2026-07-15</small>
