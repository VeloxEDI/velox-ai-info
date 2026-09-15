---
title: loCaseInsensitive
description: Requests case-insensitive text matching when a dataset Locate implementation supports that option.
sidebar_position: 162
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - constant
  - dataset
  - locate
  - case-insensitive
  - collation
---

```Delphi
loCaseInsensitive = 0
```

### Example

```Delphi
procedure FindCustomer(DataSet: TDataSet; var Found: Boolean);
begin
  Found := DataSet.Locate(
    'CustomerCode',
    'abc-100',
    [loCaseInsensitive]);
end;
```

### Usage

`loCaseInsensitive` requests case-insensitive text matching when a dataset `Locate` supports that option.

### Additional Technical Info
`loCaseInsensitive` is a [`TLocateOption`](../../Types/Enumerations/TLocateOption.md) member that requests a case-insensitive comparison for supported text keys in a dataset `Locate` operation. It belongs inside a [`TLocateOptions`](../../Types/Sets/TLocateOptions.md) set; its ordinal zero is an implementation detail, not the options value to pass directly.

The example searches `CustomerCode` without treating letter case as significant. The actual result depends on the active dataset, stored values and its text comparison rules. It is source-reviewed and is not executed by the documentation workflow.

**Velox registration and dispatch**

The dataset import defines `TLocateOption = (loCaseInsensitive, loPartialKey)`, defines `TLocateOptions` as its set, and exposes the virtual `TDataSet.Locate` method. The option is handled by the concrete dataset instance at runtime.

Velox's modified base `TDataSet.Locate` simply returns `False`. A class that does not override it will therefore appear to find no match rather than raising a not-implemented error. `TvxClientDataSet` inherits the substantive `TCustomClientDataSet` implementation, and its convenience `Find` method always supplies `[loCaseInsensitive]`.

**Current client-dataset behavior**

For the client-dataset path used by `TvxClientDataSet`, the option adds `foCaseInsensitive` to the filter expression used for the search. It affects supported textual comparisons; it does not convert nontext values or define a universal Unicode/culture collation.

The locate process:

1. enters/checks browse mode and updates cursor state;
2. resolves the semicolon-separated key fields and aligned key values;
3. moves its search cursor to BOF;
4. finds the first matching record through the expression engine; and
5. on success, resynchronizes the visible dataset cursor and fires `AfterScroll`.

`BeforeScroll` runs before the attempt, including an ordinary no-match. A locate is therefore stateful even though its return type is Boolean.

**Case, collation and data boundaries**

- Case folding is defined by the concrete dataset/expression engine. Do not assume invariant, locale-neutral, database-server or Unicode normalization semantics.
- Case-insensitive is not accent-insensitive. Do not infer that punctuation, whitespace, composed/decomposed Unicode or locale-specific letters compare equivalently.
- The option does not trim values. Normalize data explicitly when the business key contract requires trimming or Unicode normalization.
- With multiple key fields the option applies to supported text comparisons in the constructed expression; numeric/date/Boolean keys keep their type-specific comparison.
- Combine it with [`loPartialKey`](loPartialKey.md) only when a case-insensitive prefix search is intended.

**Dataset state, events and concurrency**

`CheckBrowseMode` can finish pending edit/insert state according to the dataset contract. `BeforeScroll` code can raise or change application state, and a successful locate changes the current record and calls `AfterScroll`. Do not call Locate as though it were a pure predicate and do not concurrently navigate a shared dataset instance.

**Errors**

The option itself does not raise. Locate can fail or raise for inactive datasets, invalid/missing fields, misaligned Variant arrays, unsupported key field types, failed conversions, provider/filter errors or event-handler exceptions.

**Performance**

The current client-dataset path starts at BOF and evaluates a filter to find the first match. Repeated case-insensitive locates over a large in-memory dataset can be expensive; do not assume a database index or server-side query is used.

**Related entries**

- [`loPartialKey`](loPartialKey.md) requests a prefix match for the final supported text key.
- [`TLocateOption`](../../Types/Enumerations/TLocateOption.md) defines both members.
- [`TLocateOptions`](../../Types/Sets/TLocateOptions.md) shows valid option combinations.
- [`TvxClientDataSet.Find`](../../Classes/Data/TvxClientDataSet/Methods/Find.md) always uses this option.

**External references**

- [Embarcadero `TLocateOption`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TLocateOption)
- [Embarcadero `TDataSet.Locate`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet.Locate)
- [Free Pascal `TLocateOption`](https://www.freepascal.org/docs-html/fcl/db/tlocateoption.html)
- [Free Pascal `TDataSet.Locate`](https://www.freepascal.org/docs-html/fcl/db/tdataset.locate.html) - compatibility reference; Velox's modified Delphi/client-dataset source is authoritative.

<small>Created 2026-07-15</small>
