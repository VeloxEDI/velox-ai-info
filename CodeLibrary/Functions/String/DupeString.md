---
title: "DupeString"
description: "Returns ACount adjacent copies of a string using Delphi StrUtils allocation and repeated memory copies."
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - duplicate
  - repeat
  - allocation
---

```Delphi
Function DupeString(const AText: string; ACount: Integer): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DupeString('ab', 3); // ababab
end;
```

### Usage

`DupeString` returns ACount adjacent copies of a string using Velox StrUtils allocation and repeated memory copies.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `AText` | `string` | Text copied into each repetition. |
| `ACount` | `Integer` | Number of copies requested. Use a non-negative value. |
| Result | `string` | Concatenation with intended length `Length(AText) * ACount`. |

`ACount = 0` or empty `AText` produces an empty string. A count of one produces a value equal to the input.

### Additional Technical Info
`DupeString` returns `ACount` adjacent copies of `AText`. It inserts no separator and does not modify the input.

The example is fictional and source-reviewed only.

**Implementation and limits**

Velox imports the installed Delphi `System.StrUtils.DupeString` directly. That routine calculates the full output length, allocates the result once, and repeatedly copies `AText` into it. Runtime and storage are proportional to the resulting character count.

The implementation assumes a valid non-negative count and a representable product. A negative count, integer multiplication overflow, an output beyond the process string limit or insufficient memory can cause an exception or allocation failure. Validate any count derived from input and impose a business limit before calling it. This routine is especially unsuitable for unbounded external counts in a long-running Velox service.

For one repeated character, [`StringOfChar`](StringOfChar.md) expresses the intent directly. To join a collection with separators, use a joining routine instead of embedding separators into `AText` unless a trailing separator is wanted.

**External references**

- [Embarcadero DocWiki: `System.StrUtils.DupeString`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.DupeString)
- [Free Pascal: `StrUtils.DupeString`](https://www.freepascal.org/docs-html/rtl/strutils/dupestring.html)

<small>Created 2026-07-15</small>
