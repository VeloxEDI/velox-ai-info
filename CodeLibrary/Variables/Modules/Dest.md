---
title: "Dest"
description: "Provides the current destination file or database definition for the script context."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variable
  - destination
  - data-definition
---

```Delphi
Dest: TvxFileDef
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  if Dest <> nil then
    Value := Dest.ModuleName
  else
    Value := Null;
end;
```

### Usage

Provides the current destination file or database definition for the script context.

**Ownership, side effects and errors**

Velox owns the data definition. Never free it, retain it beyond execution or replace the public reference. Reading `ModuleName` is simple state access, but other members can open datasets/files, alter state or raise configuration/I/O exceptions. Those contracts belong to the definition/member being used.

### Additional Technical Info
`Dest` exposes the live destination data-definition object supplied to the current scripter. The concrete compile-time/runtime class can be `TvxFileDef` or `TvxDBDef`, depending on the configured context.

**Indexed and effective declarations**

The generated Code Library index records the default declaration:

During actual compilation, Velox instead registers:

```Delphi
Dest: TvxDBDef   // when FDest is a database definition
Dest: TvxFileDef // when it is a file definition or no instance is set
```

This source-dependent declaration is material: members specific to one subclass are available only when the script compiles for that subclass. Common module/data-definition members such as `ModuleName` are the portable choice.

**Implementation**

`RegisterVariables` examines the current `FDest` object and registers the corresponding class. `SetVariableInstances` binds the public name only when that object is assigned. The declaration is still present with the default file-definition type when no instance exists, allowing reusable script source to compile.

Before compilation, if no destination has been supplied, `SetScript` assigns `FDest := FSource`. The destination then points to exactly the source object.

**Behaviour and availability**

- The reference can be nil/unbound in contexts without a destination definition; check it before member access.
- The object represents live host configuration/execution state, not a detached copy.
- `Dest` may alias `Source` exactly. When it does, property changes and method effects through either name affect the same object.
- File and database definitions expose different specialized members. Do not assume the indexed `TvxFileDef` type describes every execution.
- The reference is scoped to the compiled/executing scripter and can differ between actions or recompilations.
- Treat the reference as context, not authorization to access arbitrary files or databases.

**Performance and concurrency**

Retrieving the bound reference is constant-time. The underlying object is mutable and tied to its action/scripter; it is not a general cross-thread data transfer object.

**Related entries**

- [`Source`](Source.md) exposes the source definition and may be the same instance.
- [`DBCon`](DBCon.md) derives the first current database connection from `Source`.
- [`FileCon`](FileCon.md) is a separately injected file-connection accessor.

<small>Created 2026-07-15</small>
