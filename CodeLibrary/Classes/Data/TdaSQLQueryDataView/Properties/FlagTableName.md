---
title: FlagTableName
description: Gets or sets the optional verbatim table expression targeted by this view's processed-flag UPDATE statements.
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, database, sql, table-name, security]
---

```Delphi
property FlagTableName: string read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Target: string;
begin
  // Report the effective target without changing configuration.
  Target := Dataview.FlagTableName;
  if Trim(Target) = '' then
    Target := Dataview.TableName;
  Value := Target;
end;
```

### Usage

`FlagTableName` gets or sets the optional verbatim table expression targeted by this view's processed-flag UPDATE statements.

**Behaviour**

- Empty/whitespace selects the first query table through `TableName`.
- A non-empty value is used exactly as stored, including leading/trailing spaces and any owner/schema/quoting syntax.
- The override matters only when `FlagIdFields` and the database-definition processed-update gates permit a later update.
- Assignment changes runtime configuration; it does not run SQL immediately.

**Errors**

Invalid syntax, missing objects/columns, permissions, constraint failures and unsafe target choices surface later as logged database errors. Assignment itself accepts any string.

### Additional Technical Info
`FlagTableName` optionally overrides the table targeted when this SQL view marks captured rows as processed. An empty or whitespace-only value makes Velox use `TableName`, the database-formatted name of the first selected table.

The example computes that effective target without constructing or executing SQL. It is source-reviewed and was not executed by the documentation workflow.

The constructor default is an empty string. The value is persisted with the view and is editable in the query designer when processed-flag support is available.

**Implementation**

During the later `UpdateCustomIDFields` operation, Velox tests `Trim(FlagTableName)`. If empty it selects `TableName`; otherwise it copies the original, untrimmed `FlagTableName`. It then concatenates that value directly after `UPDATE`, followed by the configured Custom ID field, processed value and generated key WHERE clause.

There is no identifier parser, quoting step, parameter binding or allow-list at this property boundary.

**Edge cases and quirks**

- **Security:** untrusted content in this property becomes executable SQL structure. Never derive it from source data, mapping values, filenames, API requests, message content or user-entered transaction data.
- Syntax is database-dialect-specific. A name valid for one connection may fail or target a different object on another.
- Whitespace-only values fall back, but non-empty values preserve surrounding whitespace. The property does not normalise case or qualification.
- The override can target a table different from the first SELECT table. The generated WHERE fields must still identify rows correctly in that target.

**Side effects**

Reading has none. Assignment replaces the stored string. The later successful end-of-flow operation can execute UPDATE statements against the selected target and log both flag and unflag SQL.

**Performance and concurrency**

Property access is constant-time. The override does not change batching; database cost depends on captured rows and the connection's maximum updates per transaction. Do not mutate shared configuration while another flow uses the view.

**Remarks**

Set this in governed Velox configuration using a trusted literal appropriate to the connection. Leave it empty when the first selected table is the correct update target.

<small>Created 2026-07-15</small>
