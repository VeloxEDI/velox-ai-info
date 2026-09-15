---
title: "ExtractNumberString"
description: "Collects ASCII digits, the first dot and a sign accepted before any retained character, without guaranteeing a valid number."
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - string
  - number
  - extraction
  - validation
---

```Delphi
Function ExtractNumberString(const S: string): String
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ExtractNumberString('NZD -1,234.50'); // '-1234.50'
end;
```

### Usage

`ExtractNumberString` collects ASCII digits, the first dot and a sign accepted before any retained character, without guaranteeing a valid number.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `S` | `string` | Text to scan. |
| Result | `String` | Retained characters in source order, or `''`. No numeric conversion is performed. |

### Additional Technical Info
`ExtractNumberString` scans `S` and constructs a number-like string from selected ASCII characters. It retains every digit, the first dot, and one plus or minus sign only if no character has yet been retained. Everything else is discarded.

It does **not** guarantee that the result is syntactically valid or that it represents the intended number. The example is fictional and source-reviewed only.

**Retention rules**

1. Every ASCII digit is retained.
2. The first `'.'` is retained; later dots are discarded.
3. `'+'` or `'-'` is retained only while the output length is zero. Once retained, the sign itself makes the length non-zero, so no second sign is accepted.
4. All other characters, including commas and whitespace, are discarded without changing the sign eligibility unless a dot/digit/sign has already been retained.

This means the sign need not be the first input character: leading discarded text can precede it.

| Input | Result | Why it matters |
|---|---|---|
| `'USD -1,234.50'` | `'-1234.50'` | Common intended use. |
| `'12 and 34'` | `'1234'` | Separate groups silently join. |
| `'1.2.3'` | `'1.23'` | Later dots disappear rather than causing failure. |
| `'text.75-'` | `'.75'` | Dot counts as the first retained character, so later sign is ignored. |
| `'text-'` | `'-'` | A sign-only, non-numeric result is possible. |
| `'.'` | `'.'` | A dot-only, non-numeric result is possible. |

The decimal character is always a literal dot; locale-specific commas are discarded. Exponent notation is not supported (`'1e3'` becomes `'13'`). Parentheses do not imply a negative number. Non-ASCII digits are removed.

Before numeric conversion, verify that the result contains at least one digit and conforms to the exact accepted syntax. Apply domain/range checks after conversion. Use [`ExtractInteger`](ExtractInteger.md) only when every digit from all groups should be concatenated.

<small>Created 2026-07-15</small>
