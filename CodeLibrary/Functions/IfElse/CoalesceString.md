---
title: "CoalesceString"
description: "Coalesces two typed strings by selecting the fallback only when the preferred string has zero characters."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - coalesce
  - string
  - empty
  - fallback
---

```Delphi
Function CoalesceString(const s1, s2: string): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  PreferredLabel: string;
begin
  PreferredLabel := '';
  Value := CoalesceString(PreferredLabel, 'Not supplied');
  // Not supplied
end;
```

### Usage

`CoalesceString` coalesces two typed strings by selecting the fallback only when the preferred string has zero characters.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `s1` | `string`, `const` | Preferred Unicode string. Exact length zero selects `s2`. |
| `s2` | `string`, `const` | Fallback Unicode string. |

Both argument expressions are evaluated before selection. A function used to construct `s2` runs even when `s1` is nonempty.

**Returns**

`s2` when `s1` is exactly empty; otherwise the original `s1`, including its case, whitespace and control characters.

**Errors**

The body performs only a string comparison and assignment. Errors can still arise while arguments are evaluated or converted, or from allocation failures. Velox does not catch them.

**Usage notes**

Use [`CoalesceEmpty`](CoalesceEmpty.md) when whitespace-only strings should select the fallback. Use [`IfNull`](IfNull.md) or an explicit Variant predicate when the input can genuinely be Null and its type must be retained.

### Additional Technical Info
`CoalesceString` returns `s2` only when `s1 = ''` exactly; otherwise it returns `s1` unchanged. It does not trim whitespace, handle Variant Null or validate the content.

The implementation is behaviorally identical to [`IfBlank`](IfBlank.md). The example is fictional, deterministic and source-reviewed and was not executed by the documentation workflow.

**Implementation**

The `uPSI_vxCommonString` import registers a direct pointer to `vxCommonString.CoalesceString`. Its entire selection is:

```Delphi
if s1 = '' then
  Result := s2
else
  Result := s1;
```

No Variant conversion, locale operation, allocation beyond normal string reference/result handling, or exception wrapper is added.

**Edge cases**

- `' '`, tabs, line breaks and other whitespace are nonempty and therefore returned unchanged.
- `'0'`, `'False'` and punctuation are ordinary nonempty strings.
- A typed `string` parameter cannot carry Variant Null. Passing a Variant requires PascalScript/Delphi to convert it before the function starts; Null or unsupported values can fail during that argument conversion.
- An empty `s2` is valid, so the result alone cannot reveal which branch was selected.
- The function does not distinguish an intentionally empty first value from missing business data.
- `s2` is eager rather than lazy; it cannot safely guard a failing expression.

**Side effects**

None in the function. Argument expressions may have their own side effects before the call.

**Performance and concurrency**

Constant-time empty-string check and reference-counted string assignment. No shared mutable state and no locale dependence.

**Related entries**

- [`IfBlank`](IfBlank.md) is a separate registered function with the same exact-empty behavior.
- [`CoalesceEmpty`](CoalesceEmpty.md) trims for its first-value blank test and accepts Variants.
- [`Coalesce`](Coalesce.md) selects only Variant Null and always returns text.
- [`IfThen`](IfThen.md) selects strings from an explicit Boolean condition.

<small>Created 2026-07-15</small>
