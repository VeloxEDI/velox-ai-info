---
title: Scripting Guide
description: Technical guidance for writing, compiling and understanding scripts executed by Velox.
sidebar_position: 2
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - scripting-guide
  - pascal
---

Velox embeds a Pascal scripting engine and adds product-specific objects, functions, variables and event procedures. Use this guide to understand the language subset and the runtime context in which a script executes; use the other Code Library sections for the exact declarations and behaviour of individual entries.

## Start here

- **Scripting** explains the compilation model, supported source structure and execution context.
- **Events** identifies the procedure signatures that Velox calls and explains how their mutable parameters affect map processing.
- **Map processing flow** follows the current runtime from linked-data selection through record, field and detail processing.
- **Testing values** distinguishes `Null`, unassigned, empty strings, zero and Boolean values.
- **Datasets** explains record navigation, field access and the ownership of data objects supplied by Velox.

The Functions, Comments, Includes, Statements, Operators and Compilation errors topics cover the remaining language mechanics. Individual statement, operator and compiler-message pages provide the detailed reference beneath those landing pages.

## Important behaviour

The language is the subset implemented by Velox's current PascalScript compiler plus the types and routines explicitly registered by Velox. A construct being valid in a current Delphi compiler does not prove that it is valid in a Velox script. Likewise, two product contexts can register different module variables even though they use the same scripting language.

Scripts are compiled before their event delegate is used. Compilation verifies recognised event procedure signatures, resolves includes, imports the permitted runtime surface and binds context objects. Runtime errors and compiler diagnostics are reported through Velox logging; the precise handling depends on the host event and is documented on the relevant page.

## Safe working practice

- Start from the event template created by the Velox Designer and keep its required procedure name and parameter modes.
- Read the declaration on an entry page before calling it; overloads and defaults are limited to what Velox registers.
- Treat module, dataset and helper objects as context-owned unless an entry explicitly transfers ownership.
- Use explicit tests for `Null` and unassigned Variants before converting or comparing uncertain data.
- Treat functions that access files, databases, networks, mail or processes as side-effecting operations and follow their entry-specific failure rules.

## Related reference

- **Functions** — callable operations available to scripts.
- **Variables** — objects and values bound for the current execution context.
- **Classes** — methods and properties on script-visible objects.
- **Types** and **Constants** — declarations used by calls, fields and expressions.
