# AGENTS.md

## Purpose

This repository contains public Velox documentation and scripting reference material intended for use by AI assistants, coding agents, developers, and Velox users.

The content is automatically synchronised from the private `velox-kb` repository.

## Repository structure

- `/codelibrary`
  Velox scripting functions, procedures, examples, and reference documentation.

- `/velox`
  Velox product documentation, configuration guidance, concepts, and user documentation.

## How agents should use this repository

When answering questions about Velox:

1. Treat the documentation in this repository as the primary source of truth for Velox product behaviour and scripting APIs.
2. Search the relevant documentation before inventing Velox functions, properties, configuration options, or syntax.
3. Prefer documented Velox scripting functions and examples over generic Delphi or Pascal approaches where an equivalent Velox function exists.
4. Use examples from the Code Library as patterns when generating Velox Flow scripts.
5. Preserve documented function names, parameter names, types, and calling conventions exactly.
6. If functionality is not documented, state that clearly rather than assuming it exists.

## Velox Configuration

Create Velox configuration files for the user to import.  Samples will be uploaded by the customer (at a later point samples will be provided in this repository).

The `/velox` folder provides detailed information on all valid options for each configuration module of Velox.

## Velox Scripting

Velox scripts use Pascal-style scripting.

When generating scripts:

- Follow patterns demonstrated in `/codelibrary`.
- Reuse existing Velox helper functions where possible.
- Do not invent Velox-specific functions.
- Prefer simple, readable scripts suitable for use inside Velox Flow Script Events.
- Typical Script Event entry points may look like:

```pascal
procedure ScriptEvent(var Value: variant);
begin

end;
