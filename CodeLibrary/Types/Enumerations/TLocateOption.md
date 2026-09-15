---
title: TLocateOption
description: Defines case-insensitive and partial-key matching options for a dataset Locate operation.
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, enumeration, dataset, locate, search, matching]
---

```Delphi
TLocateOption = (loCaseInsensitive, loPartialKey)
```

### Example

```Delphi
procedure FindCustomer(DataSet: TDataSet; var Found: Boolean);
begin
  Found := DataSet.Locate(
    'CustomerCode',
    'ABC',
    [loCaseInsensitive, loPartialKey]);
end;
```

### Usage

`TLocateOption` defines case-insensitive and partial-key matching options for a dataset Locate operation.

#### Members

| Value | Ordinal | Meaning |
|---|---:|---|
| [`loCaseInsensitive`](../../Constants/Enumeration/loCaseInsensitive.md) | 0 | Compare supported key text without case significance. |
| [`loPartialKey`](../../Constants/Enumeration/loPartialKey.md) | 1 | Permit a prefix match on the final supported text key. |

#### Behavior and boundaries

- In the Velox client-dataset handling, partial matching appends a wildcard only to the final key field and only when that field is a string, fixed char, wide string, GUID or fixed wide char.
- Case-insensitive matching is passed into the client-dataset filter expression. Collation and Unicode behavior are Velox-specific, not a culture-independent text contract.
- Multiple key fields use a Variant array whose order must match the semicolon-separated `KeyFields`. A scalar is accepted only for one key field.
- Null key values generate `IS NULL`; unsupported field kinds raise a bad-field-type database error.
- The client search starts at BOF and chooses the first filter match. `BeforeScroll` runs for every attempt; a successful locate moves/resynchronizes the visible cursor and invokes `AfterScroll`.
- Locate enters browse mode before searching and can therefore finish pending edit/insert state. Treat it as state-changing, and do not use it concurrently on a shared dataset.
- `TvxClientDataSet.Find` always supplies `[loCaseInsensitive]`; use `Locate` directly when partial or exact case-sensitive behavior is required.

### Additional Technical Info
`TLocateOption` is the element type of `TLocateOptions`, the set passed to a dataset's `Locate` method. Pass `[]` for exact, case-sensitive matching or combine the named options in a set.

Velox's modified base `TDataSet.Locate` returns false; concrete dataset classes implement the search. Because the imported method is virtual, PascalScript dispatches to the actual dataset class. The exact treatment of options is therefore provider-dependent.

**External references**

- [Embarcadero TLocateOption](https://docwiki.embarcadero.com/Libraries/en/Data.DB.TLocateOption) - Delphi option meanings.
- [Free Pascal TLocateOption](https://www.freepascal.org/docs-html/fcl/db/tlocateoption.html) - compatible Locate option behavior.
- [Free Pascal TDataSet.Locate](https://www.freepascal.org/docs-html/fcl/db/tdataset.locate.html) - key and cursor semantics.
- [Embarcadero enumerated types](https://docwiki.embarcadero.com/RADStudio/en/Simple_Types_(Delphi)) - Delphi ordinal semantics.
- [Free Pascal ordinal types](https://www.freepascal.org/docs-html/ref/refsu4.html) - compatible enumeration concepts.

<small>Created 2026-07-15</small>
