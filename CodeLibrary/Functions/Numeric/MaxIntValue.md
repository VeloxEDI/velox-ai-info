---
title: "MaxIntValue"
description: "Returns the largest Integer in a non-empty open-array argument."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - maximum
  - arrays
---

```Delphi
function MaxIntValue(const aValues: array of Integer): Integer;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := MaxIntValue([4, -2, 9, 9]); // 9
end;
```

### Usage

`MaxIntValue` returns the largest Integer in a non-empty open-array argument.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValues` | open array of `Integer`, `const` | One or more 32-bit signed values. Inline open-array syntax such as `[A, B, C]` is supported. |

**Returns**

The greatest element. Duplicate maxima do not change the result and no index is returned.

### Additional Technical Info
`MaxIntValue` returns the largest actual value in a non-empty open array of 32-bit Integers. It does not return the maximum representable Integer type constant; use [`High`](High.md) for a type/storage boundary.

The wrapper delegates directly to Delphi `System.Math.MaxIntValue`. The example is fictional and source-reviewed only.

**Implementation**

The Velox wrapper calls `Math.MaxIntValue(aValues)`. The installed RTL initializes the result from `Data[Low(Data)]`, then scans from the second through last element and replaces the result whenever it finds a larger value.

**Edge cases and errors**

- An empty array is invalid. The installed RTL immediately reads `Data[0]` without first checking the length. That access is inside the separately compiled RTL, so the product project's range-check setting does not make the result predictably safe: an RTL build with checks can raise `ERangeError`; otherwise the call can read outside the empty array and return an undefined value. Never pass an empty array.
- A single element returns itself.
- Values remain exact 32-bit Integers; there is no floating conversion or locale behavior.
- Evaluation/conversion of inline array element expressions occurs before the helper runs and can raise independently.

**Performance and side effects**

The function is pure and performs a linear `O(n)` scan with constant additional storage. It does not sort or mutate the input.

**Related entries**

- [`MinIntValue`](MinIntValue.md) returns the smallest array element.
- [`High`](High.md) returns an index or type maximum rather than an array value maximum.

**External references**

- [Free Pascal: `Math.MaxIntValue`](https://www.freepascal.org/docs-html/rtl/math/maxintvalue.html)
- [Embarcadero DocWiki: `System.Math.MaxIntValue`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.MaxIntValue)

<small>Created 2026-07-15</small>
