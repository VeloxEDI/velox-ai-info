---
title: MasterFieldName
description: Resolves and caches the master-side SQL field name for the first configured foreign-key descriptor in this SQL view.
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, sql, master-detail, foreign-key, metadata]
---

```Delphi
property MasterFieldName: string read
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Dataview.MasterFieldName;
  if Value = '' then
    LogWarning('No first master field could be resolved for the current SQL view.');
end;
```

### Usage

`MasterFieldName` resolves and caches the master-side SQL field name for the first configured foreign-key descriptor in this SQL view.

**Behaviour**

- A non-empty result is cached; subsequent reads do not resolve again.
- Empty results are retried on later reads, allowing activation/link preparation to make the value available.
- Only the first qualifying key descriptor is considered, even in composite/multiple relationships.
- The returned value names the master dataset field selected by the SQL definition, not necessarily an unquoted physical database column.

**Errors**

An unlinked first foreign key is logged as an error, not merely a missing optional value. Invalid master metadata or fields can raise through the resolver/field lookup.

### Additional Technical Info
`MasterFieldName` returns the master-side dataset/SQL field name associated with the first primary/foreign or foreign-key descriptor in this view. It is a convenience for a conventional first master-detail link, not a complete link model.

The example reads after normal view/link preparation. This read can attempt link resolution and log an error when configuration is incomplete. It is source-reviewed and was not executed by the documentation workflow.

The result comes from the linked master `TdaField.SQLFieldName`. It can be empty when the view is inactive, no qualifying key exists or the first qualifying key cannot be linked.

**Implementation**

While its cache is empty, the getter scans the primary-key descriptor list and stops at the first `fftPrimaryForeignKey` or `fftForeignKey`. It calls the view's link resolver for that descriptor, then returns `LinkedDaField.SQLFieldName` if assigned.

The resolver compares detail SQL field names case-insensitively against the configured SQL links. On a match it stores master-view, master-field-definition and live master-field references. If no linked definition is assigned, it logs that the foreign-key field is not linked and changes the flow log status accordingly.

**Edge cases and quirks**

- Reading is not pure: it may populate link references and log a flow error.
- The scan breaks after the first qualifying descriptor even if that descriptor could not be linked; it never falls through to a later valid foreign key.
- The non-empty cache is never invalidated when SQL, links, master view or key metadata changes, so live reconfiguration can leave stale text and stale linked references elsewhere.
- Link resolution assumes the master view, SQL metadata and live fields are available. Lifecycle faults can raise rather than return empty.

**Side effects**

An uncached read can mutate the selected `TdaField`'s link references and can write to the flow log. It does not navigate either dataset or update the database.

**Performance and concurrency**

Uncached work scans key/link metadata; cached reads are constant-time. Link fields and cache state are mutable and unsynchronised, so use them only in the owning flow.

**Remarks**

Read after the view and its master have opened. For composite/multiple links, inspect and correct the data definition instead of inferring the whole relationship from this first-field value.

<small>Created 2026-07-15</small>
