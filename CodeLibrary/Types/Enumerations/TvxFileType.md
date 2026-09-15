---
title: TvxFileType
description: Selects the Velox file-definition engine for flat text, XML, EDI, Excel or JSON and retains one normalized legacy Excel member.
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, file, flat-file, xml, edi, excel, json]
---

```Delphi
TvxFileType = (fftFlatFile, fftXMLFile, fftEDIFile, fftExcelFile, fftJSONFile, fftExcel)
```

### Example

```Delphi
procedure ConfigureJSON(FileDef: TvxFileDef);
begin
  FileDef.FileType := fftJSONFile;
end;
```

### Usage

`TvxFileType` selects the Velox file-definition engine for flat text, XML, EDI, Excel or JSON and retains one normalised legacy Excel member.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| `fftFlatFile` | 0 | Flat/delimited/fixed-width text file engine; data type `fdtFlatFile`. |
| `fftXMLFile` | 1 | XML file engine; data type `fdtXMLFile`. |
| `fftEDIFile` | 2 | EDI file engine; data type `fdtEDIFile`. |
| `fftExcelFile` | 3 | Current Excel file engine; data type `fdtExcelFile`. |
| `fftJSONFile` | 4 | JSON file engine; data type `fdtJSONFile`. |
| `fftExcel` | 5 | Legacy Excel member; normalized immediately to `fftExcelFile`. |

#### Behavior and boundaries

- Changing `FileType` changes the engine expected to interpret the definition. Existing type-specific configuration may become irrelevant or invalid.
- `fftExcel` is not a second Excel format and cannot round-trip through the property; use `fftExcelFile` in all new scripts/configuration.
- Content-type defaults are `text/plain`, `application/xml`, `application/EDIFACT`, `application/vnd.ms-excel` and `application/json`, but actual payload validation still depends on the engine.
- Extension and file-type selection are independent. Do not trust a filename extension as proof that content matches the configured engine.
- Persist names rather than ordinals because this is a product configuration enum and new engine families can be inserted.

### Additional Technical Info
`TvxFileType` chooses the concrete parsing/writing engine and module type for a Velox file definition. It also maps the file definition to a higher-level data-module type.

`fftExcel` is a retained legacy member labelled `OLD`. The `TvxFileDef.FileType` setter immediately normalizes it to `fftExcelFile`, so reading the property back does not preserve the legacy member.

**External references**

- [RFC 8259 JSON](https://www.rfc-editor.org/rfc/rfc8259) - JSON interchange format.
- [W3C XML 1.0](https://www.w3.org/TR/xml/) - XML document format.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration concepts.

<small>Created 2026-07-15</small>
