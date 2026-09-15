---
title: JSON
description: Source-backed guidance for constructing, owning, inspecting, parsing and serializing Velox JSON trees safely.
sidebar_position: 7
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, classes, json, parsing, serialization, ownership]
---

The JSON branch is Velox's mutable in-memory JSON tree API. Use [`TJSONObject`](JSON/TJSONObject.md) for name/value documents, [`TJSONArray`](JSON/TJSONArray.md) for ordered values and the shared [`TJSONValue`](JSON/TJSONValue.md) surface when code must inspect values whose concrete type is not known in advance.

This API is implemented by the shipped Deltics JSON library and exposed through a PascalScript importer. Its behavior is not identical to Delphi's newer JSON classes, and several importer and serializer defects are part of the current Velox contract. Follow the class and member pages in this branch rather than assuming behavior from a similarly named API.

## Class model

The visible value classes have three roles:

- scalar nodes: [`TJSONBoolean`](JSON/TJSONBoolean.md), [`TJSONDouble`](JSON/TJSONDouble.md), [`TJSONInteger`](JSON/TJSONInteger.md), [`TJSONNull`](JSON/TJSONNull.md) and [`TJSONString`](JSON/TJSONString.md);
- the shared object/array ancestor [`TJSONText`](JSON/TJSONText.md), which provides named adders, generic parsing, file/stream output and formatted text; and
- the concrete containers `TJSONArray` and `TJSONObject`, which own ordered lists of child nodes and provide their type-specific access and mutation operations.

`TJSONValue` provides `Name`, `ValueType`, null state, conversions, checked container views, copy/clone and equality. Use `ValueType` and `IsNull` before requesting a type-specific view or strict conversion. `AsArray`, `AsObject` and `AsText` are checked casts of the same object; they do not convert or clone it and raise `EInvalidCast` for the wrong runtime class.

The native numeric classes descend through hidden `TJSONNumber`, but the PascalScript compiler importer incorrectly places that ancestor beneath `TObject`. A `TJSONDouble`- or `TJSONInteger`-typed expression can therefore lose the common `TJSONValue` surface even though the native object has it. Prefer nodes returned through a container's generic `TJSONValue` accessors when generic conversions, `Name`, `ValueType` or null checks are required.

## Ownership and lifetime

A root created directly or returned by a parsing factory is caller-owned and must be freed in a `finally` block. A container owns every child appended to it and recursively frees those nodes when they are deleted, erased, replaced or destroyed. Values returned by `Items`, `Values`, `ValueByIndex`, `FindValue`, add methods and checked views are borrowed references; never free them separately.

`AddText` is a cloning operation, not ownership transfer. The source remains under its existing owner and the destination owns a new deep copy. `Clone` similarly returns a separate caller-owned root. Allocation or recursive copy failure is not transactional and can leak or leave a partially changed target on documented paths.

Any operation that deletes, erases, loads, replaces or frees a parent can invalidate all retained references into that subtree. Reacquire children after mutation, and do not cache JSON objects between script executions or share them between threads. The implementation is mutable and not thread-safe.

## Null and empty values

Normal scalar nodes store a null flag separately from their retained payload. Marking a scalar null does not erase its previous value; reading `AsString` returns blank while null, and clearing the flag can reveal the retained payload again. `TJSONNull` is permanently null.

Objects and arrays are different: native `TJSONText.IsNull` always returns false and native `NotNull` always returns true. Assigning `IsNull=True` changes only an inherited private bit that the virtual getter and serializers ignore. The Velox runtime also misregisters script `NotNull` against the `IsNull` reader, so scripts see false from both properties on containers. Use `not Container.IsNull` when a positive non-null predicate is needed; do not use `Container.NotNull`.

The methods named `AddNull` do not create `TJSONNull`; they create a null-marked `TJSONString`. Objects serialize that child as `null`. Compact array output examines String type first and emits `""`, while formatted array output tests null first and emits `null`. Zero DateTime and all-zero GUID helper values use the same null-marked String representation. Choose and verify the intended external representation explicitly.

An empty array serializes as `[]` in compact form and `[ ]` in display form. An empty object has a current compact serializer defect: it emits `}` instead of `{}`. When placed in an array it can therefore produce invalid text such as `[}]`. Add at least one field or handle empty objects at a standards-compliant boundary.

