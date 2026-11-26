---
title: FileCon
description: Returns the data definition's owned file-connection object, which exists before and independently of a successful configured-module load.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords: [velox, scripting, hidden-ancestor, data-definition, file-connection, lifecycle]
---

```Delphi
property FileCon: TvxFileCon read;
```

### Example

```Delphi
function RequireFileConnection(const Data: TvxFileDef): Boolean;
begin
  Result := False;
  if Data = nil then
  begin
    LogError('No data definition is available.');
    Exit;
  end;
  if Data.FileCon = nil then
  begin
    LogError('No file-connection object is available.');
    Exit;
  end;
  Result := True;
end;
```

This helper returns `False` after logging failure. The calling event must check the result and `Exit` before doing further work; an `Exit` inside the helper does not exit its caller. Follow [mandatory script failure handling](../../../../../instructions/scripts/failure-handling.md).

### Usage

`FileCon` returns the data definition's owned file-connection object, which exists before and independently of a successful configured-module load.

- Use this property within a flow whose File Definition has already been opened/configured by Velox.
- Where available, inspect `ModuleLoaded` and the required path/property values rather than treating non-nil as load proof.
- File operations through the returned object have their documented filesystem and logging effects.

### Additional Technical Info
`FileCon` exposes the `TvxFileCon` object owned by a data definition. It is most relevant to file definitions; database-only definitions can still own the base object.

#### Source-backed behaviour

`TvxDataDef.Create` constructs `FFileCon := TvxFileCon.Create(Self)`, and this property returns that field directly. The object therefore normally exists even when no file-connection GUID is configured and before `SetFileConnection` has loaded a module into it.

Native `SetFileConnection` rejects an empty configured GUID, otherwise loads that module into the existing object and records success separately in `FileConLoaded`. That state property is not registered on this script surface. Consequently, non-nil does not prove that `ModuleLoaded` is true or that paths and behaviours came from the intended saved File Connection.

Reset keeps the object but resets its runtime state. The data definition owns its lifetime; retaining it after the owner is freed is unsafe.

#### Related entries

- [`TvxFileCon`](../../../Modules/TvxFileCon.md) documents the returned class.
- [`ModuleLoaded`](../../TvxModule/Properties/ModuleLoaded.md) explains why its writable flag is not a load operation.
- [`TvxFileDef`](../../../Modules/TvxFileDef.md) is the visible data-definition descendant commonly using this property.

<small>Created 2026-07-15</small>
