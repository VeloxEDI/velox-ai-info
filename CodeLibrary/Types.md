---
title: Types
description: Data types, enumerations, arrays, sets, records and references available in Velox scripts.
sidebar_position: 6
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - types
  - records
---

Types define the values that scripts can declare, pass to registered routines and read from object members. The tree separates Data Types, Enumerations, Arrays, Sets, Records and References because each category has different assignment and access rules.

## Common tasks

- Use **Data Types** for scalar and built-in-compatible values.
- Use **Enumerations** for one named value from a closed domain and **Sets** for combinations of enumeration values.
- Use **Arrays** for indexed collections and check their bounds before access.
- Use **Records** for structured values whose fields are documented under the record owner.
- Use **References** for aliases and reference-like types registered by the scripting compiler.

## Important behaviour

A type name is available only when the compiler registration for the current script context includes it. Assignment compatibility follows the embedded PascalScript compiler and can be narrower than current Delphi. Variant conversions occur at runtime and can raise conversion, range or null-operation errors.

Record fields are value members; object properties belong under Classes. Arrays and strings can have different indexing or ownership rules depending on the registered type. Aliases share an underlying representation but can still be useful because declarations require the registered public name.

## Edge cases and quirks

Do not assume a Delphi type's complete API or memory layout is exposed. The Code Library documents the registered scripting representation, its members and relevant conversion boundaries. Platform size, Unicode/ANSI behaviour, date precision and numeric overflow are stated on the applicable child page.

## Related groups

- **Constants** — named values typed by these declarations.
- **Functions** — parameters and results that use these types.
- **Classes** — reference-type objects with callable members.
