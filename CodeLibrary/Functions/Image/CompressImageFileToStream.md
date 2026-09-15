---
title: "CompressImageFileToStream"
description: "Re-encodes a JPEG or PNG source file into a caller-owned writable stream without resizing it."
sidebar_position: 2
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
Function CompressImageFileToStream(
  const aOriginalImageFile: string;
  out aNewImageStream: TStream;
  const aQuality: integer): boolean
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
    // The out parameter is misleading: Output must already exist and be writable.
    Succeeded := CompressImageFileToStream(
      'C:\VeloxData\Examples\source.jpg', Output, 75);
    if Succeeded then
      Output.Position := 0;
    Value := Succeeded;
  finally
    Output.Free;
  end;
end;
```

### Usage

`CompressImageFileToStream` re-encodes a JPEG or PNG source file into a caller-owned writable stream without resizing it.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aOriginalImageFile` | `string`, `const` | Existing `.jpg`, `.jpeg` or `.png` source selected by case-insensitive extension. |
| `aNewImageStream` | `TStream`, `out` | Misdeclared destination. It must already refer to an open writable stream; the function never assigns or frees it. |
| `aQuality` | `integer`, `const` | Direct JPEG quality or defective mapped PNG compression level. |

**Returns**

`False` when the source file is absent or the destination stream reference is nil. `True` only after the selected VCL graphic completes `SaveToStream`. Other failures normally raise.

**Errors**

Codec, invalid quality, permission, read, memory and destination-write errors are raised to the script. An unsupported extension can cause an object-reference error. The function does not roll back bytes already written to the destination.

**Usage notes**

For a reusable memory stream, set `Position := 0` and `Size := 0` before the call. Validate extension and quality first. Do not interpret `out` as allocation or ownership transfer.

### Additional Technical Info
`CompressImageFileToStream` loads a JPEG or PNG chosen by source filename extension, re-encodes the same format, and writes it to a stream supplied and owned by the caller. It does not resize, allocate the destination stream, reset its position or truncate old contents.

The example is fictional and source-reviewed only. No image function or codec was executed.

**The `out` contract is defective**

Although the public declaration says `out`, the native body immediately reads `Assigned(aNewImageStream)` and later calls methods on that existing object. It never creates or assigns a stream. Modified PascalScript passes the existing variable by address, so scripts must construct it before calling, exactly as the example shows.

Treat the parameter operationally as `var`:

- caller creates the stream;
- caller ensures it is writable and, where required, seekable/resizable;
- caller selects its starting `Position` and clears/truncates it if necessary;
- caller remains responsible for freeing it, including after `False` or an exception.

Do not pass an uninitialized/nil variable expecting this function to return a new stream; it returns `False`.

**Implementation trace**

1. Return false if the source file does not exist or the destination reference is nil.
2. Select `TJPEGImage` from `.jpg`/`.jpeg` or `TPngImage` from `.png`.
3. Load the complete source file.
4. Set JPEG quality and force `Compress`, or assign the PNG `MapTo10` compression level.
5. Call `lImage.SaveToStream(aNewImageStream)` at the destination's current position.
6. Return true and free only the temporary graphic.

**Stream position, size and ownership**

`SaveToStream` writes from the destination's current `Position`. Velox does not set position zero, set size zero or remove any bytes beyond the newly written image. Consequences include:

- a new empty `TMemoryStream` receives a single image starting at byte 0;
- a nonzero position prefixes the image with existing data;
- writing over a longer previous image can leave a stale tail unless the caller truncates first;
- after success, the destination position is advanced by the encoded bytes;
- on exception, the stream can contain a partial image at an advanced position;
- the same stream may be reused only with explicit caller position/size management.

The function never frees the destination. Its `out` mode does not transfer ownership.

**Format and quality behavior**

The source extension chooses the encoder, so output bytes have the source format. There is no destination filename to request conversion.

- JPEG is lossy and assigns `aQuality` directly to the VCL `1..100` property. Current range-checked builds raise `ERangeError` below 1 or above 100.
- PNG is lossless. `MapTo10` maps negative..9 to 1, 10..89 to 2..9 and every input 90 or greater to 10. Current range-checked builds raise `ERangeError` because the installed property is `0..9`; level 0 is unreachable.

Higher PNG values do not improve visual fidelity. Treat PNG input 90 or greater as a source-proven defect pending the future test-bed/product stream.

**Unsupported-extension defect**

For an existing source whose suffix is not JPEG/PNG, the native local graphic pointer is uninitialized. Execution still dereferences and frees it. This is invalid-pointer behavior, commonly an access violation, rather than a reliable `False`. A recognized suffix with corrupt or mismatched bytes raises from the selected decoder.

**Side effects**

Reads/decodes a source file and mutates the destination stream from its current position. It does not modify the source file or close either caller resource.

**Performance, limits and concurrency**

The entire decoded image and encoded result are processed in memory. There are no source-size/dimension limits. A caller-provided stream may block or fail on write. VCL codec thread safety is not established by this wrapper; avoid unsynchronized concurrent use in a shared hosting context.

**Related entries**

- [`CompressImageFileToFile`](CompressImageFileToFile.md) writes destructively to a path.
- [`CompressImageStreamToStream`](CompressImageStreamToStream.md) takes image bytes from a seekable stream.
- [`ResizeImageFileToStream`](ResizeImageFileToStream.md) proportionally resizes before same-format stream output.
- [`SaveStreamToFile`](../File/SaveStreamToFile.md) can persist a completed caller-owned stream under its separate contract.

**External references**

- [Embarcadero `Vcl.Imaging.jpeg.TJPEGImage`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Imaging.jpeg.TJPEGImage)
- [Embarcadero `Vcl.Imaging.pngimage.TPngImage`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Imaging.pngimage.TPngImage)
- [Embarcadero `TStream.Position`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Position)
- [Free Pascal `TStream`](https://www.freepascal.org/docs-html/rtl/classes/tstream.html) - compatible stream position/size/ownership context; Velox uses installed Delphi/VCL.

<small>Created 2026-07-15</small>
