---
title: fftFlatFile
description: Selects the flat-text file engine for delimited or fixed-width records, with a delimiter-sensitive MIME default.
sidebar_position: 64
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, flat-file, delimited, fixed-width, csv]
---

```Delphi
fftFlatFile = 0
```

### Example

```Delphi
procedure ConfigureFlatFile(FileDef: TvxFileDef);
begin
  FileDef.FileType := fftFlatFile;
end;
```

### Usage

`fftFlatFile` selects the flat-text file engine for delimited or fixed-width records, with a delimiter-sensitive MIME default.

### Additional Technical Info
`fftFlatFile` is ordinal 0 of [`TvxFileType`](../../Types/Enumerations/TvxFileType.md). It selects `TvxFlatFileEngine`, module class `TvxFileDefFlat`, and data type `fdtFlatFile` for delimited or fixed-width text records.

The File Definition's current MIME calculation is conditional:

| File settings | MIME value |
|---|---|
| Delimited and Delimiter = 9 (tab) | `text/tab-separated-values` |
| Delimited with any other delimiter | `text/csv` |
| Not delimited (for example fixed width) | `text/plain` |

This is a broad product heuristic. A pipe/semicolon/custom-delimited file is still labelled `text/csv`, and the value does not declare charset, header presence, quoting or record delimiters.

#### Required format decisions

- Choose delimited versus fixed width and define field/record positions unambiguously.
- For delimited data, define delimiter, quote/escape behavior, embedded line breaks, blank versus null values, header rows and trailing empty fields.
- For fixed width, ensure all applicable data views agree on the fixed record size; product code disables the shared-size optimization when sizes differ.
- Configure encoding, BOM and record delimiter explicitly or through documented detection policy. A String/filename extension does not establish encoding.
- Review trimming, invalid/truncated data and undefined/null-record behavior because they affect whether a file is accepted or merely logged with warnings/issues.
- Type selection does not inspect a sample file and does not migrate configuration from another engine.

The example only selects the engine and was source-reviewed; no CSV, fixed-width, encoding, filesystem, runtime or image-function test was executed.

**External references**

- [RFC 4180: CSV common format](https://www.rfc-editor.org/rfc/rfc4180) - conventional CSV syntax; Velox can be configured more broadly.

<small>Created 2026-07-15</small>
