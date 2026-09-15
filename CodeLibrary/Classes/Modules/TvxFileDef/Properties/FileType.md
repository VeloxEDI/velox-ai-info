---
title: FileType
description: Gets or changes the File Definition format discriminator that selects its engine, data type and downstream format-specific behaviour.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-definition, file-type, engine]
---

```Delphi
property FileType: TvxFileType read write;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Source <> nil then
    Value := Source.FileType
  else
    Value := -1;
end;
```

### Usage

`FileType` gets or changes the File Definition format discriminator that selects its engine, data type and downstream format-specific behaviour.

**Errors and concurrency**

The setter does not report incompatibility. If later engine creation has no supported branch, Velox logs a critical error and subsequent use can fail because no engine exists. Script enum assignments should use named values and avoid ordinal casts.

FileType is unsynchronised mutable state. Do not change it while the definition is active or being used by another action/thread.

### Additional Technical Info
`FileType` identifies the configured file format and controls which native engine/branches are used.

| Value | Meaning and principal native selection |
|---|---|
| `fftFlatFile` (0) | Flat/fixed/delimited text |
| `fftXMLFile` (1) | XML, XSD/schema path and XML engine |
| `fftEDIFile` (2) | EDI |
| `fftExcelFile` (3) | Excel workbook |
| `fftJSONFile` (4) | JSON |
| `fftExcel` (5) | Legacy value; setter/transfer immediately normalises it to `fftExcelFile` |

See [`TvxFileType`](../../../../Types/Enumerations/TvxFileType.md) for the registered enumeration.

**Setter behaviour**

The setter stores the supplied enum except that legacy `fftExcel` is replaced by `fftExcelFile`. A subsequent read therefore returns `fftExcelFile`, not `fftExcel`.

No engine is created, active dataset rebuilt, schema cache cleared, configuration validated or file opened by the setter. Concrete design-time File Definition classes set their proper type during construction; execution transfer copies that type with the same legacy normalisation.

**Downstream effects**

FileType controls:

- flat/XML/EDI/Excel/JSON engine construction for later load/save;
- the module/data type used by the definition;
- format-specific design, schema, root/data-view and conversion branches; and
- MIME selection and other output behaviour.

Changing FileType after the DataModule/schema/engine state has been prepared can make existing configuration/state inconsistent with future operations. Treat it as definition configuration, not a per-record switch.

**Related entries**

- [`TvxFileDef`](../../TvxFileDef.md) — engine and lifecycle overview.
- [`ProcessXSDSchema`](../Methods/ProcessXSDSchema.md) — XML-specific schema path.
- [`ProcessExcelTemplate`](../Methods/ProcessExcelTemplate.md) — Excel-specific template path.

<small>Created 2026-07-15</small>
