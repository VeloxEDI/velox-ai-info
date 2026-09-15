---
title: ExportFileName
description: Gets or sets the exact retained file path used by the next base module export instead of Velox's generated compare-folder filename.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, module, export, filename, filesystem]
---

```Delphi
property ExportFileName: string read write;
```

### Example

```Delphi
procedure SetExportTarget(const Module: TvxDBCon; const TargetFile: string);
begin
  Module.ExportFileName := TargetFile;
end;
```

### Usage

`ExportFileName` gets or sets the exact retained file path used by the next base module export instead of Velox's generated compare-folder filename.

- Prefer an absolute, access-controlled path with an existing parent directory.
- Do not build this value from untrusted input without canonicalisation and an allow-listed root.
- Clear it deliberately after a one-off export if the object will be reused.

### Additional Technical Info
`ExportFileName` stores the path that the base [`ExportModule`](../Methods/ExportModule.md) uses when it is non-empty.

#### Source-backed behaviour

The property is a direct field read/write with no normalisation, directory creation, extension enforcement, access check or sanitisation. New module construction sets it to empty. `Reset` and `ExportModule` do not clear it, so repeated exports from the same object continue to target the same path until code changes it or calls `New`.

An empty value selects Velox's generated compare-folder filename. A non-empty value is assigned exactly to the template. Relative paths resolve in the Velox process working directory. The terminal export opens with exclusive sharing and create/truncate semantics, so an existing file can be replaced.

Assignment itself performs no I/O and does not persist this transient field to module configuration. The later export performs the file and dialog effects.

<small>Created 2026-07-15</small>
