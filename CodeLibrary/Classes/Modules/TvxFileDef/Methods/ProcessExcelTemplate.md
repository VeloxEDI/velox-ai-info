---
title: ProcessExcelTemplate
description: Returns the configured Excel template path after replacing only its default-directory token with Velox's application Excel folder.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, file-definition, excel-template, path]
---

```Delphi
function ProcessExcelTemplate: String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Dest <> nil then
    Value := Dest.ProcessExcelTemplate
  else
    Value := '';
end;
```

### Usage

`ProcessExcelTemplate` returns the configured Excel template path after replacing only its default-directory token with Velox's application Excel folder.

**Directory side effect**

When the default token is present, obtaining the application Excel path calls Velox's configuration-path helper. That helper attempts to create the base Excel directory if it does not exist. With no default token, this method performs string copying only.

This subtle side effect does not create the configured workbook/template and is not proof that the final path is writable.

**Errors, security and concurrency**

- The processor itself does not log or catch path-helper exceptions.
- Relative/untrusted configured text can escape the intended folder.
- The folder and file are accessed in Velox process/service identity.
- Repeated calls read live mutable configuration; concurrent changes are unsynchronised.

### Additional Technical Info
`ProcessExcelTemplate` resolves the File Definition's configured Excel workbook template path.

**Implementation**

The method copies the stored template string. If it contains `<DEFAULTDIR>` (matched without case sensitivity by Velox's tag helper), that token is replaced with the application Excel path, normally the shared Velox data root plus `Excel\`.

It does not process action locals, data fields, general/system tags, `<FILENO>` or `<COUNTER>`. It does not canonicalise the result, check the final file, validate the extension/password or open a workbook.

**Downstream Excel behaviour**

During Excel output:

- an empty resolved path means “create/use output without a template”;
- a nonempty path must exist and open successfully;
- optional auto-detection selects XLS or XLSX from the template extension; and
- opening can fail for a missing file, invalid password or workbook-library error.

Those failures occur in the Excel engine, not in this processor.

**Related entries**

- [`TvxFileDef`](../../TvxFileDef.md) — ownership and engine lifecycle.
- [`ProcessXSDSchema`](ProcessXSDSchema.md) — analogous Schema-folder resolution.
- [`FileType`](../Properties/FileType.md) — Excel engine selection.

<small>Created 2026-07-15</small>
