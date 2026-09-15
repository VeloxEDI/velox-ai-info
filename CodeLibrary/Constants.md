---
title: Constants
description: Named fixed values registered for use in Velox scripting expressions and calls.
sidebar_position: 7
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - constants
  - values
---

Constants are fixed named values available to the scripting compiler. They include date/time values, enumeration-style codes, file and stream modes, Variant type codes and Velox-specific identifiers.

## Common tasks

- Use **Date & Time** constants with date calculations and formatting routines.
- Use **Enumeration** and **Velox** constants when an API expects a named mode or product state.
- Use **File** and **Stream** constants to select an explicitly documented access or positioning mode.
- Use **Variant** and **Variant Types** to interpret or construct Variant values without using unexplained numeric literals.

## Important behaviour

The declaration or value on a child page is the registered scripting value. Its semantic meaning is established from the source registration and consumers; a familiar Delphi name alone is not sufficient evidence. Some constants are direct Delphi values, while others are Velox-specific aliases or snapshots created during compiler setup.

Constants cannot be assigned. A group can share a value model, but each physical page documents its own literal, aliases, valid consumers and any counter-intuitive numbering. Bit flags must be combined only when the underlying API accepts a set or mask.

## Edge cases and quirks

Numeric values can vary between unrelated enumerations even when labels look similar. Version- or platform-dependent upstream values are identified on the child page. Prefer the named constant to a hard-coded literal so the script states intent and remains aligned with the registered runtime.

## Related groups

- **Types > Enumerations** and **Types > Sets** — domains represented by named values.
- **Functions** and **Classes** — calls and properties that consume constants.
