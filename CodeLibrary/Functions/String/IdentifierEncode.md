---
title: "IdentifierEncode"
description: "Replaces non-ASCII identifier characters with underscores but currently appends the intended vx_ prefix when the first character is invalid."
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - identifier
  - encoding
  - implementation-defect
---

```Delphi
Function IdentifierEncode(const Value: string): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IdentifierEncode('Customer Name'); // Customer_Name
end;
```

### Usage

`IdentifierEncode` replaces non-ASCII identifier characters with underscores but currently appends the intended vx_ prefix when the first character is invalid.

### Additional Technical Info
`IdentifierEncode` mechanically maps text toward Velox's narrow ASCII identifier character set. ASCII letters, digits and underscore are retained with their original case; every other character is replaced by underscore.

It does not reliably return a valid identifier because of a current implementation defect for inputs whose first character is not an ASCII letter. Always validate the result with [`IsValidVxIdent`](IsValidVxIdent.md). The example is fictional and source-reviewed only.

**Character mapping**

| Input code unit | Output |
|---|---|
| ASCII `A`-`Z` or `a`-`z` | Original letter and case |
| ASCII `0`-`9` | Original digit |
| `_` | `_` |
| Anything else, including spaces and non-ASCII letters | `_` |

Empty input returns empty. Consecutive invalid characters produce consecutive underscores; they are not collapsed. No trimming or reserved-word check occurs.

**Current first-character defect**

The implementation intends to add `vx_` when the original first character is not an ASCII letter. However, the source executes:

```Delphi
Result := Result + 'vx_';
```

The text is appended as a suffix instead of prepended. Examples of actual behavior are:

| Input | Current result | Valid under `IsValidVxIdent(..., False)` |
|---|---|---|
| `'Customer Name'` | `'Customer_Name'` | Yes |
| `'123'` | `'123vx_'` | No; still starts with a digit |
| `'_Name'` | `'_Namevx_'` | No; still starts with underscore |
| `' Café'` | `'_Caf_vx_'` | No; still starts with underscore |

Do not treat this function as a security encoder or inject its result into code/configuration without validation. Until the product defect is corrected, callers that must accept an invalid first character need to apply their own explicit valid prefix before or after mapping, then revalidate. Also check for collisions: distinct values such as `'A-B'` and `'A B'` both become `'A_B'`.

<small>Created 2026-07-15</small>
