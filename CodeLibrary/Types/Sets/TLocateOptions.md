---
title: TLocateOptions
description: Combines the case-insensitive and partial-key behaviors requested from a dataset Locate operation.
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, set, dataset, locate, search]
---

```Delphi
TLocateOptions = set of TLocateOption
```

### Example

```Delphi
function FindCustomer(DataSet: TDataSet; const Prefix: String): Boolean;
var
  Options: TLocateOptions;
begin
  Options := [loCaseInsensitive, loPartialKey];
  Result := DataSet.Locate('CustomerCode', Prefix, Options);
end;
```

### Usage

`TLocateOptions` combines the case-insensitive and partial-key behaviours requested from a dataset Locate operation.

#### Current client-dataset behavior

For the Velox client datasets used in scripts:

- partial matching appends a wildcard only for the final key field;
- that final field must be string, fixed char, wide string, GUID or fixed wide char;
- case-insensitive behavior is applied through the client-dataset filter expression, so collation and Unicode behavior are provider-specific;
- multiple semicolon-separated key fields require Variant-array values in the same order;
- Null becomes `IS NULL`, while unsupported field kinds can raise a database error;
- the search starts at BOF and selects the first filter match;
- `BeforeScroll` runs for every attempt, while a successful locate moves/resynchronizes the visible cursor and invokes `AfterScroll`; and
- checking browse mode can finish pending edit/insert state before the search.

Treat Locate as a state-changing search, not a pure predicate. Do not use it concurrently through a shared dataset instance without external coordination, and do not assume another dataset provider implements partial/case matching identically.

`TvxClientDataSet.Find` always uses `[loCaseInsensitive]`. Other dataset types can apply different partial-match and case rules, so verify their documented behaviour before relying on the same result.

### Additional Technical Info
`TLocateOptions` is the set passed to a dataset's `Locate` method. It can contain [`loCaseInsensitive`](../../Constants/Enumeration/loCaseInsensitive.md) and/or [`loPartialKey`](../../Constants/Enumeration/loPartialKey.md); pass `[]` for exact, case-sensitive matching.

| Value | Requested behavior |
|---|---|
| `[]` | Exact comparison using the dataset/provider's normal rules. |
| `[loCaseInsensitive]` | Ignore case for supported text comparisons. |
| `[loPartialKey]` | Permit a supported string key to match by prefix. |
| `[loCaseInsensitive, loPartialKey]` | Combine both requests. |

**Related Code Library entries**

- [TLocateOption](../Enumerations/TLocateOption.md) - member-level implementation details.
- [Sets](../Sets.md) - set constructors and membership rules.

**External references**

- [Embarcadero TLocateOptions](https://docwiki.embarcadero.com/Libraries/Sydney/en/Data.DB.TLocateOptions) - Delphi option-set contract.
- [Free Pascal TLocateOption](https://www.freepascal.org/docs-html/fcl/db/tlocateoption.html) - compatible option meanings.
- [Free Pascal TDataSet.Locate](https://www.freepascal.org/docs-html/fcl/db/tdataset.locate.html) - compatible key and cursor contract.

<small>Created 2026-07-15</small>
