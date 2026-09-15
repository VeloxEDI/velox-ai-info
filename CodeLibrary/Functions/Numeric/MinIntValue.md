---
title: "MinIntValue"
description: "Returns the smallest Integer in a non-empty open-array argument."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - minimum
  - arrays
---

```Delphi
function MinIntValue(const aValues: array of Integer): Integer;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := MinIntValue([4, -2, 9, -2]); // -2
end;
```

### Usage

`MinIntValue` returns the smallest Integer in a non-empty open-array argument.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValues` | open array of `Integer`, `const` | One or more 32-bit signed values. Inline open-array syntax such as `[A, B, C]` is supported. |

**Returns**

The least element. Duplicate minima do not change the result and no index is returned.

### Additional Technical Info
`MinIntValue` returns the smallest actual value in a non-empty open array of 32-bit Integers. It does not return the minimum representable Integer type constant; use [`Low`](Low.md) for a type/storage boundary.

The wrapper delegates directly to Delphi `System.Math.MinIntValue`. The example is fictional and source-reviewed only.

**Implementation**

The Velox wrapper calls `Math.MinIntValue(aValues)`. The installed RTL initializes the result from `Data[Low(Data)]`, then linearly replaces it whenever a smaller value is found.

**Edge cases and errors**

- An empty array is invalid. The installed RTL immediately reads `Data[0]` without first checking the length. That access is inside the separately compiled RTL, so the product project's range-check setting does not make the result predictably safe: an RTL build with checks can raise `ERangeError`; otherwise the call can read outside the empty array and return an undefined value. Never pass an empty array.
- A single element returns itself.
- Values remain exact 32-bit Integers; there is no floating conversion or locale behavior.
- Element-expression conversion/evaluation errors occur before the helper is entered.

**Performance and side effects**

The function is pure and performs a linear `O(n)` scan with constant additional storage. It does not sort or mutate the array.

**Related entries**

- [`MaxIntValue`](MaxIntValue.md) returns the largest array element.
- [`Low`](Low.md) returns an index or type minimum rather than an array value minimum.

**External references**

- [Free Pascal: `Math.MinIntValue`](https://www.freepascal.org/docs-html/rtl/math/minintvalue.html)
- [Embarcadero DocWiki: `System.Math.MinIntValue`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.MinIntValue)

<small>Created 2026-07-15</small>
