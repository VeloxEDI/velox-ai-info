---
title: "GetOrderResponseStatusNum"
description: "Converts a Velox order-response status code to its canonical number."
sidebar_position: 25
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mapping
  - order-response-status
  - variant
---

```Delphi
Function GetOrderResponseStatusNum(const aOrderResponseStatusCode : string) : Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetOrderResponseStatusNum('Accepted'); // 1
end;
```

### Usage

`GetOrderResponseStatusNum` converts a Velox order-response status code to its canonical number.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aOrderResponseStatusCode` | `string`, `const` | Order-response status code. Comparison is case-insensitive but otherwise exact. |
| Result | `Variant` | Mapped integer in a `Variant`, or `Null` for an unrecognized code. |

**Complete mapping**

| Number | Code |
|---:|---|
| `1` | `Accepted` |
| `2` | `Rejected` |
| `3` | `Changed` |

**Behaviour and edge cases**

- Matching is ordinal and case-insensitive for these ASCII identifiers; letter case may vary.
- The function compares the whole input and does not trim. Leading/trailing whitespace, punctuation changes and inserted spaces prevent a match.
- Empty and unknown text return `Null`; numeric text is not parsed.
- Test `VarIsNull` before assigning the result to a non-nullable numeric destination.
- Identical numbers or labels used by another status/type family do not make the domains interchangeable. Use the function for the field's actual semantic family.

### Additional Technical Info
`GetOrderResponseStatusNum` converts a order-response status code to the corresponding Velox number. Its complete mapping is compiled into the product and is not read from customer configuration.

**Implementation**

The source compares the input with each literal using installed Delphi `SameText`, in table order. The first match returns its integer constant; the final `else` returns `Null`. It performs no database query or configurable alias lookup.

**Side effects, errors and performance**

For supported input the function is pure, performs no I/O and runs over a small fixed mapping. Ordinary unmatched string input returns `Null` rather than raising a domain-specific error.

**Related entries**

- [`GetOrderResponseStatusCode`](GetOrderResponseStatusCode.md) performs the reverse conversion.
- [Embarcadero: `System.SysUtils.SameText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.SameText)
- [Free Pascal: `SameText`](https://www.freepascal.org/docs-html/rtl/sysutils/sametext.html)

<small>Created 2026-07-15</small>
