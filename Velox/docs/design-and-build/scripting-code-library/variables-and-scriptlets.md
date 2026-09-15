---
title: "Configure variables and Scriptlets"
description: "Create reusable Variable Groups, variables and Scriptlets for verified scripting contexts"
sidebar_position: 25
slug: /scripting/variables-and-scriptlets
classification: public
status: approved
owner: Cam Hart
keywords:
  - "variables"
  - "variable-group"
  - "scriptlet"
---

Variable Groups hold named configuration values. Scriptlets hold reusable PascalScript code. Use them to avoid repeating values or functions across scripts while keeping their shared impact visible.

## Before you begin

You need permission to edit Velox configuration and a controlled Map, Flow or other owning module in which to test the result. Record the current configuration or use your organisation's normal export and change-control process before editing a shared item.

Do not use a variable as a general-purpose secret store. Obtain passwords, tokens and private keys through the credential mechanism approved for the integration.

## Create a Variable Group

1. Open the Variable Group setup area in Designer and create a group.
2. Enter a descriptive group name. Changing the name can change generated scripting references, so avoid renaming a group already in use.
3. Add a variable and enter its **Variable Code**, **Type**, **Value** and **Description**.
4. Use a code that begins with a letter and contains only supported identifier characters. Each code must be unique within the group.
5. Review the **Scripting Code** and **Tag Code** displayed by Designer. Copy or drag the generated expression instead of typing a reference from memory.
6. Save the group.

The scripting expression is type-aware. If you change a variable's type or code, review every script and template that consumes it.

## Use a variable in a script

1. Open the script from its owning module or field.
2. Find the Variable Group in the editor's configuration tree.
3. Drag the required variable into the editor. Designer inserts its generated scripting expression.
4. Use the value in the smallest practical expression or condition.
5. Select **Test Compile**, then test the owning module with sanitised data.

## Create and include a Scriptlet

1. Create a Scriptlet and enter a clear **Script Name**.
2. Add focused functions or procedures with stable names and parameters.
3. Select **Test Compile** and resolve every reported error.
4. Save the Scriptlet.
5. Open a script that will use it and drag the Scriptlet into the editor. Designer inserts its include directive at the top of the script.
6. Call the included function or procedure from the appropriate event.
7. Compile and test every affected owning context.

Do not type the include directive when Designer can generate it. This avoids errors caused by an incorrect Scriptlet name or placement.

## Verify the change

- Reopen the Variable Group or Scriptlet and confirm the saved values or code.
- Compile each consuming script.
- Run the smallest controlled test that exercises the changed reference.
- Inspect the result and logs without exposing credentials or complete business payloads.
- Test all known callers before promoting a shared change.

## Troubleshooting and recovery

| Symptom | Check | Action |
| --- | --- | --- |
| Variable code is rejected | The first character and identifier characters; duplicate codes in the group | Correct the code, then drag the regenerated expression into callers |
| Scriptlet compiles alone but a caller fails | Include placement, function signature and caller context | Remove the old include or call, drag the Scriptlet in again and compile |
| A value has the wrong behaviour | Variable type and selected configuration context | Restore the previous type/value, then retest callers |
| Several integrations fail after a change | Shared-variable or Scriptlet dependencies | Restore the recorded configuration and review all callers before retrying |

## Next steps

- [Write and test Velox scripts](editor-and-testing.md)
- [Review scripting concepts](scripting-concepts.md)
- [Work with Flow data](../flows/data/index.md)
- [Configure Variable Groups](../transformations-output/variables.md)
- [Configure Scriptlets](../transformations-output/scriptlets.md)
