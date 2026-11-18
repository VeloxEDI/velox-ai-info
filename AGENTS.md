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

Before delivering importable CFG files, follow [CFG import packaging](instructions/cfg-packaging.md) and [the AI-generation checklist](instructions/common.md#ai-generation-checklist). Distinguish the `TvxConfigTemplate` wrapper from real modules; use its canonical sentinel and active state, put the primary requested module first, and do not interpret disabled Processes as a requirement to disable every supporting module. Preserve native class/property names. Report static checks, successful import and native Test Compile separately; authored `CompiledStatus` never proves compilation.

For Flow child-data references, follow [child-data binding guidance](instructions/flows/child-data-bindings.md) and run `node tools/check-cfg-bindings.mjs` on repository examples and `--root` for generated CFG output. Prefer unique native-style child component names with the verified native ownership layout. Action Source/Dest are unquoted references to actual Flow children, not Definition names or module FIDS. Verify Map, Transport and Custom Script bindings and expected classes. Reopen the imported Flow to confirm populated selections persist; report static, native import, compilation and execution results separately. The observed naming/binding correction was combined, not an independently proven universal naming requirement.

For example, a Flow containing a Map action using DB Definitions/connections requires the Flow, action, Map, DB Definition and DB connection entry points. For Map field work, [instructions/maps/AGENTS.md](instructions/maps/AGENTS.md) requires [the field authoring standard](instructions/maps/field-authoring.md): intentionally unmapped fields have empty events and status `0`; meaningful events use status `1`. Report compilation/runtime testing separately from file inspection. Report unavailable instructions or conflicts rather than inventing rules.

Keep type-specific rules in their `instructions/<type>/` folder and shared rules in `instructions/common.md`. Maintain the catalogue when adding types or standards. Synced product documentation remains the source for product behaviour; these files define authoring conventions and their evidence limits.

## Velox Scripting

Velox scripts use Pascal-style scripting.

When generating scripts:

- Read [the scripts entry point](instructions/scripts/AGENTS.md) and its required [helper](instructions/scripts/helpers.md) and [event Value](instructions/scripts/event-value-context.md) standards, including for scripts embedded in Maps, actions and Scriptlets.
- Read [scripting compatibility](instructions/scripts/compatibility.md). Use explicit comparisons instead of inline character-set/range membership such as `lTag[k] in ['A'..'Z', '/']`. Do not infer support from valid Delphi syntax or extrapolate this restriction to all sets or all uses of `in`. Extraction/static checks are not actual Velox compilation.
- Follow [mandatory script failure handling](instructions/scripts/failure-handling.md): always report a script failure with `LogError` and stop with `Exit`; helpers must propagate failure to the event. Do not generate raise/rethrow statements, `Exception.Create` or exception APIs as substitutes. Preserve explicit cleanup and supported unexpected-failure handlers. Run `node tools/check-script-failures.mjs` on this repository and `--root` for generated output; this static check is not Velox compilation.
- Follow recommended patterns in `/CodeLibrary`; clearly marked invalid, exception API reference-only and native Delphi examples are not generated-script templates.
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
