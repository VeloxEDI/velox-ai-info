---
title: loPartialKey
description: Requests a prefix match for the final supported text key in a dataset Locate operation.
sidebar_position: 163
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - constant
  - dataset
  - locate
  - partial-key
  - prefix
---

```Delphi
loPartialKey = 1
```

### Example

```Delphi
procedure FindCustomerPrefix(DataSet: TDataSet; var Found: Boolean);
begin
  Found := DataSet.Locate(
    'CustomerCode',
    'ABC',
    [loCaseInsensitive, loPartialKey]);
end;
```

### Usage

`loPartialKey` requests a prefix match for the final supported text key in a dataset Locate operation.

### Additional Technical Info
`loPartialKey` is a [`TLocateOption`](../../Types/Enumerations/TLocateOption.md) member that requests a partial match rather than a complete final text key. In the current Velox client-dataset path this is a starts-with/prefix search. Pass it inside a [`TLocateOptions`](../../Types/Sets/TLocateOptions.md) set, not as ordinal `1`.

The example searches for the first `CustomerCode` beginning with `ABC`, ignoring case. The actual match depends on the active data and expression-engine collation. It is source-reviewed and is not executed by the documentation workflow.

**Velox registration and dispatch**

The PascalScript dataset import declares the enum, its set and virtual `TDataSet.Locate`. A concrete dataset decides how the option is implemented. Velox's modified base method returns `False` when it is not overridden; `TvxClientDataSet` inherits the compiled `TCustomClientDataSet` implementation described below.

**Current client-dataset implementation**

When `loPartialKey` is present, the implementation appends `*` to the converted value for the final key field only, then lets the client expression engine locate the first filter match from BOF. The wildcard is added only when that final field has one of these Delphi field types:

- `ftString` or `ftFixedChar`;
- `ftWideString` or `ftFixedWideChar`; or
- `ftGUID`.

Earlier fields in a multi-field locate remain complete matches. A numeric, date/time or Boolean final key gets no appended wildcard, so this option provides no documented prefix behavior for it.

**Multiple keys and dynamic values**

`KeyFields` is a semicolon-separated list. One field can use a scalar `KeyValues`; multiple fields require a Variant array in the same order. Partial matching affects only the last listed field. For example, locating `Country;CustomerCode` with `['NZ', 'ABC']` keeps `Country` exact and prefixes only `CustomerCode`.

Null generates `IS NULL` and is not a text prefix. Too few Variant-array elements can fail during indexing. Unsupported field kinds raise a bad-field-type database error.

**Edge cases and quirks**

- The implementation constructs an empty prefix as `*`, which can match a very broad set of non-null text values. Reject empty search text unless that is intentional.
- The supplied text becomes part of a quoted filter value and the implementation appends its own `*`. Do not treat user-supplied wildcard characters as literal without confirming the expression engine's escaping rules.
- Prefix matching does not mean substring/contains matching: `ABC` targets values beginning with that prefix, not values containing it later.
- Fixed-width data can include padding, and case/collation behavior remains provider/expression-engine specific.
- Combining the option with [`loCaseInsensitive`](loCaseInsensitive.md) requests a case-insensitive prefix, but does not define accent or Unicode-normalization behavior.

**Dataset state, events and concurrency**

Locate checks browse mode, starts the search at BOF and calls `BeforeScroll` even when nothing matches. On success it moves the current record and calls `AfterScroll`. It can finish pending edit state and must not be treated as a pure or thread-safe search over a shared dataset.

**Errors**

The constant itself does not raise. Locate can fail or raise for dataset state, missing fields, Variant-array shape, unsupported field types, conversions, expression parsing/provider behavior or scroll-event code.

**Performance**

The current client-dataset implementation evaluates a generated filter from BOF. A short or empty prefix can match many records, and repeated locates can be costly on large in-memory datasets.

**Related entries**

- [`loCaseInsensitive`](loCaseInsensitive.md) changes supported text comparisons to ignore case.
- [`TLocateOption`](../../Types/Enumerations/TLocateOption.md) defines both members.
- [`TLocateOptions`](../../Types/Sets/TLocateOptions.md) shows the supported set combinations.

**External references**

- [Embarcadero `TLocateOption`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TLocateOption)
- [Embarcadero `TDataSet.Locate`](https://docwiki.embarcadero.com/Libraries/Athens/en/Data.DB.TDataSet.Locate)
- [Free Pascal `TLocateOption`](https://www.freepascal.org/docs-html/fcl/db/tlocateoption.html)
- [Free Pascal `TDataSet.Locate`](https://www.freepascal.org/docs-html/fcl/db/tdataset.locate.html) - compatibility reference; Velox's modified Delphi/client-dataset source is authoritative.

<small>Created 2026-07-15</small>
