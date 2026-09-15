---
title: "Sets"
description: "Functions that mutate PascalScript set membership through the modified runtime's byte-encoded bit operations."
sidebar_position: 22
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - sets
  - include
  - exclude
  - mutation
---

The Sets group exposes [`Include`](Sets/Include.md) and [`Exclude`](Sets/Exclude.md). Both mutate an existing PascalScript set variable by setting or clearing the bit associated with one member ordinal.

## Effective call contract

The generated declarations do not show the two arguments that the compiler injects. In script, the effective pattern is:

```Delphi
Include(Options, loCaseInsensitive);
Exclude(Options, loCaseInsensitive);
```

The first argument must be writable set storage; an expression or temporary value cannot receive the mutation. The second must have the compatible byte-sized member representation described on the child page.

## Important type boundary

The implementation is a modified PascalScript runtime primitive, not a call to an independent Delphi `Include`/`Exclude` function. It loads set storage and derives a bit position from the encoded member byte. This works for the documented supported enum-like member types but does not make arbitrary integers, casts or unrelated enumerations safe.

Character-set use has a specific compatibility limitation: a normal script `Char` follows the Unicode character path and is not accepted by this byte-member operation. Use a set expression or another documented character-set construction instead of forcing a cast.

## Critical safety boundary

The runtime does not perform a complete set-allocation bounds check before writing the selected bit. An excessive ordinal from an unrelated or invalid value can write outside the set's storage and corrupt runtime memory. Never bypass compile-time type compatibility and never use external numeric data as a set member through a cast.

For valid compatible members, inclusion/exclusion is idempotent: including an existing member or excluding an absent member leaves the same set value. Mutation is execution-local only when the set variable itself is local; shared/global mutation still requires normal concurrency discipline.
