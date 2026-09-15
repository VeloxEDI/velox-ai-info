---
title: "IfThen"
description: "Returns one of two already-evaluated strings according to a Boolean condition."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - ifthen
  - boolean
  - conditional
  - string
  - strutils
---

```Delphi
Function IfThen(AValue: Boolean; const ATrue: string; AFalse: string): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  IsPriority: Boolean;
begin
  IsPriority := True;
  Value := IfThen(IsPriority, 'Priority', 'Standard');
  // Priority
end;
```

### Usage

`IfThen` returns one of two already-evaluated strings according to a Boolean condition.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `Boolean` | Explicit condition controlling which string is returned. |
| `ATrue` | `string`, `const` | Result when `AValue` is true. |
| `AFalse` | `string` | Result when `AValue` is false. Required by the Velox script declaration. |

Supply all three arguments in scripts.

**Returns**

Exactly `ATrue` or `AFalse`; the selected string is not trimmed, formatted or converted further by the function.

**Errors**

Argument evaluation, Boolean/string conversion and allocation errors propagate. The unselected expression can raise and prevent the call.

**Usage notes**

Prefer an `if ... then ... else` statement for control flow and `IfThen` for concise selection between safe, already computed strings. Always pass `AFalse` in Velox scripts.

### Additional Technical Info
`IfThen` returns `ATrue` when `AValue` is true and `AFalse` otherwise. Velox exposes the string overload from installed Delphi `System.StrUtils`; it is a function call, not the Pascal `if` statement.

Both string arguments are evaluated before the function chooses one. The example is fictional, deterministic and source-reviewed and was not executed by the documentation workflow.

**Implementation**

`uPSI_StrUtils` registers the compile declaration and runtime pointer to `System.StrUtils.IfThen`. Installed Studio 37.0 source performs one Boolean branch and one string assignment:

```Delphi
if AValue then
  Result := ATrue
else
  Result := AFalse;
```

Velox adds no wrapper, validation, logging or exception handling.

**Eager evaluation is the central constraint**

Function arguments are evaluated before entry. This differs from a language `if` statement:

```Delphi
// Both BuildPriorityText and BuildStandardText run before IfThen chooses.
Value := IfThen(IsPriority, BuildPriorityText(), BuildStandardText());
```

Use a real `if ... then ... else` statement when a branch is costly, changes state, can raise, reads a dataset cursor or must not execute. `IfThen` is appropriate for already available strings and simple side-effect-free expressions.

**Condition and type behavior**

- `AValue` is statically Boolean. Numeric/text values must satisfy PascalScript's argument conversion before the function starts; `IfThen` itself does not interpret truthy/falsy business values.
- Both possible results are statically strings. Variant Null, records and objects are not accepted as branch values without a prior conversion.
- Empty strings, whitespace and identical branch strings are all valid.
- The function reports no branch indicator besides the returned value.
- It selects strings only; other native `IfThen` overloads are not registered under this Code Library entry.

**Side effects**

None in the installed function. Side effects in `AValue`, `ATrue` or `AFalse` expressions happen before entry, including effects in the branch not selected.

**Performance and concurrency**

One Boolean branch and normal reference-counted string assignment after argument evaluation. No shared mutable state, locale dependency or locking.

**Related entries**

- [`IfBlank`](IfBlank.md) selects a fallback using exact empty-string state.
- [`IfNull`](IfNull.md) selects between Variants using Null equality.
- [`CoalesceString`](CoalesceString.md) selects between strings using exact empty first text.

**External references**

- [Embarcadero `System.StrUtils.IfThen`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StrUtils.IfThen) - documents the installed terminal and native default argument.
- [Free Pascal `StrUtils.IfThen`](https://www.freepascal.org/docs-html/rtl/strutils/ifthen.html) - documents a compatible string overload; Velox uses installed Delphi.

<small>Created 2026-07-15</small>
