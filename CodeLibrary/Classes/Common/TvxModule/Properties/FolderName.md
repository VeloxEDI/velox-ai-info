---
title: FolderName
description: Gets or sets the module's cached folder display name independently of its folder GUID and without performing a database lookup.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, module, folder, name, cache]
---

```Delphi
property FolderName: string read write;
```

### Example

```Delphi
function ModuleLocationLabel(const Module: TvxDBCon): string;
begin
  Result := Module.FolderName + ' / ' + Module.ModuleName;
end;
```

### Usage

`FolderName` gets or sets the module's cached folder display name independently of its folder GUID and without performing a database lookup.

- Use it for display only after the module was loaded through the normal Velox path.
- Do not assign it as a substitute for moving/renaming a folder.
- If Velox code deliberately changes folder identity, keep both fields coherent through the supported configuration workflow.

### Additional Technical Info
`FolderName` is a cached/display string associated with [`FolderFID`](FolderFID.md). The property itself never resolves the folder table.

#### Source-backed behaviour

The script helper directly reads/writes `FFolderName`. Native `LoadModule` fills it from a left join to `VX_FOLDER`. A separate native `GetFolderName` method can query by GUID only when the cached field is empty, but that method is not what this property getter calls.

Setting this value does not change `FolderFID`, rename a folder, move the module or update configuration. A non-empty arbitrary/stale value can suppress the native fallback lookup and can later be written into module-relation description fields by a native save flow.

An empty result can mean the module is at the root, the folder is missing, the object has not been fully loaded or the cache was cleared. It is not sufficient existence evidence.

<small>Created 2026-07-15</small>
