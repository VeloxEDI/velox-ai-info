---
title: "IfBlank"
description: "Applies the IfBlank-named fallback to an exactly empty typed string while preserving all whitespace."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - ifblank
  - string
  - empty
  - fallback
---

```Delphi
Function IfBlank(const aValue1, aValue2: string): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  DisplayName: string;
begin
  DisplayName := '';
  Value := IfBlank(DisplayName, 'Unnamed');
  // Unnamed
end;
```

### Usage

Applies the IfBlank-named fallback to an exactly empty typed string while preserving all whitespace.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue1` | `string`, `const` | Preferred Unicode string. Only exact length zero selects the fallback. |
| `aValue2` | `string`, `const` | Fallback Unicode string. |

Both argument expressions are evaluated before the call; `aValue2` is not a deferred branch.

**Returns**

`aValue2` for exact empty `aValue1`; otherwise the original first string with no trimming or normalization.

**Type and evaluation boundaries**

- Parameters are `string`, not Variant. Variant Null/Empty must be converted before entry and can fail or become text according to the caller/runtime.
- Both possible strings are evaluated eagerly. `IfBlank(Current, LoadFallback())` calls `LoadFallback` even when `Current` is nonempty.
- The function reports no branch indicator. If both arguments are empty or equal, the returned text does not show which path was taken.

**Errors**

No content-specific error. Argument evaluation/conversion and allocation errors propagate; Velox does not catch them.

**Usage notes**

Choose this function only when "blank" means exactly zero characters. Use [`CoalesceEmpty`](CoalesceEmpty.md) when spaces and other trimmed whitespace should also count as absent.

### Additional Technical Info
`IfBlank` returns `aValue2` only when `aValue1 = ''` exactly. Despite the name, whitespace-only text is not blank to this function: it is returned unchanged.

The implementation is behaviorally identical to [`CoalesceString`](CoalesceString.md). The example is fictional, deterministic and source-reviewed and was not executed by the documentation workflow.

**Implementation**

`uPSI_vxCommon` compiles the declaration and registers a direct pointer to `vxCommon.IfBlank`. The native body performs one exact Unicode string comparison and one assignment. It does not call `Trim`, `VarToStr`, `IsNullorEmpty` or any external terminal.

**Behavior table**

| `aValue1` | Result |
|---|---|
| `''` | `aValue2` |
| `' '` | The one-space first value |
| tab or line-break text | The original first value |
| `'0'` | `'0'` |
| any other nonempty string | The original first value |

**Side effects**

None in the body. Argument expressions can have side effects before entry.

**Performance and concurrency**

Constant-time empty-string metadata check and normal reference-counted assignment. No shared state, locale dependency or locking.

**Related entries**

- [`CoalesceString`](CoalesceString.md) has the same exact implementation behavior under another name.
- [`CoalesceEmpty`](CoalesceEmpty.md) applies a broader Variant-aware trimmed predicate.
- [`IfEmpty`](IfEmpty.md) tests exact Variant-to-text output.
- [`IfThen`](IfThen.md) uses an explicit Boolean condition.

<small>Created 2026-07-15</small>
