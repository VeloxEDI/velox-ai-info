---
title: "Write and test Velox scripts"
description: "Use the Script Editor, compile checks and a safe runtime test workflow"
sidebar_position: 30
slug: /scripting/editor-and-testing
classification: public
status: approved
owner: Cam Hart
keywords:
  - "script-editor"
  - "compile"
  - "testing"
---

Use the Script Editor from the configuration item that owns the script. This supplies the available fields, variables, Scriptlets, Code Library entries and event context.

## Before you begin

You need permission to edit the owning Map, Flow, Transport or other configuration. Prepare fictional or sanitised test data and know which service, Windows account and external systems will be used during the runtime test.

If the script can write to a database, move files, send messages, run commands or call a network service, isolate those destinations before testing.

## Write and compile a script

1. Open the script or event from its owning configuration item.
2. Confirm the selected event and review the data or fields exposed by the editor.
3. Drag fields, variables, Scriptlets or Code Library entries into the editor where available. Use the generated code as the starting point for context-specific declarations and references.
4. Write the smallest rule that meets the requirement.
5. Select **Test Compile**.
6. Read the output and correct the first reported error before compiling again. Later errors can be consequences of an earlier one.
7. Save only after the compile check succeeds.

Scriptlets dragged into the editor are placed at the top as include directives. Variables are inserted as generated, type-aware expressions. Preserve that generated structure.

## Perform a controlled runtime test

1. Record the expected input, result and permitted side effects.
2. Select a non-production connection, folder, queue or endpoint where the owning module allows it.
3. Run the module using its normal test action, such as a Map test or controlled Flow run.
4. Inspect output values, files, database changes, messages and logs relevant to the scenario.
5. Test missing, empty, invalid and boundary inputs.
6. Repeat under the same execution host and account intended for operation when permissions or filesystem access matter.
7. Restore test destinations and remove test artefacts.

:::warning Compilation is not a dry run

**Test Compile** checks the script's syntax and known declarations. It does not execute every branch or validate external state. A runtime test can cause real side effects unless the owning configuration and destinations are isolated.

:::

## Verify the result

The change is ready for wider testing only when:

- the script compiles in its owning context;
- expected and invalid inputs have known results;
- permitted side effects occur once and at the intended destination;
- logs contain enough diagnostic context without secrets or full sensitive payloads; and
- all callers of a changed Scriptlet or variable have been retested.

## Troubleshooting

| Symptom | Check | Next action |
| --- | --- | --- |
| A declaration is unknown | Script context, Scriptlet include and installed Code Library | Reinsert the item from the editor tree and compile again |
| Compilation succeeds but runtime fails | Input types, external state, permissions and execution identity | Test the owning module with one controlled input and inspect its logs |
| A field or object is unavailable | The event or owning module from which the editor was opened | Move the rule to a supported event or use the object documented for that context |
| A test repeats an external action | Flow or Transport retry and test behaviour | Stop the test, reconcile the destination and review retry-safe design before rerunning |

## Next steps

- [Follow the worked examples](worked-examples.md)
- [Use the Velox Code Library](code-library.md)
- [Troubleshoot the Code Library](../../operate-and-troubleshoot/code-library-troubleshooting.md)
