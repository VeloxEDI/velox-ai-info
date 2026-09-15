---
title: "VarIsEmpty"
description: "Tests whether a Variant contains exactly the Empty or Unassigned state."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variant
  - empty
  - unassigned
---

```Delphi
function VarIsEmpty(const V: Variant): Boolean;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Candidate: Variant;
begin
  Candidate := Unassigned;
  Value := VarIsEmpty(Candidate); // True
end;
```

### Usage

`VarIsEmpty` tests whether a Variant contains exactly the Empty or Unassigned state.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `V` | `Variant` (`const`) | Value to inspect. Velox resolves nested Variant/by-reference Variant indirection for the predicate. |
| Result | `Boolean` | `True` only when the resolved stored type is `varEmpty`; otherwise `False`. |

### Additional Technical Info
`VarIsEmpty` returns `True` only when `V` contains the Variant Empty state represented by `varEmpty` and normally produced by `Unassigned` or an uninitialised Variant.

The example is fictional and source-reviewed only.

**Implementation and behaviour**

The modified PascalScript runtime registers `System.Variants.VarIsEmpty` directly. Delphi resolves the underlying Variant data and compares its type code with `varEmpty`; it does not convert or compare the value.

Consequently:

- `Null` is not Empty;
- `''`, zero and `False` are not Empty;
- a nil interface Variant is not Empty, even though [`VarIsClear`](VarIsClear.md) can regard it as clear;
- an allocated array with no meaningful business values is still not Empty; and
- a custom Variant's clear semantics are not consulted.

Use this predicate when the distinction between never-assigned and explicitly missing/Null is meaningful. Do not use it as a general blank-value test.

**Side effects, errors, performance and concurrency**

The routine performs a type inspection only. It has no side effects, I/O, allocation or locale dependency and is constant-time apart from following Variant indirection. Normal built-in values do not raise. Concurrent access is safe only while the same underlying Variant is not being changed by another execution context.

**Related entries**

- [`VarIsClear`](VarIsClear.md) also recognises nil interfaces and custom clear values.
- [`VarIsNull`](VarIsNull.md) recognises the explicit Null state.
- [`VarType`](VarType.md) returns the actual type code rather than a Boolean classification.

**External references**

- [Embarcadero DocWiki: `System.Variants.VarIsEmpty`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.VarIsEmpty)
- [Free Pascal: `Variants.VarIsEmpty`](https://www.freepascal.org/docs-html/rtl/variants/varisempty.html) - compatibility context for Empty/Unassigned testing.

<small>Created 2026-07-15</small>
