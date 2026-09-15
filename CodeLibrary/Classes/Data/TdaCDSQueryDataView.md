---
title: TdaCDSQueryDataView
description: Represents a host-owned structured-data view backed by one shared in-memory child client dataset and pipeline cursor.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, classes, data, data-view, client-dataset, cursor]
---

```Delphi
TdaCDSQueryDataView = class(TdaQueryDataView)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Rows: TvxClientDataSet;
begin
  // Dataview must be a client-dataset-backed file/structured data view.
  Rows := Dataview.Query;
  if Rows.Active then
    Value := Rows.RecordCount
  else
    Value := 0;
end;
```

### Usage

`TdaCDSQueryDataView` represents a Velox-provided structured-data view backed by one shared in-memory child client dataset and pipeline cursor.

**Behaviour**

The Query object is normally stable for the view's lifetime, but its contents are not. SQL/field metadata changes can close it, rebuild field definitions and create a new in-memory dataset. Activating and resetting the view can recreate/close its data; file parsing and map processing populate, navigate and edit the same cursor.

View navigation and `Query` navigation are not independent. A call through either reference changes the record seen by the other, by field references and by the attached pipeline.

**Usage notes**

Do not free the view or Query. Snapshot scalar field values before calling helpers that may navigate, reset or rebuild the view. Use the surrounding Velox processing lifecycle for posting, cancellation and persistence.

### Additional Technical Info
`TdaCDSQueryDataView` is Velox's ReportBuilder-derived view for structured/file data held in an in-memory client dataset. The view, its Query dataset, DataSource and report pipeline all represent the same configured record set and cursor lifecycle.

The example observes the current view's dataset without changing ownership or position. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

Velox registers this class as a descendant of the hidden `TdaQueryDataView`. Its constructor creates one `TdaChildClientDataSet` owned by the view, connects an owned DataSource to it and later connects the report pipeline to that DataSource. The child dataset descends from `TvxClientDataSet` and reports that it has a parent.

Scripts receive views from the active Source/Dest configuration; they do not construct them. A source view is registered under the uppercase configured Description, a destination view under `D_` plus that name, and the current mapped view can be available as `Dataview`. Hidden format-specific descendants for XML, JSON, EDI and Excel inherit this dataset model.

**Edge cases and quirks**

- The only own script property, `Query`, is registered read/write even though it is an owned internal dependency. Treat it as read-only. Reassignment splits the view from its DataSource/pipeline and creates destructive lifetime errors.
- A configured Description must become a usable, non-colliding script identifier after uppercasing and the optional `D_` prefix. The registration loop does not sanitise it here.
- Schema recreation invalidates saved field references and can reset active state, record buffers, indexes and position while the Query object reference itself stays unchanged.
- Format-specific descendants can add parsing/record rules; do not assume every client-dataset-backed view represents the same physical format.

**Performance and concurrency**

Records are held in memory, so dataset size drives memory use. Schema creation, indexes and BLOB values add overhead. The view, dataset and pipeline expose one shared mutable cursor without object-level locking; nested or concurrent navigation can change caller state.

**External references**

- [Embarcadero DocWiki: `Datasnap.DBClient.TClientDataSet`](https://docwiki.embarcadero.com/Libraries/Florence/en/Datasnap.DBClient.TClientDataSet) - inherited in-memory dataset context below Velox's child dataset; view ownership and lifecycle are Velox-specific.

<small>Created 2026-07-15</small>
