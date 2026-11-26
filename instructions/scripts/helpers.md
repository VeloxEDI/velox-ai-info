---
title: Use managed scripting helpers
description: Use Velox helper workspaces instead of manually creating and freeing their corresponding objects.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-10-15T01:47:56Z"
---

# Use managed scripting helpers

Applies to generated, edited or reviewed Velox scripts, including Custom Script actions, Map events, route formulas and Scriptlet code. Read [shared rules](../common.md) and the owning configuration type's instructions too.

## Required rules

Use the corresponding documented Velox helper instead of manually constructing and freeing an object. Do not introduce `.Create`, `.Free` or a matching cleanup block when the helper already supplies the workspace.

| Required workspace | Use | Do not generate for that workspace |
| --- | --- | --- |
| JSON object | `Json` (or documented `Json2` when a second workspace is needed) | `TJSONObject.Create` and manual freeing |
| JSON array | `JsonArray` (or documented `JsonArray2` when needed) | `TJSONArray.Create` and manual freeing |
| String list | `List` | `TStringList.Create` and manual freeing |

Consult the [Helpers reference](../../CodeLibrary/Variables/Helpers.md) for other supported helpers and exact APIs. Use documented helper names and methods rather than inventing wrapper functions. If no suitable helper is documented, record the gap and verify the supported API and ownership before proposing an alternative.

Never free a helper or an alias pointing to it. Velox manages its lifetime. Initialise or reset a workspace before unrelated reuse, using its documented methods. When editing existing scripts, inspect consumers before clearing shared state: JSON workspaces are action-owned and can be used by other scripts. Do not retain helper references beyond their owning script/action or use them concurrently.

When replacing a constructor/free pattern, preserve the actual script work and required exception handling. Remove only the obsolete allocation and corresponding cleanup; do not leave a `.Free` on the replacement helper.

## Generic example

This illustrative script uses managed workspaces and deliberately has no constructor, destructor or boilerplate `Value := True`:

```pascal
procedure ScriptEvent(var Value: Variant);
begin
  Json.LoadFromString('{"status":"ready"}');
  JsonArray.Erase;
  JsonArray.AddString('Example');
  List.Clear;
  List.Add(Json.OptString('status', ''));
end;
```

The example illustrates helper use, not output persistence or a complete integration. See [event Value context](event-value-context.md) before assigning `Value`.

## Validation

Review constructor, cleanup and alias usage. Confirm that helper state is initialised at the intended boundary without erasing another script's required state. Check methods against the relevant helper page. Report file inspection separately from actual compilation and execution in the target Velox build.

## Evidence and verification scope

The preference for helpers is a user-supplied authoring standard. The local [Helpers](../../CodeLibrary/Variables/Helpers.md), [Json](../../CodeLibrary/Variables/Helpers/Json.md), [JsonArray](../../CodeLibrary/Variables/Helpers/JsonArray.md) and [List](../../CodeLibrary/Variables/Helpers/List.md) pages corroborate the helper APIs and managed ownership. The [published helper reference](https://docs.veloxedi.com/code-library/Variables/Helpers) could not be retrieved during this update; local repository copies were inspected instead. No direct product-source verification or Velox compilation/runtime test was performed for this change.
