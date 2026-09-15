---
title: TIntegerArray
description: Stores a zero-based managed sequence of signed 32-bit integer values in Velox scripts.
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, array, integer, longint, numeric]
---

```Delphi
TIntegerArray = array of LongInt
```

### Example

```Delphi
function TotalValues(const Values: TIntegerArray): Int64;
var
  I: Integer;
begin
  Result := 0;
  for I := 0 to High(Values) do
    Result := Result + Values[I];
end;
```

### Usage

`TIntegerArray` stores a zero-based managed sequence of signed 32-bit integer values in Velox scripts.

#### Allocation and indexing

- `SetLength(Values, N)` sets the element count. Newly added elements are initialized to 0.
- Valid indexes are zero through `Length(Values) - 1`; the integer stored at an index has no relationship to that index.
- Shrinking retains the first `N` values. Clearing with length zero yields an empty managed array.
- External counts must be checked before allocation. Multiplication, accumulation and narrowing can overflow even when every individual element is valid.
- An out-of-range index raises a Velox scripting range error. Do not use an element value as an index without a separate bounds check.

The example accumulates into `Int64` so that adding multiple valid 32-bit elements has a wider result. The caller must still define its acceptable count and total range.

#### Assignment and mutation

Array assignment does not immediately copy all elements. Changing `CopyOfValues[I]` can therefore change `Values[I]`. Changing the length can separate the arrays, but `SetLength(A, Length(A))` does not. Make an explicit element-by-element copy when independent editing is required.

Do not assume that a `TIntegerArray` is sorted, unique or stable unless the function returning it explicitly guarantees those properties.

### Additional Technical Info
`TIntegerArray` is registered by the Velox common scripting importer as `array of Integer`. The generated declaration displays `LongInt` because public PascalScript [`Integer`](../DataTypes/Integer.md) is a signed 32-bit alias of `LongInt`; the two declarations describe the same current element representation.

**Related Code Library entries**

- [Integer](../DataTypes/Integer.md) - signed 32-bit element behavior.
- [Arrays](../Arrays.md) - shared dynamic-array behavior and safe-copy guidance.

**External references**

- [Embarcadero structured types](https://docwiki.embarcadero.com/RADStudio/Athens/en/Structured_Types_%28Delphi%29) - dynamic arrays and valid indexes.
- [Embarcadero System.SetLength](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.SetLength) - resize and element initialization.
- [Free Pascal dynamic arrays](https://www.freepascal.org/docs-html/ref/refsu14.html) - compatible allocation and indexing model.

<small>Created 2026-07-15</small>
