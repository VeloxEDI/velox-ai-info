---
title: "Delete"
description: "Removes a one-based range of characters from a mutable string and shifts the remaining suffix left."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - delete
  - mutation
  - indexing
---

```Delphi
procedure Delete(var S: String; iFrom, iCount: LongInt);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Text: string;
begin
  Text := 'AB---CD';
  Delete(Text, 3, 3);
  Value := Text; // ABCD
end;
```

### Usage

`Delete` removes a one-based range of characters from a mutable string and shifts the remaining suffix left.

**Parameters**

| Name | Mode | Description |
|---|---|---|
| `S` | `var`/in-out | Assignable string variable to change. A literal or calculated expression cannot be supplied. |
| `iFrom` | input | One-based position of the first character to remove. |
| `iCount` | input | Maximum number of characters to remove. |

There is no return value.

**Boundary behaviour**

- `iFrom < 1` or `iFrom > Length(S)` leaves `S` unchanged.
- `iCount <= 0` leaves `S` unchanged.
- A count extending past the end removes the complete suffix from `iFrom`.
- Deleting the complete valid range produces an empty string.
- Empty input remains empty.

String positions are code-unit positions. Deleting one half of a UTF-16 surrogate pair or part of a multibyte ANSI character can produce invalid text; determine boundaries using the same encoding model as the actual string.

### Additional Technical Info
`Delete` mutates a string variable by removing `iCount` characters beginning at the one-based position `iFrom`. Later characters shift left and the string length decreases.

The example is fictional and source-reviewed only.

**PascalScript dispatch and side effects**

This is modified PascalScript standard-procedure selector 5. The handler dispatches to Delphi `Delete` for ANSI, `WideString` and `UnicodeString` actual values. It does not convert other value types. The caller's variable is written back in place; use [`Copy`](Copy.md) when the original must be preserved.

No Velox map state, logging or transaction state is changed. An alias to the same string variable observes the normal PascalScript/Delphi string assignment semantics, including copy-on-write for managed strings.

**External references**

- [Embarcadero DocWiki: `System.Delete`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Delete)
- [Free Pascal: `System.Delete`](https://www.freepascal.org/docs-html/rtl/system/delete.html)

<small>Created 2026-07-15</small>
