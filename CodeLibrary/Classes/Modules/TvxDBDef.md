---
title: TvxDBDef
description: Represents a database-backed Velox data definition and its processed-record flagging controls.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - classes
  - modules
  - database-definition
  - record-flagging
---

```Delphi
TvxDBDef = class(TvxDataDef)
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  if Source <> nil then
    Value := Source.UpdateIDFields
  else
    Value := False;
end;
```

### Usage

`TvxDBDef` represents a database-backed Velox data definition and its processed-record flagging controls.

### Additional Technical Info
`TvxDBDef` is the script-visible Velox module for a database-backed data definition. It describes database dataviews and connections inherited from the data-definition layer and declares the controls used to flag successfully processed source records.

**Implementation**

The scripting import registers `TvxDBDef` as a descendant of the data-definition class and adds one method plus four properties. It does not register a constructor, an update method or the native open/save/design methods. Scripts receive a Velox-owned instance through a database-definition [`Source`](../../Variables/Modules/Source.md) or [`Dest`](../../Variables/Modules/Dest.md) context.

The class owns ReportBuilder SQL dataview metadata. During a normal flow, Velox opens the definition, reads source records and collects configured primary-key values. After successful non-test processing and transaction finalisation, the action manager asks eligible source definitions to update their configured flag field.

**Processed-record flagging model**

All of the following must align before the native update does useful work:

- [`UpdateIDFields`](TvxDBDef/Properties/UpdateIDFields.md) enables flagging in persisted definition configuration.
- At least one SQL dataview must be configured for flagging and have primary-key fields from the records that were read.
- [`DoUpdateIDFields`](TvxDBDef/Properties/DoUpdateIDFields.md) must be true. Map/report processing manages this transient one-shot latch according to whether source data was successfully processed.
- The flow log must still be successful and execution must not be in test mode when action finalisation reaches the update phase.
- [`CustomIDField`](TvxDBDef/Properties/CustomIDField.md) and the tag-expanded [`CustomIDValue`](TvxDBDef/Properties/CustomIDValue.md) must form valid, trusted SQL for the target database.

The terminal generates statements shaped like `UPDATE <table> SET <field>=<expression> WHERE <captured keys>`. It can split captured keys into multiple statements according to the connection's maximum-transactions-per-update setting and logs the statements as flag/retry information.

The action manager commits or rolls back the definition's main database work **before** it enters the processed-record flagging loop. Flag statements are then executed directly through DBX with no new `TvxDataDef` commit/rollback call in this finalisation path. A flagging failure can therefore make the final flow status false without undoing the already committed business changes. If one source-definition update fails, later source definitions are skipped because the manager only continues flagging while log status is true.

**Edge cases and quirks**

- Field, table and value-expression text is concatenated into SQL rather than parameterised or identifier-quoted. These settings are trusted administrator configuration, not user input.
- `CustomIDValue` is an SQL expression. A textual literal normally needs database-appropriate quoting in the configured expression; Velox does not add quotes.
- Setting `DoUpdateIDFields` does not run the update immediately. It only changes a latch that later flow finalisation may consume.
- The update latch is cleared before update attempts, including attempts that later fail. A failed run does not automatically leave the object armed for another direct attempt.
- Test-mode finalisation rolls database work back and does not run the record-flagging loop.
- Update errors are logged and feed the final flow status, but the main database commit has already occurred and prior database/external/file effects are not thereby undone. This creates an important replay/duplicate-processing risk when rows remain unflagged.
- Old definitions migrated from the former ID-management setting have a compatibility guard that can make later `UpdateIDFields` assignments silently ineffective for that loaded instance.

**Ownership, performance and concurrency**

Velox owns the definition, dataviews and database links. Do not free or retain the object beyond its execution context. Property reads are cheap, but enabling flagging can trigger definition/database validation, and the eventual update can issue multiple database statements and hold transaction resources. The object and its latch are mutable execution state and are not safe for unsynchronised cross-thread use.

**Related entries**

- [`CustomIDValueProcessed`](TvxDBDef/Methods/CustomIDValueProcessed.md) — returns the configured value expression after data/system tag expansion.
- [`Source`](../../Variables/Modules/Source.md) and [`Dest`](../../Variables/Modules/Dest.md) — context-dependent definition references.
- [`TvxDBCon`](TvxDBCon.md) — live database connection and transaction controls.

**External references**

- [Embarcadero DocWiki: `TCustomSQLDataSet.ExecSQL`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.SqlExpr.TCustomSQLDataSet.ExecSQL) — DBX terminal used to execute each generated flag statement; its Boolean argument controls direct execution, not transaction commit.

<small>Created 2026-07-15</small>
