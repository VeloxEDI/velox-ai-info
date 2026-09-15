---
title: Active
description: Gets or sets the live module enabled flag that is loaded from and saved to configuration but is not persisted by assignment alone.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, module, active, enabled, persistence]
---

```Delphi
property Active: Boolean read write;
```

### Example

```Delphi
procedure DisableLiveModule(const Module: TvxDBCon);
begin
  Module.Active := False;
  { This changes the object only; it does not call the native save workflow. }
end;
```

### Usage

`Active` gets or sets the live module enabled flag that is loaded from and saved to configuration but is not persisted by assignment alone.

- Do not use assignment as a supported enable/disable deployment operation unless the surrounding Velox flow explicitly saves and refreshes configuration.
- Treat it as mutable shared object state; restore intentional values when a script temporarily changes it.
- On a data definition, do not infer whether datasets or connections are open from this property.

### Additional Technical Info
`Active` is the module's configuration-level enabled flag. Assignment directly changes the current object field.

#### Source-backed behaviour

New modules default to true. `LoadModule` replaces the value from the module table's `ACTIVE` column; native add/save paths write it back. The script setter only assigns `FActive`: it performs no validation, database update, start/stop, cache notification or dependency traversal.

This inherited script property remains the base module enabled flag on data-definition descendants. `TvxDataDef` also declares a separate native read-only property named `Active` for whether its data source is open; that descendant property is not registered here and should not be confused with this value.

Changing the live field can influence later code that reads the same object, and a later native save may persist it. Other loaded instances/caches and service processes are not automatically updated.

#### Related entries

- [`ModuleLoaded`](ModuleLoaded.md) is a separate lifecycle-success flag.
- [`ModuleName`](ModuleName.md) has the same live-object-versus-persistence boundary.

<small>Created 2026-07-15</small>
