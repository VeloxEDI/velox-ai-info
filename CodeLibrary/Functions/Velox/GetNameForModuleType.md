---
title: "GetNameForModuleType"
description: "Returns Velox's display label for a recognized module class name, or echoes an unknown name unchanged."
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - module
  - class-name
  - display-label
---

```Delphi
Function GetNameForModuleType( aType : string) : string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetNameForModuleType('TvxActionMan'); // 'Flow'
end;
```

### Usage

`GetNameForModuleType` returns Velox's display label for a recognized module class name, or echoes an unknown name unchanged.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aType` | `string`, by value | Exact Velox module type name to translate. The function does not trim or normalise it. |
| Result | `string` | Fixed label for a recognized value; otherwise exactly `aType`. |

### Additional Technical Info
`GetNameForModuleType` translates selected internal Velox module class names into short user-facing labels. It uses a fixed, case-sensitive source table. If `aType` is not recognized, the function returns the supplied text unchanged.

This is a display-name helper, not a class lookup, type test or module loader.

**Complete recognized mapping**

| Input class name(s) | Result |
|---|---|
| `TvxDBCon` | `DB Connection` |
| `TvxDBDef` | `DB Definition` |
| `TvxFileCon` | `File Connection` |
| `TvxFileDefXML`, `TvxFileDefFlat`, `TvxFileDefJSON`, `TvxFileDefExcel`, `TvxFileDefEDI` | `File Definition` |
| `TvxTransportHTTPIn`, `TvxTransportIMAP`, `TvxTransportPOP`, `TvxTransportFTPIn`, `TvxTransportSFTPIn`, `TvxTransportLANIn`, `TvxTransportMSMQIn`, `TvxTransportIBMMQIn` | `Inbound Transport` |
| `TvxTransportHTTPOut`, `TvxTransportFTPOut`, `TvxTransportSFTPOut`, `TvxTransportLANOut`, `TvxTransportMSMQOut`, `TvxTransportIBMMQOut`, `TvxTransportSMTP` | `Outbound Transport` |
| `TvxReport` | `Report` |
| `TvxSQLScript` | `SQL Script` |
| `TvxScriptlet` | `Scriptlet` |
| `TvxMap` | `Map` |
| `TvxActionMan` | `Flow` |
| `TvxAPI` | `API` |
| `TvxLog` | `Log` |
| `TvxFolder` | `Folder` |

**Implementation**

The scripting import binds directly to `vxCommon.GetNameForModuleType`. That function evaluates an `if`/`else if` chain of exact Delphi string equalities in the order represented above and falls back to `Result := aType`.

**Behaviour and edge cases**

- Matching is case-sensitive: `TvxMap` returns `Map`, while `tvxmap` is unknown and returns `tvxmap`.
- Leading or trailing whitespace prevents recognition and is preserved in the fallback result.
- Empty input returns an empty string.
- Several concrete transport/file-definition subclasses intentionally share one general label.
- Base or newer/custom class names not listed above are echoed. An echoed value does not prove that the class exists or is supported.
- `TvxActionMan` deliberately displays as `Flow`; scripts should not derive display labels by removing the `Tvx` prefix.
- Because unknown text is returned rather than marked with `Null` or a Boolean, callers cannot detect recognition by testing for a non-empty result. Compare against a known input/label only when recognition matters.

**Side effects, errors and performance**

The function is pure, performs no I/O and changes no state. It performs a bounded fixed comparison chain. Ordinary string input has no domain-specific error path.

**Related entries**

- This helper accepts internal Delphi class names. The FID functions instead resolve configured `MODULENAME` values to persistent identifiers.
- Treat the returned value as a label only; use the actual module metadata and APIs for type-sensitive behavior.

<small>Created 2026-07-15</small>
