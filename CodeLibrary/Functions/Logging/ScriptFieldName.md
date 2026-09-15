---
title: "ScriptFieldName"
description: "Returns the current field or view map item's full descriptive path, or empty text in other script contexts."
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - logging
  - map
  - field
  - context
---

```Delphi
function ScriptFieldName: string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  LogInfo('Current map context: ' + ScriptFieldName);
end;
```

### Usage

`ScriptFieldName` returns the current field or view map item's full descriptive path, or empty text in other script contexts.

**Returns**

| Velox `MapItem` context | Result |
|---|---|
| `TvxFieldMap` | `ViewMap.Description + '.' + FieldMap.Description` |
| `TvxViewMap` | `ViewMap.Description` |
| Custom script item, action-level script, other type or `nil` | Empty string |

`TvxFieldMap.Description` normally resolves from its field description/name. Exact text depends on the loaded configuration.

### Additional Technical Info
`ScriptFieldName` inspects the native map item that owns the current scripter. For a field map it returns `<view description>.<field description>`; for a view map it returns that view's description; in every other context it returns an empty string.

The result is a human-readable configuration description, not a guaranteed field identifier, dataset column name or stable machine key. The example is source-reviewed and was not executed.

**Implementation trace**

1. Test `MapItem is TvxFieldMap`.
2. If true, call `TvxFieldMap.GetFullDescriptionPath`, which formats the parent view description, a literal dot, and the field description.
3. Otherwise test `MapItem is TvxViewMap`.
4. If true, call its inherited `GetFullDescriptionPath`, which returns `Description`.
5. Otherwise return `''`.

The field test is intentionally first because it needs the more specific two-part path.

**Context and identity limits**

The descriptions are editable configuration text. They can be empty, duplicated, renamed, localized or contain dots. `ScriptFieldName` performs no escaping, canonicalization or uniqueness check, so a returned dotted string cannot always be split unambiguously.

Do not persist it as the sole identity for later configuration updates. Use governed module/field identifiers exposed by an appropriate API when stable identity is required. It is suitable for log context and diagnostics.

An empty result does not necessarily mean a configuration error. It is the designed result for action-level/custom script contexts whose `MapItem` is neither a field nor view map.

**Side effects, errors and performance**

The function reads in-memory object types and descriptions only. It does not add a log entry, access a database or alter map state. String formatting/allocation is the main cost.

Under a normal field map, the implementation assumes `ViewMap` is available when `GetFullDescriptionPath` dereferences its description. A malformed/detached native object could raise an access violation; script code cannot repair such configuration ownership.

**Related entries**

- [`LogInfo`](LogInfo.md) can record the returned context in the current action log.
- [`LogError`](LogError.md) automatically attaches the entire current script but does not automatically prepend this field path to the supplied message.
- [`LogHighlight`](LogHighlight.md) can emphasize context-specific diagnostic detail.

<small>Created 2026-07-15</small>
