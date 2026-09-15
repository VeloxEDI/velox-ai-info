---
title: "Insert"
description: "Inserts a source string into a mutable destination at a clamped one-based position and shifts the existing suffix right."
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - insert
  - mutation
  - indexing
---

```Delphi
procedure Insert(S: String; var s2: String; iPos: LongInt);
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Text: string;
begin
  Text := 'ABCD';
  Insert('--', Text, 3);
  Value := Text; // AB--CD
end;
```

### Usage

Inserts a source string into a mutable destination at a clamped one-based position and shifts the existing suffix right.

**Parameters**

| Name | Mode | Description |
|---|---|---|
| `S` | input | Source text to insert. Empty source is a no-op. |
| `s2` | `var`/in-out | Assignable destination string that is replaced in place. |
| `iPos` | input | One-based insertion position. |

**Position rules in Velox**

- `iPos = 1` inserts at the beginning.
- `iPos < 1` is clamped to the beginning.
- `iPos = Length(s2) + 1` appends.
- Any larger position is clamped to the end and also appends.
- Empty destination receives the complete source at every position.
- Inserting an empty source changes nothing.

Velox supports ANSI, `WideString` and `UnicodeString` values. Other value types cause an error. Inserting a string into itself is supported.

Positions count string code units. Do not insert between the code units that form one encoded character. Allocation failure or length overflow can raise an error for very large results.

### Additional Technical Info
`Insert` mutates destination variable `s2` by placing all of `S` immediately before the existing character at one-based position `iPos`. Existing content from that position shifts right. The procedure returns no value.

The example is fictional and source-reviewed only.

**External references**

- [Embarcadero DocWiki: `System.Insert`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Insert)
- [Free Pascal: `System.Insert`](https://www.freepascal.org/docs-html/rtl/system/insert.html)

<small>Created 2026-07-15</small>
