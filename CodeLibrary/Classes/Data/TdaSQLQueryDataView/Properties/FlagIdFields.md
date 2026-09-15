---
title: FlagIdFields
description: Enables this SQL view's participation in the successful end-of-flow update that marks captured source rows as processed.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, database, processed, update, configuration]
---

```Delphi
property FlagIdFields: Boolean read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Enabled: Boolean;
begin
  Enabled := Dataview.FlagIdFields;
  Value := Enabled;
  if not Enabled then
    LogWarning('This SQL view is not configured to flag source rows as processed.');
end;
```

### Usage

`FlagIdFields` enables this SQL view's participation in the successful end-of-flow update that marks captured source rows as processed.

**Behaviour**

- False disables updates for this view without changing the database definition's global settings.
- True makes the view eligible; it does not guarantee an update. The flow must capture keys, remain successful and pass the owner-level gates.
- Primary-key-auto, primary-key-user-set, primary/foreign-key and pure foreign-key descriptors are all tracked and make the configuration-presence check succeed. The later UPDATE WHERE builder deliberately excludes pure foreign-key descriptors and uses only the other three kinds.
- Changing the property at runtime affects the later update check but does not retroactively capture rows already passed.

**Errors**

Missing key fields, SQL construction/execution failures and database errors are logged and can make the flow fail. Setting the Boolean alone performs no validation.

**Usage notes**

Prefer configuring this option in the Velox query designer. If a script changes it, do so before relevant cursor movement and understand the database definition's global update policy.

### Additional Technical Info
`FlagIdFields` enables the per-view portion of Velox's “Flag As Processed” feature. When enabled and the surrounding database definition also permits updates, Velox can use captured primary/foreign-key values to update the configured Custom ID field after a successful flow.

The example inspects configuration without changing it. It is source-reviewed and was not executed by the documentation workflow.

The constructor default is False. The property is also persisted with the data-view configuration and appears in the query designer as “Flag 'As Processed' on this table”.

**Implementation**

The database definition calls each SQL view's update routine only when its own update controls are enabled. The view immediately exits when `FlagIdFields` is False. When True it requires at least one tracked key descriptor, builds one or more WHERE clauses from values captured during cursor movement, and updates the database definition's configured Custom ID field to its processed value.

The update normally runs only after successful processing. Generated SQL is logged, including a corresponding unflag statement for retry support, and transactions are divided according to the connection's maximum-update setting.

**Edge cases and quirks**

- If True with no tracked key descriptors, the update logs an error and fails.
- A view whose only tracked descriptors are pure foreign keys passes the earlier presence check but produces no UPDATE WHERE clause; Velox logs that no update is necessary and performs no flag SQL.
- Captured values depend on cursor movement and the `FlagAsProcessed`/`RecordPKValue` one-shot latch. Rows can be omitted intentionally or through unexpected navigation.
- The feature updates the configured Custom ID field; it does not mark the in-memory Query row or post arbitrary field edits.
- Legacy persisted `IgnoreFlowIDFields` values are read in reverse into this property for backward compatibility.

**Side effects**

Assignment changes in-memory configuration. When all outer conditions are met, later end-of-flow processing can execute and log database UPDATE statements.

**Performance and concurrency**

Reading/writing is constant-time. Later update cost scales with captured keys, configured batch size and database latency. Configuration and capture state are not synchronised across flows.

<small>Created 2026-07-15</small>
