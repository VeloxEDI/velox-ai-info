---
title: fftEDIFile
description: Selects the Velox EDI file-definition engine and its EDI data-module mapping and media-type default.
sidebar_position: 61
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, edi, engine, module, mime]
---

```Delphi
fftEDIFile = 2
```

### Example

```Delphi
procedure ConfigureEDI(FileDef: TvxFileDef);
begin
  FileDef.FileType := fftEDIFile;
end;
```

### Usage

`fftEDIFile` selects the Velox EDI file-definition engine and its EDI data-module mapping and media-type default.

### Additional Technical Info
`fftEDIFile` is ordinal 2 of [`TvxFileType`](../../Types/Enumerations/TvxFileType.md). Assigning it to [`TvxFileDef.FileType`](../../Classes/Modules/TvxFileDef/Properties/FileType.md) selects the `TvxEDIFileEngine`, module class name `TvxFileDefEDI`, higher-level data type `fdtEDIFile`, and source-defined MIME value `application/EDIFACT`.

The enum chooses an engine family; it does not identify the EDI syntax/version, interchange/functional-group/message structure, separators, encoding, trading partner, validation rules or acknowledgement contract. Those are separate File Definition, schema/message and Flow configuration concerns.

#### Configuration and processing boundaries

- Confirm the exact EDI standard and implementation guide used by the trading partner. “EDI” alone is not a sufficient interchange contract.
- Segment/element delimiters can be payload-defined or configuration-defined depending on the format; do not infer them from the enum ordinal or filename extension.
- Engine selection does not validate existing type-specific configuration. Reusing a File Definition after changing type requires reviewing every format-specific option and data view.
- MIME metadata is a product default and can be insufficient for a partner/API that expects another registered/contract-specific media type.
- Input parsing and output writing still run in separate lifecycle operations and can fail after the type has been assigned.
- Persist symbolic member names rather than ordinal 2 in configuration exchanged outside the product.

The example changes configuration only and was source-reviewed; no EDI parser, file, schema, transport, runtime or image-function test was executed.

**Related Code Library entries**

- [`fftFlatFile`](fftFlatFile.md), [`fftXMLFile`](fftXMLFile.md), [`fftExcelFile`](fftExcelFile.md) and [`fftJSONFile`](fftJSONFile.md) - other engine families.

**External references**

- [RFC 1767: EDI content](https://www.rfc-editor.org/rfc/rfc1767) - EDIFACT-related Internet media-type context.

<small>Created 2026-07-15</small>
