---
title: ModuleLoaded
description: Gets or directly overwrites the internal flag that native Velox sets after successful load/add/save operations and widely uses as a readiness guard.
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords: [velox, scripting, hidden-ancestor, module, loaded, lifecycle, internal-state]
---

```Delphi
property ModuleLoaded: Boolean read write;
```

### Example

```Delphi
function RequireLoadedModule(const Data: TvxDBCon): Boolean;
begin
  Result := False;
  if Data = nil then
  begin
    LogError('No module is available.');
    Exit;
  end;
  if not Data.ModuleLoaded then
  begin
    LogError('The module has not completed its native load.');
    Exit;
  end;
  Result := True;
end;
```

This helper returns `False` after logging failure. The calling event must check the result and `Exit` before doing further work; an `Exit` inside the helper does not exit its caller. Follow [mandatory script failure handling](../../../../../instructions/scripts/failure-handling.md).

### Usage

`ModuleLoaded` gets or changes the value Velox uses to indicate that a module completed a load, add or save operation. Treat it as read-only in scripts; setting it does not perform the missing load or save work.

- Use false as a signal to stop and let the owning Velox workflow load the module; scripts do not gain a supported load operation by toggling the flag.
- Do not use true as sole proof that every referenced child connection/module is loaded; validate the dependency as well.

### Additional Technical Info
`ModuleLoaded` is Velox's internal success/readiness flag. Although useful to read, the scripting surface also exposes a direct writer.

#### Source-backed behaviour

`New` and the start of `LoadModule` set the field false. Successful native load, add and save paths set it true after their database/template work completes. Numerous product call sites use it to decide whether to proceed, retry loading or release an object.

The script setter changes only `FModuleLoaded`. Setting true does not load configuration, allocate connections, validate children or make the object safe. Setting false does not unload, close, reset or free anything. It can therefore defeat or trigger native guards while the real object state remains unchanged.

The field is not protected by the module identity lock and is shared by every reference to the same live object.

#### Related entries

- [`Active`](Active.md) is the separate enabled flag.
- [`FileCon`](../../TvxDataDef/Properties/FileCon.md) is an example where a non-nil object can still be unloaded.

<small>Created 2026-07-15</small>