## Object lookup and mutation

`TJSONObject` preserves insertion order and permits duplicate field names. Name lookup is case-insensitive and returns the first physical match, so a later duplicate does not override an earlier value even though both are serialized.

The default `Values[name]` property mutates the object on a miss by adding an owned null-marked String under the requested spelling. Use `FindValue` or `Contains` for an observational lookup. Check both assignment and `IsNull` when absence and explicit null have different meanings, then check `ValueType` before a checked view or strict numeric/date/GUID conversion.

Deletion immediately frees the selected owned node. Indexed deletions shift every later position. Combine operations append deep clones rather than replacing matching names, and allocation failure can leave a partially combined target. Treat mutation as non-transactional unless the calling script constructs and validates a separate replacement tree first.

## Parsing boundaries

The stream reader recognises supported byte-order marks and otherwise assumes UTF-8. Generic parsing reads the first value and can ignore trailing content; always validate that the expected root and complete application-level input were supplied. The array parser accepts several malformed delimiter/closing forms that strict JSON rejects.

Current Unicode decoding has material defects. `\uXXXX` escapes are not decoded into their intended characters, UTF-8 continuation bytes are not fully validated, supplementary UTF-8/UTF-16 arithmetic is wrong, and decoded non-BMP values are reduced to one 16-bit `Char`. Do not depend on lossless supplementary-plane or escaped-Unicode round trips.

Number parsing and output use process locale-sensitive Delphi conversion. Exponent notation is routed incorrectly by the reader, Double output is limited to Delphi's default 15 significant digits and non-finite values can produce tokens that JSON does not permit. When exact decimals, canonical signatures or cross-locale interchange matter, validate and normalize at a reviewed boundary outside this API.

Loading behavior depends on the selected compile-time class and method. Some loaders parse before replacing existing children; the shared ancestor stream loader erases first and has unsafe opposite-container/scalar paths. The generic `TJSONText` factories are native class functions but are registered as instance methods, so scripts require an existing non-nil receiver that the function ignores while returning a separate caller-owned result. Prefer the exact concrete class member documented for the required root.

## Serialization boundaries

Compact output is returned by inherited `AsString`; formatted output is returned by `AsDisplayText`. Both materialize the complete tree in memory. Saving converts the complete String to UTF-8 without a BOM. Stream saving writes at the current position without truncating an old tail and ignores short writes; file saving truncates/replaces non-atomically.

Field names are inserted between quotes without escaping. String values escape quote, backslash and five named control characters, but other U+0000-U+001F controls can remain raw. Duplicate fields and insertion order are preserved. Compact and formatted output are presentation choices, not validation or canonicalization steps, and can differ semantically for null-marked array Strings.

Before sending JSON to a strict API, signature process or security-sensitive consumer, validate the final bytes with a standards-compliant component. Apply trusted size and nesting limits before parsing untrusted input or recursively formatting/cloning a tree; these operations allocate the complete graph or result and deep nesting consumes call stack.

## Recommended script pattern

1. Construct the exact `TJSONObject` or `TJSONArray` root and protect a caller-owned root with `try/finally`.
2. Use typed add methods for new values; treat returned child references as borrowed.
3. Use `FindValue`/`Contains` for non-mutating object lookup, then test assignment, `IsNull` and `ValueType` before conversion.
4. Reacquire child references after any parent mutation or load.
5. Inspect and validate the final compact representation when it will cross a system boundary; use display text only for reviewed human-readable output.
6. Free only caller-owned roots and clones, never parent-owned children.

## External references

- [RFC 8259: The JavaScript Object Notation data interchange format](https://www.rfc-editor.org/rfc/rfc8259)
- [Embarcadero `TObjectList.OwnsObjects`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Contnrs.TObjectList.OwnsObjects)
- [Embarcadero `TEncoding.UTF8`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.TEncoding.UTF8)
- [Free Pascal `TObjectList.OwnsObjects`](https://www.freepascal.org/docs-html/fcl/contnrs/tobjectlist.ownsobjects.html) - compatible ownership context; Velox executes the traced Delphi/Deltics implementation.
