---
title: fftExcelFile
description: Selects the current Velox Excel file-definition engine and is the normalization target for the legacy fftExcel member.
sidebar_position: 63
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, excel, workbook, engine, mime]
---

```Delphi
fftExcelFile = 3
```

### Example

```Delphi
procedure ConfigureExcel(FileDef: TvxFileDef);
begin
  FileDef.FileType := fftExcelFile;
end;
```

### Usage

`fftExcelFile` selects the current Velox Excel file-definition engine and is the normalization target for the legacy fftExcel member.

### Additional Technical Info
`fftExcelFile` is ordinal 3 of [`TvxFileType`](../../Types/Enumerations/TvxFileType.md). It selects `TvxExcelFileEngine`, module class `TvxFileDefExcel`, data type `fdtExcelFile`, and the current source-defined MIME default `application/vnd.ms-excel`. Legacy [`fftExcel`](fftExcel.md) assignments are normalized to this member.

The member selects the Excel engine family but does not specify workbook container/version, sheet, range, header layout, cell type conversion, formulas, date systems or multiple-data-view mapping. Those behaviors are configured on the Excel File Definition and interpreted by the engine at open/save time.

#### Configuration and data boundaries

- Review sheet and data-view settings when changing an existing File Definition to Excel; type assignment does not translate flat/XML/JSON configuration.
- Spreadsheet cell display, stored type and formatted text can differ. Define the conversion contract for dates, numbers, blanks, booleans and formulas.
- The legacy MIME value does not distinguish modern Open XML workbooks from older binary formats. Do not treat it as proof of payload format; validate the actual configured/produced workbook.
- Input files may be locked by another process; engine code includes lock-wait behavior, and type selection alone does not guarantee availability.
- Write lifecycle logging can be created before all workbook processing completes. Use Flow/module status to determine success.
- Avoid the legacy alias in all new scripts and persisted symbolic configuration.

The example only selects the engine and was source-reviewed; no spreadsheet, Excel process, file lock, runtime or image-function test was executed.

**External references**

- [IANA `application/vnd.ms-excel`](https://www.iana.org/assignments/media-types/application/vnd.ms-excel) - media-type registration referenced by the product default.

<small>Created 2026-07-15</small>
