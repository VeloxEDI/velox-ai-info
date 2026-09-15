---
title: "Comparison"
description: "Functions for testing values, text, numeric relationships, patterns and phonetic codes."
sidebar_position: 5
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - validation
  - text
  - numbers
---

### Description

The Comparison group contains predicates, ordering functions, lexical validators, pattern matching and Soundex helpers exposed to Velox scripts. The functions share a navigation group, but they do not share one definition of equality or validity. Select the function whose type, tolerance, case, locale and null rules match the business rule you are implementing.

**Choosing a comparison**

| Requirement | Appropriate family | Important boundary |
|---|---|---|
| Test whether a supported script value is present | [`Assigned`](Comparison/Assigned.md) | Compiler-special operation with a limited runtime type set; it is not Delphi's general `Assigned` routine. |
| Normalise a `Variant` to `Boolean` | [`CheckBoolean`](Comparison/CheckBoolean.md) | Uses Delphi Variant comparison and conversion rules and can raise on unsupported values. |
| Compare text without case sensitivity | [`CompareText`](Comparison/CompareText.md) | Returns ordering, not merely equality; its core overload uses ordinal ASCII case folding. |
| Search text or test its ending without case sensitivity | [`ContainsText`](Comparison/ContainsText.md), [`EndsText`](Comparison/EndsText.md) | Empty-substring behaviour and case implementation differ between the two routines. |
| Compare floating-point values | `CompareValue`, `IsZero`, `LessThanValue` and their `Epsilon` forms | These are tolerant comparisons. A result of equal or zero does not mean bit-for-bit identity. |
| Check the characters in numeric-looking text | `IsInteger`, `IsNumber`, `IsCurrencyNumber` | These are lexical checks, not parsing, range checks or locale-aware financial validation. |
| Test a `Variant` for absent/empty or zero-like content | `IsNullorEmpty`, `IsNullorZero` | The implementations have different branches and very different Null/coercion behaviour. |
| Store or inspect a Soundex code compactly | `SoundexInt`, `SoundexWord` and the corresponding decode functions | The encoded value is an implementation-specific representation, not the source word or a unique identifier. |

**Floating-point rules**

The numeric relationship helpers ultimately use Delphi `System.Math` with `Extended` operands. The forms without an `Epsilon` calculate a tolerance from the smaller operand magnitude and the platform's `Extended` resolution. The explicit forms use the supplied tolerance, except that an `Epsilon` of zero requests the same calculated default rather than exact equality. Boundaries are inclusive in the current implementation. `NaN`, infinity and negative tolerances have non-intuitive results and are documented on each callable page.

`Extended` is a wider 80-bit type in supported Win32 builds but aliases `Double` in current Win64 Delphi builds. A calculation close to the default tolerance can therefore classify differently after a platform change. Supply a positive, business-defined epsilon when the allowed difference is part of the integration contract.

**Text and lexical rules**

Text functions in this group are a mixture of Velox loops and Delphi RTL routines. Some use ordinal comparison, some call locale-aware case conversion, and some inspect only ASCII characters. Do not infer one function's Unicode, case or empty-text behaviour from another's name.

The three numeric-looking text helpers do not prove that text can be converted to an integer, floating value or currency. In particular, they do not enforce numeric range and some deliberately accept punctuation-only or repeated-symbol forms. Parse the value with the conversion routine required by the destination after the appropriate lexical and business validation.

**Variant rules**

`Null`, `Empty`, an empty string, numeric zero and `False` are distinct states. Direct Variant equality can invoke Delphi's global Null and coercion rules; a failed conversion can raise a Variant exception. Use explicit Variant predicates where deterministic state classification is required, and read the individual function's branches before using it as a general-purpose validation rule.

**Soundex rules**

Soundex represents pronunciation approximately and collisions are expected. The integer and word encodings are intended to be passed back to their matching decoder. They do not validate arbitrary integers, and the integer decoder contains an upstream short-code round-trip quirk described on its page.

**Side effects and concurrency**

The functions in this group operate on supplied values and do not intentionally mutate Velox configuration, datasets or external systems. Variant conversions and string operations can allocate memory and raise exceptions. The comparison routines do not maintain group-level shared state, although Delphi's process-wide Variant and locale settings can influence applicable operations.

**Related guidance**

- [`Testing values`](../ScriptingGuide/TestingValues.md) explains `Variant`, `Null`, `Empty`, Boolean and sentinel-value choices in Velox scripts.
- [`Functions`](../ScriptingGuide/Functions.md) explains how to read and call generated Code Library declarations.


<small>Created 2026-07-15</small>
