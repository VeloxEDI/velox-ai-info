---
title: "FileCon"
description: "Returns the file connection explicitly supplied to the current Velox script item."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variable
  - file-connection
  - execution-context
---

```Delphi
function FileCon: TvxFileCon;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Connection: TvxFileCon;
begin
  Connection := FileCon;
  if Connection <> nil then
    Value := Connection.ModuleName
  else
    Value := Null;
end;
```

### Usage

`FileCon` returns the file connection explicitly supplied to the current Velox script item.

**Value and availability**

The function returns `FFileConInstance` when assigned, otherwise nil. `TvxScriptItem.SetFileCon` supplies this field when the host assigns the script item's `FileCon` property.

**Ownership, errors and performance**

Velox owns the returned `TvxFileCon`; never free it or retain it beyond the current execution. The getter is constant-time and its absent-context path returns nil. Errors and side effects from member calls follow the documented connection member.

### Additional Technical Info
`FileCon` is a function-backed context value that returns the `TvxFileCon` explicitly injected into the current scripter. It is intended to expose the most recent connection associated with the script item/action execution.

**Implementation**

`EngineCompile` registers `TvxScripter.FileCon` as a method in the Modules variable category. Each call checks the current `FFileConInstance`; it does not derive a file connection from [`Source`](Source.md), search configuration or allocate a new module.

**Behaviour and edge cases**

- The result can be nil in contexts that do not inject a file connection.
- It may differ from a file connection reachable through Source/Dest; this accessor returns the explicitly supplied instance only.
- A non-nil result does not prove that a path exists, credentials are valid or a remote/local endpoint is reachable.
- Repeated calls re-read the current field. Store the result locally for one logical operation so nil/identity checks and member calls use the same reference.
- Calling the accessor has no file I/O, while later methods on the returned module can read/write files or external systems.

**Related entries**

- [`Source`](Source.md) and [`Dest`](Dest.md) expose data definitions rather than this injected connection.
- [`DBCon`](DBCon.md) derives its result from Source's first database-connection link.

<small>Created 2026-07-15</small>
