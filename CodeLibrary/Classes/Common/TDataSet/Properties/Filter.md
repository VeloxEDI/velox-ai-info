---
title: Filter
description: Gets or sets the descendant's local dataset filter expression; it is not SQL and does not itself authorize or query source data.
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, hidden-ancestor, tdataset, filter, expression, local-data]
---

```Delphi
property Filter: string read write;
```

### Example

```Delphi
procedure FilterReady(const Data: TvxClientDataSet);
begin
  Data.Filter := 'Status = ''Ready''';
  Data.Filtered := True;
end;
```

### Usage

Gets or sets the dataset's local dataset filter expression; it is not SQL and does not itself authorize or query source data.

- Build expressions only from governed field names and correctly quoted typed literals.
- Do not copy SQL WHERE syntax blindly; validate against client-dataset filter syntax.
- Expect cursor reposition and record-visibility changes when active filtering is on.

### Additional Technical Info
`Filter` is declared by hidden ancestor `TDataSet` and is normally used through a visible descendant such as [`TvxClientDataSet`](../../../Data/TvxClientDataSet.md). Expression syntax and supported field operations are concrete-dataset concerns.

#### Source-backed behaviour

Modified base `TDataSet.SetFilterText` checks bidirectional capability and stores the string. `TCustomClientDataSet` overrides it: when active and already Filtered, it resolves browse mode, rebuilds the expression filter when changed, destroys lookup cursor state and calls First before storing the inherited value. When Filtered is false, it stores the expression for future filtering/find use without restricting the live view.

Changing an active filter can auto-Post/Cancel the current edit and reposition the cursor. Field names are bracketed by the client expression parser internally; the text is not sent as SQL by this property.

#### Related members

[`Filtered`](Filtered.md) controls whether the expression restricts the live view. [`FindFirst`](../Methods/FindFirst.md) can use the filter as a search criterion.

#### Official RTL references

- [Embarcadero: TDataSet.Filter](https://docwiki.embarcadero.com/Libraries/Florence/en/Data.DB.TDataSet.Filter)
- [Free Pascal: TDataSet.Filter](https://www.freepascal.org/docs-html/fcl/db/tdataset.filter.html)

<small>Created 2026-07-15</small>
