# AGENTS.md

## Purpose

This repository contains public Velox documentation and scripting reference material intended for use by AI assistants, coding agents, developers, and Velox users.

The content is automatically synchronised from the private `velox-kb` repository.

## Repository structure

- `/CodeLibrary`
  Velox scripting functions, procedures, examples, and reference documentation.

- `/Velox`
  Velox product documentation, configuration guidance, concepts, and user documentation.

- `/instructions`
  Maintained authoring rules, with a shared rule file and an `AGENTS.md` entry point for each configuration type. This tree is outside the folders replaced by the current documentation sync.

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

The `/Velox` folder provides detailed information on all valid options for each configuration module of Velox.

Before generating, editing or reviewing configuration, read [the instruction catalogue](instructions/README.md) and [shared rules](instructions/common.md). Identify every configuration type involved, then explicitly open and follow its `AGENTS.md` and linked standards. Do this even when output files are outside this repository; nested instruction files must not be assumed to load automatically.

For example, a Flow containing a Map action using DB Definitions/connections requires the Flow, action, Map, DB Definition and DB connection entry points. For Map field work, [instructions/maps/AGENTS.md](instructions/maps/AGENTS.md) requires [the field authoring standard](instructions/maps/field-authoring.md): intentionally unmapped fields have empty events and status `0`; meaningful events use status `1`. Report compilation/runtime testing separately from file inspection. Report unavailable instructions or conflicts rather than inventing rules.

Keep type-specific rules in their `instructions/<type>/` folder and shared rules in `instructions/common.md`. Maintain the catalogue when adding types or standards. Synced product documentation remains the source for product behaviour; these files define authoring conventions and their evidence limits.

## Velox Scripting

Velox scripts use Pascal-style scripting.

When generating scripts:

- Read [the scripts entry point](instructions/scripts/AGENTS.md) and its required [helper](instructions/scripts/helpers.md) and [event Value](instructions/scripts/event-value-context.md) standards, including for scripts embedded in Maps, actions and Scriptlets.
- Follow patterns demonstrated in `/CodeLibrary`.
- Use documented managed helpers such as `Json`, `JsonArray` and `List` instead of manually constructing/freeing their corresponding workspaces. Never free a helper.
- Do not append `Value := True` as a generic success footer. Identify the host: in File Router formulas it is a route predicate; preserve meaningful result handling in other contexts.
- Do not invent Velox-specific functions.
- Prefer simple, readable scripts suitable for use inside Velox Flow Script Events.
- Typical Script Event entry points may look like:

```pascal
procedure ScriptEvent(var Value: variant);
begin

end;
```
