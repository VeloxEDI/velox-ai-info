---
title: ExportModule
description: Writes the live module template to a configuration file but currently reports true even when its caught file-save operation fails.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, module, export, filesystem, defect]
---

```Delphi
function ExportModule: Boolean;
```

### Example

```Delphi
procedure ExportCopy(const Module: TvxDBCon; const TargetFile: string);
begin
  Module.ExportFileName := TargetFile;
  Module.ExportModule;
  { Current return value is unreliable: independently verify the file. }
end;
```

### Usage

`ExportModule` writes the live module template to a configuration file but currently reports true even when its caught file-save operation fails.

- Treat the return value as unreliable. Verify that the intended file exists and, for controlled automation, that it contains a newly written valid export.
- Use a dedicated non-customer path whose parent directory already exists. A pre-existing target can be truncated or replaced.
- Do not expose untrusted module names or paths; relative paths use the Velox process working directory and service accounts may resolve them unexpectedly.

### Additional Technical Info
`ExportModule` serialises the module's current in-memory template to a local `.cfg` file. It has destructive filesystem and user-interface effects.

#### Source-backed behaviour

PascalScript registers this as a virtual method. The base implementation selects [`ExportFileName`](../Properties/ExportFileName.md) when non-empty. Otherwise it builds `AppDataComparePath + ('Test' or 'Production') + ' - ' + ModuleName + '.cfg'` from the global `TestMode`; it does not make the base module name filesystem-safe.

The method assigns that path to the ReportBuilder template, forces ASCII template format and file output, then calls `SaveToFile`. The modified terminal first serialises the complete live module into memory and opens the target with exclusive sharing and `fmCreate`, which creates or truncates an existing file before writing.

On success, Velox optionally shows a success dialog. On exception it catches the error and shows an error dialog. However, after that handler returns, `ExportModuleInternal` unconditionally executes `Result := True`. The public result is therefore true after both a successful save and a caught save failure. Exceptions raised outside that inner save block can still propagate.

The target property is not cleared after the call. The only current native override is `TvxConfigTemplate`, which changes identity/name, requires included modules and clears its children; that hidden class is not a visible Code Library type.

#### Operational guidance

- Treat the return value as unreliable. Verify that the intended file exists and, for controlled automation, that it contains a newly written valid export.
- Use a dedicated non-customer path whose parent directory already exists. A pre-existing target can be truncated or replaced.
- Do not expose untrusted module names or paths; relative paths use the Velox process working directory and service accounts may resolve them unexpectedly.
- Export captures live in-memory state, which can differ from the last saved configuration database state.
- Expect dialogs on the base path; the native quiet-export flag is not exposed by this script surface.

#### Official file terminal references

- [Embarcadero: TFileStream.Create](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Classes.TFileStream.Create)
- [Free Pascal: TFileStream.Create](https://www.freepascal.org/docs-html/current/rtl/classes/tfilestream.create.html)

<small>Created 2026-07-15</small>
