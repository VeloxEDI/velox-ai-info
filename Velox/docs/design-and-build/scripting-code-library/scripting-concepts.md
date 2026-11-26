---
title: "Velox Scripting concepts"
description: "Understand scripts, Scriptlets, variables, context objects and events"
sidebar_position: 20
slug: /scripting/scripting-concepts
classification: public
status: review-required
owner: Cam Hart
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
keywords:
  - "script"
  - "scriptlet"
  - "variables"
---

Velox Scripting extends configured integrations with PascalScript expressions and event code. Use scripts when a supported configuration option cannot express the required rule clearly; prefer ordinary configuration for straightforward mapping, routing and Flow behaviour.

## Where scripts are used

Scripts can appear in several Velox contexts, including Maps, custom Flow steps, file routing, Transports and Scriptlets. The objects and events available to a script depend on that context.

A script that compiles in one editor is not automatically valid in another context. Confirm which data, variables, runtime objects and events the owning module exposes.

## Script Editor

The Script Editor provides code editing, search and compile support. Open it from the module or field that owns the script so the editor can supply the appropriate context.

Compilation checks syntax and known declarations. It does not prove that sample data, database state, files, credentials, network services or every runtime branch will behave as expected. Test the owning Map, Flow or Transport in a controlled environment and inspect its result and logs.

## Variables and Variable Groups

Variables provide named values that configuration and scripts can reuse. Variable Groups organise those values and are reloaded when Velox changes configuration context or a runtime host loads configuration.

Treat variables as configuration, not as a safe place to publish secrets. Follow the approved credential mechanism for passwords, tokens and private keys. Check the selected test or production context before changing shared values.

## Scriptlets

A Scriptlet is a reusable script module. It can reduce repetition and provide one maintained implementation for shared logic. Reuse also increases impact: changing a Scriptlet can affect every module that includes or calls it.

Keep Scriptlets focused, name them by purpose and check module usage before changing their interface or behaviour. Test each affected calling context after a change.

## Context objects and events

Velox registers scripting objects, functions and event-specific data for supported contexts. These can expose Flow data, fields, variables, logging or module-specific operations.

Use the Code Library as the authority for available signatures in the installed version. The repository reference and the installed Code Library can differ, so verify important functions in the actual target installation before deployment.

Do not copy large sections of generated reference material into a script guide. Link to the [published Code Library](/code-library/ScriptingGuide), and explain only the workflow or decision needed by the reader.

## Script failures

Always use `LogError(...)` to report a script failure, then `Exit` to stop the current procedure. Do not generate raise statements or Delphi-style `Exception.Create` code, and do not substitute exception APIs, warnings, issues, duplicate status or cancellation for failure. A validation helper must propagate failure so the calling event also exits. Keep try..except for unexpected failures, log them as errors and stop; preserve cleanup explicitly because LogError neither throws, triggers except nor rolls back earlier database/file effects. Follow [mandatory script failure handling](../../../../instructions/scripts/failure-handling.md).

## Safe scripting practices

- Keep scripts small enough to review and test.
- Validate missing, empty, invalid and boundary values explicitly.
- Avoid logging credentials or complete business payloads.
- Treat database writes, file operations, commands and network calls as side effects that may be repeated during retry.
- Use fictional, sanitised examples.
- Test under the same execution host and Windows account that will run the integration.
- Review every caller after changing a shared variable or Scriptlet.

## Related tasks

- [Configure variables and Scriptlets](variables-and-scriptlets.md)
- [Write and test Velox scripts](editor-and-testing.md)
- [Configure Maps](../transformations-output/maps/index.md)
- [Configure Flow steps](../flows/steps/index.md)
- [Troubleshoot the Code Library](../../operate-and-troubleshoot/code-library-troubleshooting.md)
