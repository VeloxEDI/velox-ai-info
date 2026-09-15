---
title: "SetArrayLength"
description: "Resizes a dynamic array through the embedded script runtime."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - arrays
  - resize
  - pascalscript
---

```Delphi
procedure SetArrayLength;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Items: TStringArray;
begin
  SetArrayLength(Items, 2);
  Items[0] := 'Alpha';
  Items[1] := 'Beta';
  Value := GetArrayLength(Items); // 2
end;
```

### Usage

`SetArrayLength` resizes a dynamic array through the embedded script runtime.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Arr` | Dynamic array, in/out | Array variable to allocate or resize. The procedure can replace its storage and therefore requires a writable variable. |
| `Count` | `Integer` | Requested number of elements. Zero clears the array; in the shipped runtime, a negative value is also coerced to zero. |

**Behaviour**

When growing an array, existing elements keep their indexes and newly added managed values begin empty or `nil`; scalar storage is zero-initialised. When shrinking, only the first `Count` elements remain. Setting the length to zero releases this array reference and leaves it empty.

**Errors**

An unsupported array type or invalid runtime argument reaches the executor's “Could not call proc” error path. Allocation and element finalisation failures propagate; the procedure has no Velox-specific recovery or logging.

**Usage notes**

Validate external counts before resizing, especially before allocating from file, message or database values. Use `GetArrayLength` when a loop needs the resulting bounds.

### Additional Technical Info
`SetArrayLength` allocates or resizes one dynamic array. It can grow the array, shrink it, or release its storage by setting the length to zero.

The effective Velox call is `SetArrayLength(Arr, Count)`. The generated declaration omits these synthetic parameters because the modified PascalScript compiler adds them directly: the array as an untyped in/out argument and the count as a signed 32-bit integer.

**Implementation**

The embedded compiler and runtime register `SetArrayLength` as a PascalScript built-in. The runtime validates that `Arr` is a dynamic array and calls its dynamic-array allocator. When the array storage is uniquely referenced, the allocator can resize it in place. When storage is shared, it allocates new storage and copies the preserved prefix. Removed managed elements are finalised and newly added elements are initialised.

**Side effects**

`Arr` is mutated and its backing allocation can change. Resizing can also decrement managed references held by removed elements. Other variables that shared the original dynamic-array data retain value semantics through the runtime's copy-on-write path.

**Edge cases and quirks**

- Negative `Count` values are silently treated as zero by this shipped runtime. Do not rely on this as input validation; reject invalid business values explicitly.
- Static arrays are not supported, even though `GetArrayLength` can read their size.
- Velox exposes one count and therefore resizes one array dimension per call. It does not expose the string or multidimensional forms of Delphi/Free Pascal `SetLength`.
- Passing an expression instead of a writable array variable is invalid because `Arr` is an in/out parameter.
- Very large requested lengths can exhaust memory. The runtime uses signed 32-bit counts and its allocation-size arithmetic should not be treated as a robust business limit check.

**Performance and concurrency**

Resizing may initialise or finalise a number of elements proportional to the size change. Copy-on-write can additionally copy the preserved prefix. The operation allocates memory as required and provides no locking for concurrent access to the same variable.

**Related entries**

- [`GetArrayLength`](GetArrayLength.md) — returns the current element count.

**External references**

- [Free Pascal: `SetLength`](https://www.freepascal.org/docs-html/rtl/system/setlength.html)
- [Embarcadero DocWiki: `System.SetLength`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SetLength)

<small>Created 2026-07-15</small>
