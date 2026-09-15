---
title: "Variant"
description: "Functions for Variant arrays, explicit conversions, missing-value tests and run-time type inspection."
sidebar_position: 24
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - variant
  - conversion
  - arrays
  - 'null'
---

The Variant group contains operations for values whose type is determined at run time. Use these entries to create and access one-dimensional Variant arrays, explicitly convert a Variant, distinguish `Unassigned` from `Null`, and inspect the stored Variant type code.

## Choosing an entry

- Use [`VarArrayCreate`](Variant/VarArrayCreate.md), [`VarArrayGet`](Variant/VarArrayGet.md) and [`VarArraySet`](Variant/VarArraySet.md) together for the zero-based, one-dimensional arrays exposed by this group.
- Use [`VarAsType`](Variant/VarAsType.md) when a downstream operation requires a specific Variant type. Conversion is not validation: it can be locale-dependent, lossy or exception-raising.
- Use [`VarIsEmpty`](Variant/VarIsEmpty.md) for exactly `Unassigned`, [`VarIsNull`](Variant/VarIsNull.md) for exactly `Null`, or [`VarIsClear`](Variant/VarIsClear.md) when nil interfaces and custom clear states should also count.
- Use the `VarTo...` entries for date/time or string conversion, and [`VarType`](Variant/VarType.md) when code must branch on the actual stored type and flags.

## Missing-value states are different

`Unassigned`/`varEmpty`, `Null`/`varNull`, empty text, numeric zero and Boolean false are distinct values. The predicates do not coerce before testing. In particular, a Null database-style value is not Empty, and a zero-length string is neither Empty nor Null.

The `Def` string functions apply their fallback only to Null. They do not catch conversion exceptions and do not substitute for Empty. This makes the choice of predicate or converter part of the data contract rather than a formatting detail.

## Type codes, conversion and arrays

Variant type codes are `Word` values. A base code such as `varInteger`, `varDate`, `varOleStr` or `varVariant` can be combined with flags such as `varArray` and `varByRef`. `VarType` returns the raw code, including flags; mask it deliberately when only the base type is relevant.

The array constructor in Velox accepts a length rather than Delphi's bounds array and always requests bounds `0..aLength - 1`. The public get/set wrappers accept one index, so they cannot operate on a multidimensional Variant array. Fixed-element arrays coerce assigned values to their element type, whereas a `varVariant` array can hold mixed Variant values.

Variant conversion uses the current Delphi run-time rules. Numeric range, incompatible types, Null policy, host locale, date formats and process-wide Variant formatting settings can affect the result. Keep conversions near a clear input boundary and handle the documented exceptions instead of assuming that every Variant has a useful textual or numeric representation.

## External references

- [Embarcadero DocWiki: `System.Variants`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants)
- [Free Pascal: `Variants` unit](https://www.freepascal.org/docs-html/rtl/variants/index.html) - compatibility context; Velox runs the Delphi RTL and its modified PascalScript adapters.
