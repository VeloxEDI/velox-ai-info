---
title: Arrays
description: Select and safely manage the four zero-based dynamic-array types available to Velox scripts.
sidebar_position: 3
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, arrays, dynamic-array, bytes, strings, variants]
---

## Select an array type

Velox exposes four named one-dimensional dynamic-array types. Choose the type from the meaning of each element, not from the operation that happens to consume it.

| Type | Element | Use it for | Important boundary |
|---|---|---|---|
| [`TBytes`](Arrays/TBytes.md) | [`Byte`](DataTypes/Byte.md) | Binary payloads, encoded data, files and stream transfer | It is not text; decode or encode explicitly. |
| [`TIntegerArray`](Arrays/TIntegerArray.md) | [`Integer`](DataTypes/Integer.md) | Ordered signed 32-bit values | An element value is independent of its zero-based index. |
| [`TStringArray`](Arrays/TStringArray.md) | [`String`](DataTypes/String.md) | Ordered Unicode text values | A blank element is different from an empty array. |
| [`TVariantArray`](Arrays/TVariantArray.md) | [`Variant`](DataTypes/Variant.md) | Heterogeneous or dynamically typed values | Inspect Empty, Null and type state before conversion. |

## Shared runtime behavior

These are managed dynamic arrays implemented by the modified PascalScript runtime:

- A newly initialized or cleared array has `Length(A) = 0`, `Low(A) = 0` and `High(A) = -1`.
- Valid indexes are always `0 .. Length(A) - 1`. Iterate to `High(A)` only when the array is nonempty, or use a loop whose initial condition handles `High(A) = -1`.
- `SetLength(A, N)` resizes in elements, preserves the common prefix, initializes newly added elements and finalizes removed managed elements.
- Use `SetLength(A, 0)` to clear an array. The runtime silently treats a negative requested length as zero, but relying on that implementation quirk obscures intent.
- Assignment shares the backing storage. Element writes through one assigned variable can therefore be observed through the other.
- Changing the length of a shared array normally allocates a private copy. However, `SetLength(A, Length(A))` is an early no-op in the current runtime and does not detach it.
- Storage is reference-counted and released automatically. Do not use `New`, `Dispose` or pointer arithmetic to manage it.

When an independent copy is required, allocate the destination to the same length and copy each element explicitly. Do not use a same-length `SetLength` call as a copy operation.

## Interchange rules

- Treat array length and every external index as untrusted input. Check practical size limits before allocating or looping.
- A `const` parameter prevents reassignment through that parameter but is not a promise that every other alias is immutable.
- A `var` parameter can replace or resize the caller's array. Review the called function's contract before assuming existing elements survive.
- Serialize with an explicit representation. A `TBytes` value needs a binary encoding such as Base64 for text-only formats; string, integer and Variant arrays need element-level null/type rules.
- Do not persist implementation pointers or rely on reference counts. They are runtime internals, not a script-visible data contract.

**External references**

- [Embarcadero structured types](https://docwiki.embarcadero.com/RADStudio/Athens/en/Structured_Types_%28Delphi%29) - Delphi dynamic-array indexing, assignment and lifetime model.
- [Embarcadero System.SetLength](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.SetLength) - resize, preservation and initialization contract.
- [Free Pascal dynamic arrays](https://www.freepascal.org/docs-html/ref/refsu14.html) - compatible dynamic-array declaration and indexing model.
- [Free Pascal SetLength](https://www.freepascal.org/docs-html/rtl/system/setlength.html) - compatible allocation and resize behavior.

<small>Created 2026-07-15</small>
