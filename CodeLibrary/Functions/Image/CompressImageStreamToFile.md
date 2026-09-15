---
title: "CompressImageStreamToFile"
description: "Detects JPEG or PNG at the source stream's current position and re-encodes that format to a destination file."
sidebar_position: 3
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
  - file
  - destructive
---

```Delphi
Function CompressImageStreamToFile(
  const aOriginalImageStream: TStream;
  const aNewImageFile: string;
  const aQuality: integer): boolean
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
    Value := CompressImageStreamToFile(
      Source, 'C:\VeloxData\Examples\compressed.png', 70);
  finally
    Source.Free;
  end;
end;
```

### Usage

`CompressImageStreamToFile` detects JPEG or PNG at the source stream's current position and re-encodes that format to a destination file.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aOriginalImageStream` | `TStream`, `const` | Non-nil, nonempty, readable and seekable source. Detection/loading begins at its current `Position`; caller retains ownership. |
| `aNewImageFile` | `string`, `const` | Destination path. Directories can be created and an existing file can be deleted. The suffix does not select the encoder. |
| `aQuality` | `integer`, `const` | Direct JPEG quality or defective mapped PNG compression level. |

**Returns**

Returns `False` when the source is `nil`, its total `Size` is zero, or `CheckFolder` returns `False`. Returns `True` only after saving. Unsupported nonempty image content can raise an object-reference error instead of returning `False`.

**Errors**

Seek, read, codec, quality, path, permission, write and memory errors are raised to the script. `False` covers only the documented guard conditions, not every unsuccessful outcome.

**Usage notes**

Set `Position` explicitly, validate the encoded type, use a destination suffix matching that type, enforce size/dimension limits upstream and write to a temporary path when prior output must survive failure.

### Additional Technical Info
`CompressImageStreamToFile` probes the source stream at its current position for JPEG and then PNG, decodes the detected format, applies its compression setting, and writes the same format to a destination file. The destination extension is ignored for format selection.

It consumes the source stream and can create directories/delete a prior destination. The example is fictional and source-reviewed only; no image function or codec was executed.

**Implementation trace**

1. Reject nil source or `aOriginalImageStream.Size = 0`.
2. Call `CheckFolder(aNewImageFile)` to verify/create the directory.
3. Call `TJPEGImage.CanLoadFromStream` at the current position; if false, call `TPngImage.CanLoadFromStream`.
4. Instantiate the detected VCL graphic and call `LoadFromStream` from the same starting position.
5. Set JPEG quality and call `Compress`, or set PNG `MapTo10(aQuality)`.
6. Delete an existing destination, ignoring the deletion result.
7. Save the same graphic class to the destination; return true.
8. Free the temporary graphic; never free the caller stream.

**Detection and source-position contract**

Installed VCL probes save the starting position, read a small signature, and restore that position in `finally`. JPEG checks SOI plus a limited following-marker pattern; PNG checks the exact eight-byte PNG signature. The subsequent decoder consumes from that position.

The wrapper therefore requires a stream that supports `Size`, reading, seeking and position assignment. A forward-only stream is unsuitable even if it contains valid bytes. `Size = 0` tests total stream size, not remaining bytes; a stream positioned at its end can be nonempty, pass the guard and then fail detection/decoding.

After a normal decode, the source position is advanced (ordinarily to the consumed end). Velox does not restore it. On error it may be partially advanced. Save the original position and restore it in caller code if the stream must be reread.

**Output-format mismatch risk**

The detected source class is saved unchanged. JPEG bytes written to `output.png` remain JPEG; PNG bytes written to `output.jpg` remain PNG. The output filename is not a conversion request. This can create content/extension disagreement that downstream systems misinterpret.

**Quality behavior and PNG defect**

- JPEG assigns `aQuality` directly to `CompressionQuality` (`1..100`) and performs lossy re-encoding. Current range-checked builds raise `ERangeError` outside that range.
- PNG is lossless. `MapTo10` maps negative..9 to 1, 10..89 to 2..9 and every input 90 or greater to 10. Current range-checked builds raise `ERangeError` because installed `TPngImage.CompressionLevel` accepts only `0..9`; level 0 is unreachable.

Do not use PNG input 90 or greater until the implementation is corrected and covered by the future image test bed.

**Unsupported-content defect**

`lImage` and `lJPEG` are not initialized. If neither signature probe accepts the stream, the function still calls `lImage.LoadFromStream` and later frees the indeterminate pointer. Invalid-pointer/access-violation behavior can result. Prevalidate trusted JPEG/PNG bytes; do not rely on the Boolean result for arbitrary content.

**Destination effects and failure atomicity**

- Missing directories can be created before decoding/saving finishes.
- A bare destination filename yields `ForceDirectories('')` and raises `EInOutError`.
- Existing output is deleted before the new save; no temporary file, atomic replacement or rollback exists.
- If deletion succeeds and saving fails, the previous file is gone.
- File existence and directory checks are race-prone and do not lock the path.

**Side effects**

Reads and advances the source, may create directories, deletes/replaces destination content and performs substantial codec allocation. Caller retains/frees the source.

**Performance, limits and concurrency**

Full decode and re-encode; no remaining-length, file-size, pixel-count or dimension cap. Untrusted compressed data can cause disproportionate CPU/memory use. The wrapper provides no VCL thread-safety synchronization.

**Related entries**

- [`CompressImageStreamToStream`](CompressImageStreamToStream.md) writes to a caller-owned stream.
- [`CompressImageFileToFile`](CompressImageFileToFile.md) chooses input format from a filename extension.
- [`ResizeImageStreamToFile`](ResizeImageStreamToFile.md) selects output format from the destination suffix and resizes.

**External references**

- [Embarcadero `Vcl.Imaging.jpeg.TJPEGImage`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Imaging.jpeg.TJPEGImage)
- [Embarcadero `Vcl.Imaging.pngimage.TPngImage`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Imaging.pngimage.TPngImage)
- [Embarcadero `TStream.Position`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Classes.TStream.Position)
- [Free Pascal `TStream`](https://www.freepascal.org/docs-html/rtl/classes/tstream.html) - compatible stream contract context; signature/codec behavior here is VCL-specific.

<small>Created 2026-07-15</small>
