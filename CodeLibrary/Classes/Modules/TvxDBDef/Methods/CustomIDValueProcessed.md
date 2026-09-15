---
title: CustomIDValueProcessed
description: Returns the configured processed-record SQL value expression after definition data and system tag expansion.
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - database-definition
  - sql-expression
  - tags
---

```Delphi
function CustomIDValueProcessed: String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Source <> nil then
    Value := Source.CustomIDValueProcessed
  else
    Value := '';
end;
```

### Usage

`CustomIDValueProcessed` returns the configured processed-record SQL value expression after definition data and system tag expansion.

**Result and behaviour**

The result is plain text intended to become the right-hand SQL expression in the record-flagging Velox:

```SQL
UPDATE <table> SET <CustomIDField>=<result> WHERE <captured primary keys>
```

The method does not alter the stored property, quote or escape the result, validate it for the target database, execute SQL, set either update flag or report whether an update will occur. An empty input returns an empty result.

**Errors, security and quirks**

- Action-local tags are not supplied by this call. A tag that depends on action locals may remain unresolved or resolve differently from the public scripting helper.
- Expansion can depend on the definition's current dataview/record state and on mutable system/global values.
- The returned text is executable SQL-expression material when Velox record flagging later consumes it. Do not build it from untrusted transaction data.
- A string literal still needs database-appropriate SQL quoting in the configured expression; the method adds none.
- Reading/returning the result can disclose expanded data or secret-bearing system values. Avoid logging it unless the configured expression is known to be non-sensitive.

### Additional Technical Info
`CustomIDValueProcessed` returns the current [`CustomIDValue`](../Properties/CustomIDValue.md) after Velox expands the tags available to the database definition.

**Implementation**

The registered runtime method calls the native method of the same name. That method passes `CustomIDValue` through the definition's `ProcessTags` override. Velox first processes data tags against this definition's current data module and then processes system tags with a nil action-locals list.

This differs from the global [`ProcessTags`](../../../../Functions/String/ProcessTags.md) scripting function, which runs through the current scripter/action-local context and does not itself add this definition-specific data-tag pass.

**Performance and concurrency**

The method performs in-memory tag scanning and context lookups; it does not contact the database. Results can change as data/system context changes, so evaluate it at the point required and do not treat it as a stable cross-thread value.

**Related entries**

- [`CustomIDField`](../Properties/CustomIDField.md) — target field identifier.
- [`UpdateIDFields`](../Properties/UpdateIDFields.md) and [`DoUpdateIDFields`](../Properties/DoUpdateIDFields.md) — persisted enablement and transient execution latch.
- [`TvxDBDef`](../../TvxDBDef.md) — full update lifecycle and SQL boundary.

<small>Created 2026-07-15</small>
