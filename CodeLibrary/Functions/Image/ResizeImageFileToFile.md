---
title: "ResizeImageFileToFile"
description: "Fits a JPEG or PNG file proportionally inside a requested box and writes JPEG or PNG selected by destination extension."
sidebar_position: 5
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
  - aspect-ratio
  - file
  - destructive
---

```Delphi
Function ResizeImageFileToFile(
  const aOriginalImageFile, aNewImageFile: string;
  const NewWidth, NewHeight, aQuality: integer): boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Fits inside 1200 x 1200; it does not create a square canvas.
  Value := ResizeImageFileToFile(
    'C:\VeloxData\Examples\source.png',
    'C:\VeloxData\Examples\resized.jpg',
    1200, 1200, 80);
end;
```

### Usage

`ResizeImageFileToFile` fits a JPEG or PNG file proportionally inside a requested box and writes JPEG or PNG selected by destination extension.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aOriginalImageFile` | `string`, `const` | Existing source selected by case-insensitive `.jpg`, `.jpeg` or `.png` extension. |
| `aNewImageFile` | `string`, `const` | Destination selected independently as JPEG or PNG by extension; directories may be created and existing content replaced. |
| `NewWidth` | `integer`, `const` | Width of the bounding box. Must be positive and realistically bounded by the caller; Velox does not validate it. |
| `NewHeight` | `integer`, `const` | Height of the bounding box. Must be positive and realistically bounded by the caller; Velox does not validate it. |
| `aQuality` | `integer`, `const` | Direct JPEG quality or defective mapped PNG compression level. It does not change the scaling algorithm. |

**Returns**

`False` for a missing source, failed `CheckFolder`, unrecognized source extension or unrecognized destination extension. `True` only after output save. Invalid dimensions, malformed images, quality errors and I/O failures generally raise.

**Errors**

Velox catches none. Invalid dimensions/quality, malformed input, unsupported codec details, permission/share failures, GDI/bitmap/encoder errors and memory exhaustion propagate. `False` is not the only failure channel.

**Usage notes**

Validate positive bounded dimensions and quality, inspect/normalize orientation and alpha upstream, choose the desired destination extension deliberately, and use a temporary output path for failure-safe replacement.

### Additional Technical Info
`ResizeImageFileToFile` decodes a JPEG/PNG chosen by source extension, scales it proportionally through a 32-bit VCL bitmap and Windows GDI `HALFTONE` stretch, then encodes JPEG/PNG chosen by destination extension. It can therefore convert between the two formats while resizing.

The requested dimensions define a bounding box, not exact output dimensions. The function can upscale. The example is fictional and source-reviewed only; no image function/codec was executed.

**Implementation trace**

1. Verify source existence and call `CheckFolder` for destination.
2. Allocate source/target `TBitmap`; initialize source/target graphic references to nil.
3. Create `TJPEGImage` or `TPngImage` from source extension and load it.
4. For JPEG, force `DIBNeeded`; assign the source graphic into a `pf32bit`, `bmDIB` bitmap.
5. Calculate `Aspect := Min(NewWidth / SourceWidth, NewHeight / SourceHeight)`.
6. Create target bitmap size `Round(SourceWidth * Aspect)` by `Round(SourceHeight * Aspect)`.
7. Set GDI stretch mode `HALFTONE`, reset brush origin and `StretchDraw` the source bitmap over the complete target rectangle.
8. Select a new JPEG or PNG from destination extension, assign the target bitmap and apply output compression. JPEG sets `ProgressiveEncoding := False`.
9. Delete an existing destination, save, return true; free all temporary graphics/bitmaps.

**Bounding-box calculation**

For a source `4000 x 2000` and box `1200 x 1200`, the scale is `min(0.3, 0.6) = 0.3`, producing approximately `1200 x 600`. There is no padding/cropping to `1200 x 1200`.

- Aspect ratio is preserved subject to independent integer rounding.
- If both requested dimensions exceed the source, `Aspect > 1` and the image is upscaled.
- One dimension generally meets the box boundary; the other is at or below it after rounding.
- Rounding can produce zero for an extremely small target side, causing bitmap/encoder failure.
- Zero/negative dimensions produce zero/negative scale or size and are not handled as Boolean false.
- Very large dimensions can overflow practical GDI/memory limits or exhaust process resources.

**Format conversion**

Unlike the Compress family, destination extension chooses output:

| Source | Destination | Result |
|---|---|---|
| JPEG | `.jpg`/`.jpeg` | Resized baseline/non-progressive JPEG. |
| PNG | `.png` | Resized PNG. |
| JPEG | `.png` | JPEG pixels converted through bitmap to PNG. |
| PNG | `.jpg`/`.jpeg` | PNG pixels converted through bitmap to JPEG. Transparency cannot be represented as JPEG. |
| any recognized source | other suffix | No target graphic; function returns false after decoding/resizing work. |

**Quality and compression defect**

JPEG assigns `aQuality` directly to range `1..100` and disables progressive output; current range-checked builds raise `ERangeError` outside that range. PNG `MapTo10` maps negative..9 to 1, 10..89 to 2..9 and every input 90 or greater to 10. Current builds raise `ERangeError` because installed `TPngImage.CompressionLevel` is `0..9`; level 0 is unavailable. PNG level changes lossless effort/size, not pixel quality.

**Metadata, orientation and transparency**

The operation creates a new bitmap and new encoder object. It does not copy EXIF/IPTC/XMP, JPEG application markers, PNG ancillary chunks, color profiles or original encoding layout. There is no explicit EXIF orientation normalization.

PNG transparency/alpha passes through `TBitmap` plus GDI `StretchDraw`, an ordinary bitmap/GDI path with no explicit alpha-aware resampling or background policy. Do not assume alpha is preserved correctly. PNG-to-JPEG has no configurable matte; verify/flatten transparencies before calling when appearance matters.

**Destination effects**

- `CheckFolder` can create directory trees before image success.
- A bare filename makes `ForceDirectories('')` raise `EInOutError`.
- Existing destination is deleted before save; no atomic replace, backup or rollback.
- Deletion result is ignored. Save failure after successful deletion loses prior output.
- Source and destination may be the same path; source is loaded first, then deleted/replaced non-atomically.

**Side effects**

Reads/decodes source, may create directories, allocates GDI bitmaps, may delete an existing destination and writes a new file.

**Performance, limits and concurrency**

At least source graphic, source bitmap, target bitmap and target graphic coexist. Memory is driven by decoded dimensions (roughly four bytes/pixel for each 32-bit bitmap plus codec state), not compressed file size. There is no decompression-bomb or maximum-output guard. The wrapper supplies no synchronization for VCL/GDI calls.

**Related entries**

- [`ResizeImageFileToStream`](ResizeImageFileToStream.md) preserves source format in a stream destination.
- [`ResizeImageStreamToFile`](ResizeImageStreamToFile.md) detects source bytes and selects output from destination extension.
- [`CompressImageFileToFile`](CompressImageFileToFile.md) re-encodes without resizing or destination-format conversion.

**External references**

- [Embarcadero `TCanvas.StretchDraw`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Graphics.TCanvas.StretchDraw)
- [Embarcadero `Vcl.Imaging.jpeg.TJPEGImage`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Imaging.jpeg.TJPEGImage)
- [Embarcadero `Vcl.Imaging.pngimage.TPngImage`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Imaging.pngimage.TPngImage)

<small>Created 2026-07-15</small>
