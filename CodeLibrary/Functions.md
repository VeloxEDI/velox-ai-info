---
title: Functions
description: Reference groups for callable operations exposed to Velox scripts.
sidebar_position: 3
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - functions
  - procedures
---

This section contains the functions and procedures registered with the Velox scripting compiler. Entries include Velox operations, thin adapters around Delphi routines and functions imported from shipped libraries.

## Common tasks

- Use **Conversion**, **Date & Time**, **Format**, **Numeric** and **String** for value transformations.
- Use **Data** and **Velox** for operations tied to the current integration and its data context.
- Use **File**, **Email**, **HTTP-related classes**, **Program Control** and similar effectful groups only after reviewing their side effects and failure behaviour.
- Use **Comparison** and **If..Else** when source values may be `Null`, empty or represented by a Variant.

## Important behaviour

The declaration on each child page is the exact scripting surface, not a promise that every Delphi overload is available. Parameter modes matter: `const` values are inputs, while `var` and `out` parameters can change a caller-owned variable. Functions return a value; procedures normally communicate through side effects or mutable parameters.

An entry can be a wrapper. Its documentation follows that wrapper through helpers and delegated calls to the terminal implementation, including parameter transformations, exceptions, platform behaviour and implementation quirks. Do not infer safety or purity from a name: entries can perform database work, allocate objects, write files, make network calls or update shared Velox state.

## Edge cases and quirks

Only registered declarations are callable. A function available to Delphi code—or a different overload of the same name—can still be unavailable to a script. Variant coercion, locale-sensitive conversion, path handling and exception propagation are entry-specific and are documented on the physical child page.

## Related groups

- **Scripting Guide > Functions** — how to read and call registered declarations.
- **Types** — parameter and return types used by functions.
- **Classes** — methods called through an object rather than as global routines.
