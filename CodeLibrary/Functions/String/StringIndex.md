---
title: "StringIndex"
description: "Returns the zero-based first whole-string match, with the current implementation reversing its case-sensitivity flag."
sidebar_position: 56
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - index
  - defect
---

```Delphi
Function StringIndex( const aString : String; const aCases : TStringArray; const aCaseSensitive : Boolean) : Integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Cases: TStringArray;
begin
  SetArrayLength(Cases, 2);
  Cases[0] := 'Ready';
  Cases[1] := 'Held';
  Value := StringIndex('ready', Cases, True); // 0: True currently ignores case
end;
```

### Usage

Use `StringIndex` to find the zero-based first whole-string match in a `TStringArray`; it returns `-1` when no item matches.

Current Velox reverses the declared flag: pass `True` for case-insensitive matching and `False` for case-sensitive matching. Review affected scripts when this product defect is corrected; [`IndexText`](IndexText.md) is the clearer choice for case-insensitive lookup.

**Return value**

- `0..Length(aCases)-1` for the first complete-string match;
- `-1` for no match or an empty array.

Duplicate matching entries return the lowest index. Substrings do not match; both complete strings are compared.

### Additional Technical Info
`StringIndex` returns the zero-based position of the first array element equal to `aString`, or `-1` when no element matches. The current implementation reverses the meaning of `aCaseSensitive`.

The example is fictional and source-reviewed only. It deliberately demonstrates the flag defect.

**Actual case behavior**

| `aCaseSensitive` | Native comparison used | Actual behavior |
|---|---|---|
| `True` | `SameText(aString, aCases[i])` | Case-insensitive. |
| `False` | `SameStr(aString, aCases[i])` | Case-sensitive. |

This is not only a documentation naming issue; the branches in the product source call the opposite helper.

**Performance and concurrency**

Elements are compared sequentially until a match. Runtime is proportional to the number and length of candidates. The function does not mutate the array or shared Velox state.

**External references**

- [Embarcadero DocWiki: `System.SysUtils.SameText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.SameText)
- [Embarcadero DocWiki: `System.SysUtils.SameStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.SameStr)
- [Free Pascal: `SameText`](https://www.freepascal.org/docs-html/rtl/sysutils/sametext.html) - compatibility context.
- [Free Pascal: `SameStr`](https://www.freepascal.org/docs-html/rtl/sysutils/samestr.html) - compatibility context.

<small>Created 2026-07-15</small>
