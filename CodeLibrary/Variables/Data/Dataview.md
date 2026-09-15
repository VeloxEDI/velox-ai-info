---
title: "Dataview"
description: "Exposes the active field or view map's live query data view, with its concrete runtime type when known."
sidebar_position: 104
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - data
  - dataview
  - map-context
---

```Delphi
Dataview: TdaQueryDataView
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Null;
  if Dataview <> nil then
  begin
    if Dataview.FieldExists('OrderNumber') and Dataview.NotEmpty then
      Value := Dataview['OrderNumber'].Value;
  end;
end;
```

### Usage

`Dataview` exposes the active field or view map's live query data view, with its value type when known.

### Additional Technical Info
`Dataview` exposes the live query data view that owns the current map record. It is context, not a copied dataset: navigation, edits and field assignments operate on the same object that the map engine is processing.

**Value**

The generated fallback declaration is:

When the current view is known during compilation, Velox instead registers the most specific supported type:

| Runtime view | Script type |
|---|---|
| SQL | `TdaSQLQueryDataView` |
| XML | `TdaXMLQueryDataView` |
| JSON | `TdaJSONQueryDataView` |
| client-dataset/file | `TdaCDSQueryDataView` |
| other or unavailable | `TdaQueryDataView` |

This changes which subtype properties compile. The common query-view methods and properties remain available through the base surface.

**Binding and availability**

Velox always declares the identifier so reusable script source can compile. It binds an instance only for a `TvxCustomMapItem` whose active item is:

- a `TvxFieldMap`, where `Dataview` is `FieldMap.ViewMap.View`; or
- a `TvxViewMap`, where `Dataview` is `ViewMap.View`.

Outside those contexts the name can be nil/unbound. Check it before dereferencing in shared scriptlets. A declared variable is not proof that a map record or data pipeline exists.

**Behaviour and side effects**

- `First`, `Next`, `Prior`, `Last`, `Locate` and `RecordPosition` move the live map cursor. Moving it inside a map event can change which record later fields/details process.
- `Insert`, `Edit`, `Post`, `CancelPost`, `Delete` and `DeleteAll` modify the active view/query. Manual state changes can interfere with the map engine's own insert/map/post/cancel sequence.
- `Fields['Alias']` resolves a configured data-view alias to the underlying field and raises when the alias is absent. `FieldExists` is the safe presence test.
- `Empty`, `NotEmpty` and `EOF` ultimately use the current data pipeline. Record count/position and editing semantics are implemented by the concrete descendant, not by the abstract base alone.
- For SQL views, the subtype also exposes table/link/flag metadata and its live `Query`. XML/JSON views are registered as their concrete hidden descendants but inherit the public CDS/query-view surface.

**Edge cases and quirks**

The base `TdaQueryDataView` contains no-op bodies for several virtual script methods because PascalScript cannot call abstract methods directly. Concrete SQL/CDS/XML/JSON descendants override the real operations. If only an unavailable base view were ever bound, methods such as `Next`, `Edit`, `Insert`, `Post` and `FieldByName` would have placeholder behaviour; normal map bindings use a concrete descendant.

The compile-time subtype is selected from the current `MapItem` before execution. A script compiled for one view family should not assume subtype-only members exist when reused under another family. The view and its fields are host-owned and can be reset or destroyed with the map/data definition; never free or retain them beyond the current execution.

Errors from missing fields, invalid dataset state, conversion or an underlying query can propagate or be caught by the enclosing map event, which then records them in the Velox log. Cursor operations can trigger linked/detail work depending on the concrete view. Repeated scans and `FieldByName` calls add work; database-backed or linked operations can be materially more expensive than reading the already-current field.

**Related entries**

- [`Field`](Field.md) exposes the active destination field in a field-map context.
- [`Datasets`](../../ScriptingGuide/Datasets.md) explains map cursor and ownership rules.
- [`TdaSQLQueryDataView`](../../Classes/Data/TdaSQLQueryDataView.md) and [`TdaCDSQueryDataView`](../../Classes/Data/TdaCDSQueryDataView.md) document the visible concrete class surfaces.

**External references**

- [Embarcadero DocWiki: `TDataSet`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet) documents the upstream Delphi cursor/dataset concepts used by concrete views.
- [Free Pascal: `TDataSet`](https://www.freepascal.org/docs-html/fcl/db/tdataset.html) provides compatibility context only; `TdaQueryDataView` and its map bindings are Velox/ReportBuilder-specific.

<small>Created 2026-07-15</small>
