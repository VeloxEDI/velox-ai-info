---
title: Sets
description: Select and safely combine the five fixed membership and flag-set types exposed to Velox scripts.
sidebar_position: 4
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, sets, flags, membership, operators]
---

## Select a set type

A set holds zero or more members from one ordinal element type. Unlike an array, a set has no ordering, duplicates or numeric indexes.

| Type | Element domain | Primary use | Important boundary |
|---|---|---|---|
| [`TComponentState`](Sets/TComponentState.md) | Eleven component lifecycle/design flags | Inspect inherited component state | Read-only snapshot controlled by the component framework. |
| [`TIdMessageFlagsSet`](Sets/TIdMessageFlagsSet.md) | [`TIdMessageFlags`](Enumerations/TIdMessageFlags.md) | IMAP/message state | Local replacement is not an atomic mailbox update. |
| [`TLocateOptions`](Sets/TLocateOptions.md) | [`TLocateOption`](Enumerations/TLocateOption.md) | Dataset Locate matching options | Provider behavior varies and success moves the cursor. |
| [`TvxChars`](Sets/TvxChars.md) | 8-bit [`Char`](DataTypes/Char.md) values | Allowed/removed character membership | Cannot represent arbitrary Unicode characters. |
| [`TvxSeparators`](Sets/TvxSeparators.md) | 8-bit [`Char`](DataTypes/Char.md) values | Token separator membership | Each member is an independent one-character separator. |

## Set syntax and operators

```Delphi
Flags := [mfSeen, mfAnswered];

if mfSeen in Flags then
  Exclude(Flags, mfSeen);

Flags := Flags + [mfFlagged]; // union
Flags := Flags - [mfDeleted]; // difference
Flags := Flags * [mfSeen, mfFlagged]; // intersection
```

The modified PascalScript compiler/runtime supports:

- `[]` for the empty set and `[A, B]` for a set constructor;
- `Element in Value` for membership;
- `Include(Value, Element)` and `Exclude(Value, Element)` for in-place mutation;
- `+`, `-` and `*` for union, difference and intersection;
- `=`, `<>`, `<=` and `>=` for equality and subset/superset comparisons.

Both operands of a set operation must be the same set type. Set assignment copies the fixed bit field; it does not share backing storage like a dynamic array. Use named members rather than persisting the internal bit pattern, because ordinal changes at the element-type boundary change that representation.

## Boundary rules

- A set member's ordinal must fit the type's registered range. The current public types use no more than 256 possible ordinals.
- `const` set parameters prevent reassignment through that parameter; `var` parameters and writable properties can replace the caller's complete set.
- Test flags individually when semantics are independent. Equality with a one-member constructor rejects any additional flags.
- An empty set means no selected flags/options; it is not Null and carries no unknown state by itself.
- Character sets are limited to the 8-bit public `Char` domain even though the current script `String` is Unicode.

**External references**

- [Embarcadero structured types](https://docwiki.embarcadero.com/RADStudio/Athens/en/Structured_Types_%28Delphi%29) - Delphi set declarations, constructors and membership.
- [Free Pascal set types](https://www.freepascal.org/docs-html/ref/refsu16.html) - compatible ordinal-domain and 256-member limits.
- [Free Pascal set operators](https://www.freepascal.org/docs-html/ref/refsu49.html) - compatible membership, mutation and combination operators.

<small>Created 2026-07-15</small>
