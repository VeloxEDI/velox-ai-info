---
title: TvxFileDef
description: Represents a host-owned flat, XML, EDI, Excel or JSON data definition used as a flow Source or Dest.
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-definition, source, destination]
---

```Delphi
type TvxFileDef = class(TvxDataDef);
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  { In a script compiled with a file-backed Source. }
  if Source <> nil then
    Value := Source.FileType
  else
    Value := -1;
end;
```

### Usage

`TvxFileDef` represents a Velox-provided flat, XML, EDI, Excel or JSON data definition used as a flow Source or Dest.

**Errors, security and performance**

Schema/template paths are trusted configuration. Relative traversal, inaccessible mapped drives, unexpected schemas/templates and secrets in paths/password-protected workbooks can produce I/O, parsing or disclosure risk. Process methods are cheap except for possible base-directory creation; actual XML/Excel work is blocking and can be significantly more expensive.

### Additional Technical Info
`TvxFileDef` is Velox's data-definition module for flat text, XML, EDI, Excel and JSON files. The scripter registers `Source` and/or `Dest` as this class when the configured flow endpoint is file-backed.

**Declaration and acquisition**

Velox creates, loads, transfers and owns these modules. The scripting import registers no constructor; do not instantiate, free or retain a Source/Dest reference beyond its execution context.

Members declared by its DataDef/module ancestors remain documented at those declaring paths. This page covers only the generated `TvxFileDef` surface.

**Format and engine lifecycle**

[`FileType`](TvxFileDef/Properties/FileType.md) is the format discriminator:

| File type | Engine selected for later load/save |
|---|---|
| `fftFlatFile` | Flat/fixed/delimited text engine |
| `fftXMLFile` | XML engine with optional XSD loading/validation |
| `fftEDIFile` | EDI engine |
| `fftExcelFile` | Excel workbook engine |
| `fftJSONFile` | JSON engine |

The file engine is created for a load/save operation from the current type and then freed. A failed/unsupported type can leave no engine; configuration should be fixed rather than changed opportunistically during active processing.

Construction also creates XML/MSXML schema objects, assignment lists and XML processing state. Reset returns FileNo to 1 and clears per-run design/navigation state. Transfer copies configuration into the execution instance and normalises the legacy `fftExcel` value to `fftExcelFile`.

**Schema and template processing**

- [`ProcessXSDSchema`](TvxFileDef/Methods/ProcessXSDSchema.md) resolves the configured XSD's default-directory token to Velox's application Schema path.
- [`ProcessExcelTemplate`](TvxFileDef/Methods/ProcessExcelTemplate.md) resolves the Excel template token to the application Excel path.

These methods do not perform general action/data tag expansion. If the default token is present, resolving the application path can create its base directory. XSD/Excel consumers perform file checks and parsing/opening later.

**Mutable state and side effects**

- [`FileNo`](TvxFileDef/Properties/FileNo.md) increments on every read and is independent of FileCon's filename counter.
- Writing FileType changes future format/engine selection but does not rebuild an already active DataModule, schema cache or file engine.
- File loads/saves, XSD parsing and Excel template opening use the active Log, FileCon and service/process filesystem identity.
- Source/Dest objects and their datasets are mutable execution state, not thread-safe shared configuration.

**Related entries**

- [`Source`](../../Variables/Modules/Source.md) and [`Dest`](../../Variables/Modules/Dest.md) — context-owned module references.
- [`TvxFileType`](../../Types/Enumerations/TvxFileType.md) — registered format enumeration.
- [`TvxFileCon`](TvxFileCon.md) — file paths, naming and current I/O state.

<small>Created 2026-07-15</small>
