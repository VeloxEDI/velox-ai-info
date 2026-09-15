---
title: fftExcel
description: Retains the legacy Excel file-type ordinal but is immediately normalized to fftExcelFile by current File Definition code.
sidebar_position: 62
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, file, excel, legacy, deprecated, normalization]
---

```Delphi
fftExcel = 5
```

### Example

```Delphi
procedure NormalizeLegacyExcel(FileDef: TvxFileDef);
begin
  FileDef.FileType := fftExcel;
  // Reading FileType now returns fftExcelFile, not fftExcel.
end;
```

### Usage

Retains the legacy Excel file-type ordinal but is immediately normalised to fftExcelFile by current File Definition code.

### Additional Technical Info
`fftExcel` is ordinal 5 of [`TvxFileType`](../../Types/Enumerations/TvxFileType.md) and is retained solely for legacy compatibility. The native display array labels it `OLD`, and its data-type mapping points to `fdtExcelFile`.

The [`TvxFileDef.FileType`](../../Classes/Modules/TvxFileDef/Properties/FileType.md) setter immediately rewrites this value to [`fftExcelFile`](fftExcelFile.md). The File Definition transfer/copy path performs the same normalization for older stored objects. Concrete engine creation and module-class selection contain branches for `fftExcelFile`, not `fftExcel`.

Consequences:

- The value cannot round-trip through the property: write ordinal 5, read current ordinal 3.
- It does not select a different workbook format, compatibility mode or old engine.
- Equality checks for `FileDef.FileType = fftExcel` are normally false after assignment.
- New scripts/configuration must use `fftExcelFile`; retain this member only when interpreting/migrating old serialized configuration.
- Do not persist the ordinal as an external contract. A normalized save may legitimately change 5 to 3 without changing the selected engine.

Changing to this member can still trigger receiver-specific configuration effects before/after normalization; review Excel settings and data views. The constant itself performs no file conversion and does not rewrite an existing workbook.

The example demonstrates source-defined normalization and was not executed; no workbook, migration, runtime or image-function test was run.

**Related Code Library entries**

- [`fftExcelFile`](fftExcelFile.md) - the only current Excel selection for new work.
- [`TvxFileType`](../../Types/Enumerations/TvxFileType.md) - complete engine and normalization contract.

<small>Created 2026-07-15</small>
