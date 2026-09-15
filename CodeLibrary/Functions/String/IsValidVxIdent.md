---
title: "IsValidVxIdent"
description: "Tests a narrow ASCII identifier grammar with an optional allowance for ordinary spaces after the required leading letter."
sidebar_position: 23
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - identifier
  - validation
  - ascii
---

```Delphi
Function IsValidVxIdent(const Ident: string; aAllowSpace: boolean): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsValidVxIdent('Customer_2', False); // True
end;
```

### Usage

`IsValidVxIdent` tests a narrow ASCII identifier grammar with an optional allowance for ordinary spaces after the required leading letter.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `Ident` | `string` | Candidate to validate exactly as supplied. |
| `aAllowSpace` | `Boolean` | When true, ASCII space (`#32`) is accepted after the first character. It does not permit tabs or other whitespace. |
| Result | `Boolean` | `True` only when every source-defined condition passes. |

### Additional Technical Info
`IsValidVxIdent` checks whether `Ident` follows Velox's source-defined ASCII identifier character rules. A valid value must begin with an ASCII letter. Remaining characters may be ASCII letters, digits or underscore; ordinary spaces are also allowed when `aAllowSpace` is `True`.

The example is fictional and source-reviewed only.

**Grammar**

```text
First character: A-Z or a-z
Later characters when False: A-Z, a-z, 0-9, _
Later characters when True:  A-Z, a-z, 0-9, _, space
```

Empty input, a leading digit, a leading underscore or a leading space is invalid. With spaces allowed, repeated, internal or trailing spaces all pass because the implementation applies no placement rule beyond the first character. Non-ASCII letters, hyphens, dots and punctuation fail.

This routine validates character shape only. It does not check PascalScript reserved words, Velox naming conventions, name uniqueness, maximum length, collisions, case-equivalent names or whether a target configuration location actually accepts spaces. Apply those contextual rules separately.

[`IdentifierEncode`](IdentifierEncode.md) maps invalid characters but has a current first-character suffix defect; never assume its result passes this validation without calling `IsValidVxIdent`.

<small>Created 2026-07-15</small>
