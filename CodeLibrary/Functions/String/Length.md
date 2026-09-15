---
title: "Length"
description: "Returns the runtime length of a string, array, character or compatible Variant through a compiler-injected argument omitted from the generated declaration."
sidebar_position: 28
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - array
  - length
  - generated-declaration
---

```Delphi
function Length: Integer;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Length('Velox'); // 5
end;
```

### Usage

Call `Length(Value)` to obtain the number of string code units, array elements or compatible Variant elements. A `Char` returns `1`, while an empty string or dynamic array returns `0`.

The displayed declaration omits the required argument. For array iteration, use `Low` and `High` when the lower bound may not be zero; `Length` is a count, not the highest valid index.

**Effective call syntax**

```Delphi
Length(S): Integer
```

### Additional Technical Info
`Length` returns a count appropriate to the runtime type of its one argument. It supports strings, dynamic and static arrays, `Char`, and a compatible `Variant`. The generated Code Library declaration is incomplete: the modified compiler injects an untyped input parameter named `S` after publishing the parameterless signature.

Real scripts must pass one argument as shown. The example is fictional and source-reviewed only.

**Generated declaration**

**Runtime type behavior**

| Actual value kind | Result |
|---|---|
| ANSI `String` | Number of stored bytes/code units. Empty is `0`. |
| `WideString` or `UnicodeString` | Number of UTF-16 code units. A surrogate pair counts as two. |
| Dynamic array | Current element count. Nil/empty is `0`. |
| Static array | Declared number of elements, independent of its lower bound. |
| `Char` | Always `1`. |
| `Variant` | Delphi Variant length operation; string/array-like compatible values can return a count, while incompatible content can raise an exception. |
| Any other runtime base type | PascalScript reports a type mismatch. |

The compiler-injected parameter is untyped so one public entry can serve these categories. This also means the generated declaration does not document the accepted types and ordinary call-site typing must be understood from the actual expression.

`Length` does not count user-perceived characters, words, encoded display width, collection capacity or the highest array index. For a zero-based dynamic array, the highest valid index is `Length(A) - 1`; when the array is empty that expression is `-1`. For a static array with a nonzero lower bound, use `Low`/`High` rather than assuming zero-based indexes.

**External references**

- [Embarcadero DocWiki: `System.Length`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Length)
- [Free Pascal: `System.Length`](https://www.freepascal.org/docs-html/rtl/system/length.html)

<small>Created 2026-07-15</small>
