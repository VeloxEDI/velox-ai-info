---
title: "Arrays"
description: "Functions for measuring, resizing and converting arrays and string collections in Velox scripts."
sidebar_position: 2
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - arrays
  - strings
  - collections
---

The Arrays group contains the embedded script-runtime operations for reading and changing array length, plus Velox helpers that copy strings between dynamic arrays and `TStrings` collections.

Use the length functions to create or resize a dynamic array before assigning indexed elements. Use the collection helpers when a Velox or Delphi object exposes a `TStrings`-compatible list but the mapping needs a `TStringArray`, or the reverse.

## Common tasks

- Use `GetArrayLength` to read the number of elements in a static or dynamic array.
- Use `SetArrayLength` to allocate, grow, shrink or clear a dynamic array.
- Use `StringsToArray` to take a value-only snapshot of a `TStrings` collection.
- Use `AddStringArrayToStrings` to append array elements to an existing `TStringList` without clearing it.

## Important behaviour

Array indexes are zero based. A length of `N` provides indexes from `0` through `N - 1`. Resizing preserves the common prefix, initialises new elements, and finalises elements removed from managed arrays.

The conversion helpers copy string values. They do not transfer ownership of the source collection, copy its associated `Objects`, or synchronise concurrent access.

## Edge cases and quirks

- `GetArrayLength` supports static and dynamic arrays, but `SetArrayLength` resizes only dynamic arrays.
- The effective Velox calls take parameters even though the generated declarations in the index omit them: `GetArrayLength(Arr)` and `SetArrayLength(Arr, Count)`.
- In the shipped PascalScript runtime, a negative new array length is coerced to zero.
- Velox's `SetArrayLength` changes one dimension per call and does not expose the broader string or multidimensional forms documented for Delphi and Free Pascal `SetLength`.
- Collection arguments must refer to live objects. The helpers do not check for `nil` before dereferencing them.

## External references

- [Free Pascal: `Length`](https://www.freepascal.org/docs-html/rtl/system/length.html)
- [Free Pascal: `SetLength`](https://www.freepascal.org/docs-html/rtl/system/setlength.html)
- [Embarcadero DocWiki: `System.Length`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Length)
- [Embarcadero DocWiki: `System.SetLength`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SetLength)


