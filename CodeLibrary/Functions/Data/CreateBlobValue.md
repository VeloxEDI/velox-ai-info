---
title: "CreateBlobValue"
description: "Creates a byte-array Variant from part of a Delphi string, subject to a critical Unicode buffer defect."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - blob
  - variant-array
  - unicode
  - defect
---

```Delphi
Function CreateBlobValue(S: string; L: integer): Variant
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Do not use this helper in the current build; see the defect below.
  Value := Null;
end;
```

### Usage

`CreateBlobValue` creates a byte-array Variant from part of a Velox string, subject to a critical Unicode buffer defect.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string` | Source Velox Unicode string. `Length(S)` counts UTF-16 code units, not encoded bytes. |
| `L` | `integer` | Maximum string length to select when nonzero and less than `Length(S)`. `0` means no limit. Negative values are unsafe. |

**Returns**

For an empty `S`, returns `Null`. Otherwise Velox attempts to return a one-dimensional `varByte` Variant array with bounds `[0, Len - 1]`.

**Behaviour and edge cases**

- `S = ''` returns `Null`; it does not return an empty byte array.
- `L = 0` selects the whole string.
- A positive `L` shorter than the string selects the first `L` UTF-16 code units. A larger `L` has no effect.
- A negative `L` can replace `Len` with a negative value, producing invalid Variant-array bounds before the copy.
- Surrogate pairs can be split when a positive character limit cuts between their UTF-16 code units.
- No text encoding such as UTF-8 is performed. Raw in-memory UTF-16 bytes were apparently intended, so the result would not be portable text even if the allocation were corrected.

**Errors**

Variant-array creation and access errors are raised to the script. Memory corruption may instead surface later or in unrelated code. These errors are not caught by the function.

**Usage notes**

Use a supported, encoding-aware binary or blob path instead. This page records the shipped behaviour so technical users and agents do not mistake the public declaration for a safe serialiser.

### Additional Technical Info
`CreateBlobValue` is intended to copy a Delphi string into a zero-based Variant byte array, optionally limiting the number of characters copied. **The current Unicode implementation allocates too little memory and can overwrite the array buffer. Do not call it until the product implementation is corrected.**

The example intentionally does not invoke the function. It is source-reviewed and was not executed by the documentation workflow.

**Implementation**

The PascalScript import binds directly to `vxCommonString.CreateBlobValue`. The function chooses `Len := Length(S)`, reduces it to `L` when `L <> 0` and `Len > L`, creates `VarArrayCreate([0, Len - 1], varByte)`, locks the array, copies from the string pointer with `Move`, then unlocks it in a `finally` block.

The defect is in the size units: the array contains `Len` **bytes**, but `Move` copies `Len * SizeOf(Char)` bytes. The current Delphi build uses a two-byte Unicode `Char`, so every non-empty call attempts to write twice the allocated payload. Variant-array locking does not enlarge the destination.

**Side effects**

The function allocates a Variant array and temporarily locks its data. The current overflow can corrupt memory outside that array; resulting behaviour is undefined.

**Performance and concurrency**

The intended operation is linear in the selected string length. The current implementation is unsafe regardless of input size or concurrency; locking only protects the Variant array from relocation while accessed.

**Related entries**

- [`ReadBlobValue`](ReadBlobValue.md) contains a separate stream-position and byte/character defect.

**External references**

- [Embarcadero `System.Variants.VarArrayCreate`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarArrayCreate) - describes creating a Variant array from bounds and an element type.
- [Free Pascal `VarArrayCreate`](https://www.freepascal.org/docs-html/rtl/variants/vararraycreate.html) - documents the compatible bounds and homogeneous-element model.
- [Free Pascal `VarArrayLock`](https://www.freepascal.org/docs-html/rtl/variants/vararraylock.html) - explains that locking returns a data pointer and requires a matching unlock; it does not make an oversized copy safe.

<small>Created 2026-07-15</small>
