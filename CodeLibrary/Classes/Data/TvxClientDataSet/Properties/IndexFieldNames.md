---
title: IndexFieldNames
description: Gets or sets an ascending case-sensitive client-dataset sort defined by ordered semicolon-separated field names.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, indexfieldnames, sort, index, cursor]
---

```Delphi
property IndexFieldNames: string read write
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  DATA1.IndexFieldNames := 'CustomerCode;DocumentDate';
  DATA1.First;
  Value := DATA1.IndexFieldNames;
end;
```

### Usage

`IndexFieldNames` gets or sets an ascending case-sensitive client-dataset sort defined by ordered semicolon-separated field names.

**Usage notes**

Set once before deterministic traversal where possible. Use semicolons, not the commas used by CheckFields, and reacquire cursor position by key afterwards.

**Errors and side effects**

Missing/unsupported fields, too many key fields, pending-edit validation, provider fetch, sort/index creation, aggregate/buffer work or events can raise. A large sort can allocate and take material time. It does not edit record values or commit externally.

### Additional Technical Info
`IndexFieldNames` is the inherited client-dataset property explicitly exposed by Velox. It creates/selects a runtime sort from ordered field names separated by semicolons.

The example sorts ascending by CustomerCode then DocumentDate and explicitly selects the first row. It is source-reviewed and was not executed by the documentation workflow.

**Declaration and syntax**

Names and ordering are significant. This surface requests ascending, case-sensitive sorting; it exposes no descending/case-insensitive/grouping options. Field-based indexes do not support grouping or maintained aggregates. Setting an empty string leaves field-index mode and returns the default/no-named-index order.

`IndexFieldNames` and native `IndexName` are mutually exclusive. Setting one changes what the other reports/uses.

**Active setter behavior**

On an active dataset, the setter enters browse mode (which can post a pending edit), updates the cursor/provider position, fetches remaining provider data, and when the value/mode changes calls `SortOnFields` or switches index. It then resets ranges, checks master range and resynchronises buffers. Aggregates, if active internally, are closed/reset and buffers rebuilt.

The current logical record may be resynchronised, but its numeric RecordPosition and all subsequent traversal order can change. Do not retain sequence positions across this assignment; call First/Locate or use a business key after sorting.

On an inactive dataset, the requested value/mode is stored for later activation without an immediate sort or field validation against an open cursor.

**Performance and concurrency**

Building/switching the index depends on record count and key width; subsequent ordered access can be faster. The index/cursor is shared mutable state and unsynchronised.

**External references**

- [Embarcadero DocWiki: `TCustomClientDataSet.IndexFieldNames`](https://docwiki.embarcadero.com/Libraries/Florence/en/Datasnap.DBClient.TCustomClientDataSet.IndexFieldNames) - authoritative syntax, ordering and IndexName/grouping limits.
- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Florence/en/Datasnap.DBClient.TClientDataSet) - in-memory index/cursor context.

<small>Created 2026-07-15</small>
