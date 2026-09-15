---
title: "SetLength"
description: "Resizes a mutable PascalScript ANSI string through hidden compiler-injected arguments."
sidebar_position: 52
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - length
  - intrinsic
---

```Delphi
procedure SetLength;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  S: AnsiString;
begin
  S := 'ABCDE';
  SetLength(S, 3);
  Value := S; // ABC
end;
```

### Usage

Call `SetLength(S, NewLength)` to resize a writable `AnsiString`. Shrinking removes the suffix, while zero or a negative length clears the string.

This entry does not accept the normal Unicode `String` type or dynamic arrays in current Velox. Declare `AnsiString` explicitly when it is required, and use [`SetArrayLength`](../Arrays/SetArrayLength.md) for arrays.

**Effective script syntax**

```Delphi
procedure SetLength(var S; NewLength: Integer);
```

**Parameters**

| Parameter | Meaning |
|---|---|
| `S` | Mutable `var` argument. Runtime selector 14 accepts only the Velox scripting `btString` base type, represented by `AnsiString` in the current Velox build. An ordinary `String` has base type `btUnicodeString` and is rejected. |
| `NewLength` | Requested signed length. Zero or a negative value clears the current ANSI string in Velox. |

**Behavior**

- Shrinking preserves positions `1..NewLength` and discards the suffix.
- Setting the same length leaves the string unchanged.
- Clearing releases the managed string reference.
- Extending preserves the old prefix, but the newly allocated tail does not have a documented content contract. Assign every new position before reading or exposing it.
- Managed-string copy-on-write semantics prevent an ordinary shared string reference from being unintentionally resized as the same storage.

### Additional Technical Info
`SetLength` changes the length of a mutable script `AnsiString`. The generated Code Library declaration is incomplete: the modified PascalScript compiler creates the required parameters programmatically. In the current Delphi build, an ordinary script `String` is `UnicodeString` and fails this entry's runtime type check.

The example is fictional and source-reviewed only.

**Generated declaration**

**Important limitations**

- Despite the untyped compiler-injected first parameter, this runtime entry is ANSI-string-only. Dynamic arrays use [`SetArrayLength`](../Arrays/SetArrayLength.md); passing an array or other base type fails the runtime type check.
- The wrapper does not dispatch `WideString` or `UnicodeString` actual types as the modified `Length` function does. This includes the normal `String` type in the current build. Declare `AnsiString` explicitly when this intrinsic is required, and account for code-page conversion.
- `S` must be a writable variable, not a literal, constant or expression.
- Very large lengths can raise integer-overflow or memory-allocation exceptions.
- A string extended with NUL/unspecified tail data can behave differently in pointer-based helpers even though Delphi `Length` reports the full allocation.

**Performance and concurrency**

Shrinking or extending a uniquely owned allocation may reallocate it; shared strings require a new allocation and prefix copy. The procedure mutates only the caller's variable and uses no Velox global state.

**External references**

- [Embarcadero DocWiki: `System.SetLength`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SetLength)
- [Free Pascal: `System.SetLength`](https://www.freepascal.org/docs-html/rtl/system/setlength.html) - broader language compatibility reference; the Velox runtime deliberately exposes a narrower string-only dispatch here.

<small>Created 2026-07-15</small>
