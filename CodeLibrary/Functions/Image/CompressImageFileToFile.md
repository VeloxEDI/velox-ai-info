---
title: "CompressImageFileToFile"
description: "Re-encodes a JPEG or PNG source file into its original format at a destination path using the requested compression setting."
sidebar_position: 1
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
  - file
  - destructive
---

```Delphi
Function CompressImageFileToFile(
  const aOriginalImageFile, aNewImageFile: string;
  const aQuality: integer): boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Illustrative only: the destination is deleted before the new file is saved.
  Value := CompressImageFileToFile(
    'C:\VeloxData\Examples\source.jpg',
    'C:\VeloxData\Examples\compressed.jpg',
    75);
end;
```

### Usage

`CompressImageFileToFile` re-encodes a JPEG or PNG source file into its original format at a destination path using the requested compression setting.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aOriginalImageFile` | `string`, `const` | Existing source path. Only case-insensitive `.jpg`, `.jpeg` and `.png` extensions are recognized. |
| `aNewImageFile` | `string`, `const` | Destination path. Its extension does not select or convert the encoded format. Its directory can be created. |
| `aQuality` | `integer`, `const` | Passed directly to JPEG quality; transformed by the defective `MapTo10` mapping for PNG compression level. See below. |

**Returns**

`True` only after `SaveToFile` completes. `False` is returned when the source does not exist or `CheckFolder` returns false. Many other failures raise instead of returning false, including malformed images, invalid parameters and write errors.

**Format behavior**

The source extension selects the graphic class and therefore the bytes written. A JPEG source saved to `result.png` still contains JPEG data; a PNG source saved to `result.jpg` still contains PNG data. Consumers that trust the destination suffix can then misclassify the file. Use matching destination extensions, or use a Resize function whose file destination explicitly selects JPEG/PNG output.

JPEG is decoded/re-encoded with VCL `TJPEGImage`, so the operation is lossy even when the dimensions do not change. PNG is lossless; its setting changes compression effort/size, not visual image quality.

**Usage notes**

Validate source extension, destination directory, quality range and resource limits before calling. Write to a new temporary path and replace the governed destination only after success when loss of the previous file is unacceptable.

### Additional Technical Info
`CompressImageFileToFile` loads a JPEG or PNG chosen from the source filename extension, applies the format's compression setting, and saves the same encoded format to a destination file. It does not resize pixels and does not choose the output format from the destination extension.

The call can create destination directories and replace an existing destination non-atomically. The example is fictional and source-reviewed only. In accordance with the documentation boundary, no image function or codec was executed.

**Implementation trace**

1. Initialize `Result := False`.
2. Return false if `FileExists(aOriginalImageFile)` is false.
3. Call `CheckFolder(aNewImageFile)`. This extracts the destination directory and creates it recursively when absent.
4. Select `TJPEGImage` for source `.jpg`/`.jpeg` or `TPngImage` for source `.png`.
5. Load the entire source with `LoadFromFile`.
6. For JPEG, assign `CompressionQuality := aQuality` and call `Compress` immediately. For PNG, assign `CompressionLevel := MapTo10(aQuality)`.
7. If the destination exists, call `DeleteFile` and ignore its Boolean result.
8. Call the selected graphic object's `SaveToFile`; set `Result := True`.
9. Free the graphic in `finally`.

**Quality mapping and defect**

| Source | Handling |
|---|---|
| JPEG | `aQuality` is assigned directly to `TJPEGImage.CompressionQuality` (`1..100`). Current Velox builds enable range checking, so values below 1 or above 100 raise `ERangeError`. Higher valid values normally preserve more detail and produce larger files. |
| PNG | Velox clamps input to 0..100, calculates `(value div 10) + 1`, then caps only above 10. Negative through 9 becomes level 1; 10..89 becomes 2..9; every value 90 or greater becomes 10. Installed `TPngImage.CompressionLevel` is `0..9`. |

All current Velox, VeloxService, VeloxAPIService and VeloxTest Win32/Win64 configurations enable range checking. PNG input 90 or greater therefore raises `ERangeError` at `CompressionLevel := 10`, before encoding; level 0 is unreachable. Treat this as a source-proven product defect pending the future image test bed/fix.

**Unsupported-extension defect**

The local `lImage` and `lJPEG` variables are not initialized. For an existing file whose source extension is not `.jpg`, `.jpeg` or `.png`, no object is created, but execution still calls `lImage.LoadFromFile` and later `lImage.Free`. This is undefined invalid-pointer behavior and commonly presents as an access violation; it does not safely return `False`.

Validate the extension before calling. A recognized extension with nonmatching/corrupt bytes reaches the selected decoder and raises a codec exception.

**Destination and filesystem effects**

- Missing destination directories may be created, so the function has effects even before encoding succeeds.
- A bare filename such as `compressed.jpg` has an empty extracted directory. Installed `ForceDirectories('')` raises `EInOutError`; use a path with a directory component.
- Existing output is deleted before save. There is no temporary file, atomic rename, backup or rollback.
- The result of `DeleteFile` is ignored. A subsequent save determines whether the call succeeds or raises.
- If deletion succeeds but encoding/save fails, the previous output has already been lost.
- Source and destination may name the same file: loading occurs first, but the source is then deleted and replaced non-atomically.
- Existence checks race with concurrent file changes; no lock or stable snapshot is acquired by Velox.

**Image fidelity and metadata**

There is no pixel resize in this function. Re-encoding can still change JPEG pixels/compression artifacts and typically does not promise preservation of ancillary metadata, application markers, exact chunk layout or byte identity. Do not use it as a metadata-preserving file copy.

**Side effects**

Reads and decodes the source, may create directories, may delete an existing destination, and writes a new file. Codec work can allocate memory proportional to decoded dimensions.

**Errors**

Velox catches none. File permission/share errors, `ForceDirectories('')`, invalid quality ranges, decoder/encoder failures, corrupt/truncated input, memory/GDI failures and invalid-pointer behavior for unsupported extensions can propagate. `False` is not a complete failure channel.

**Performance, limits and concurrency**

The full image is decoded and encoded in memory. There is no file-size, pixel-count or dimension limit, so untrusted images can cause large memory/CPU use. The implementation uses VCL image classes and does not establish a documented thread-safety boundary; serialize calls if the hosting flow cannot guarantee safe VCL/GDI use.

**Related entries**

- [`CompressImageFileToStream`](CompressImageFileToStream.md) writes the source format to a pre-existing stream.
- [`CompressImageStreamToFile`](CompressImageStreamToFile.md) detects source format from stream bytes.
- [`ResizeImageFileToFile`](ResizeImageFileToFile.md) can select/convert output format from the destination extension while resizing.

**External references**

- [Embarcadero `Vcl.Imaging.jpeg.TJPEGImage`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Imaging.jpeg.TJPEGImage)
- [Embarcadero `Vcl.Imaging.pngimage.TPngImage`](https://docwiki.embarcadero.com/Libraries/Athens/en/Vcl.Imaging.pngimage.TPngImage)

<small>Created 2026-07-15</small>
