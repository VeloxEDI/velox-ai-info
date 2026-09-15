---
title: EmptyDataSet
description: Resets all records and local change state in the active client dataset without row-by-row deletion.
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, data, emptydataset, client-dataset, destructive, reset]
---

```Delphi
procedure EmptyDataSet
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  DATA1.EmptyDataSet;
  Value := DATA1.BOF and DATA1.EOF;
end;
```

### Usage

`EmptyDataSet` resets all records and local change state in the active client dataset without row-by-row deletion.

**Usage notes**

Treat it as irreversible disposal of the local packet unless a separate source can reload it. Do not use when row-level delete validation, auditing or database deletion is required.

**Errors and side effects**

Inactive state, inability to post or validate a pending edit, reset or resynchronisation failure, and dataset events can raise errors. The method does not disable controls, so use `DeleteAll` when controls should be suppressed during deletion.

### Additional Technical Info
`EmptyDataSet` is the inherited `TCustomClientDataSet` bulk reset explicitly re-exposed on `TvxClientDataSet`. It removes all local records without invoking Delete for each row.

The example is destructive, source-reviewed and was not executed by the documentation workflow. `DeleteAll` wraps this same method with controls disabled and is normally clearer Velox intent.

**Signature and implementation**

The method calls `CheckBrowseMode`, so an outstanding insert/edit can be posted before the reset. It resets the internal DSBase, marks its data-changed property true, marks provider EOF, resynchronises the cursor and initialises the active buffer.

It does not execute the ordinary BeforeDelete/AfterDelete lifecycle for every record. Bookmarks, row positions and current field values become invalid/empty. Schema field objects generally remain because this resets data rather than closing/recreating the dataset.

**Change log and external persistence**

The reset removes the current record store and its prior pending change history. This is not equivalent to producing one delete delta per original row. Normal Velox non-edit datasets have LogChanges disabled in any event.

No provider ApplyUpdates, SQL DELETE or transaction commit is performed here. An external database remains unchanged unless the owning workflow performs a separate supported persistence operation.

**Performance and concurrency**

This native bulk reset avoids script-level per-record navigation/delete overhead. It still mutates complete shared dataset state and is unsynchronised.

**External references**

- [Embarcadero DocWiki: `TCustomClientDataSet.EmptyDataSet`](https://docwiki.embarcadero.com/Libraries/Florence/en/Datasnap.DBClient.TCustomClientDataSet.EmptyDataSet) - authoritative inherited bulk-removal contract.
- [Embarcadero DocWiki: `TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Florence/en/Datasnap.DBClient.TClientDataSet) - client-dataset in-memory/provider context.

<small>Created 2026-07-15</small>
