---
title: "GetArrayLength"
description: "Returns the element count of a supported static or dynamic array."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - arrays
  - length
  - pascalscript
---

```Delphi
function GetArrayLength: Integer;
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
var
  Items: TStringArray;
begin
  SetArrayLength(Items, 3);
  Value := GetArrayLength(Items); // 3
end;
```

### Usage

`GetArrayLength` returns the element count of a supported static or dynamic array.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Arr` | Array | Static or dynamic array whose element count is required. The argument is read, not resized or otherwise changed. |

**Returns**

An `Integer` element count. An unallocated or zero-length dynamic array returns `0`. A static array returns its declared fixed size.

**Behaviour**

The result is an element count, not the highest valid index or a byte size. For a non-empty zero-based array, the last valid index is `GetArrayLength(Arr) - 1`.

**Errors**

Unsupported or invalid runtime arguments cause the script executor to report that it could not call the procedure/function. The handler does not translate that failure to an element count.

### Additional Technical Info
`GetArrayLength` returns the number of elements in a static or dynamic array handled by the embedded Velox script runtime.

The effective Velox call is `GetArrayLength(Arr)`. The generated Code Library declaration omits the synthetic `Arr` parameter because the compiler registers it separately as an untyped array argument.

**Implementation**

The modified PascalScript compiler creates this built-in and attaches the untyped `Arr` parameter. At runtime, Velox's shipped PascalScript handler inspects the argument's runtime type. It reads the compile-time size for a static array or the dynamic-array header length for a dynamic array.

**Edge cases and quirks**

- Only the effective call with an array argument is useful, despite the parameterless generated declaration.
- Unlike the wider Delphi and Free Pascal `Length` built-ins, `GetArrayLength` does not accept strings or other container types.
- Static arrays can be measured but cannot be resized by `SetArrayLength`.
- An unsupported argument type reaches the runtime's “Could not call proc” failure path rather than returning zero.

**Side effects**

The function only reads array metadata. It does not allocate, copy, resize or initialise elements.

**Performance and concurrency**

Length retrieval is constant time. The function performs no allocation and adds no locking; an array must not be resized concurrently through unsafe shared access.

**Related entries**

- [`SetArrayLength`](SetArrayLength.md) — changes the length of a dynamic array.

**External references**

- [Free Pascal: `Length`](https://www.freepascal.org/docs-html/rtl/system/length.html)
- [Embarcadero DocWiki: `System.Length`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Length)

<small>Created 2026-07-15</small>
