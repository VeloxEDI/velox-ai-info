---
title: "Configure a Custom Script step"
description: "Configure, compile and safely execute Flow-scoped Velox script items against selected source data."
sidebar_position: 50
classification: public
status: approved
owner: Cam Hart
keywords: [Custom Script step, Velox Scripting, compile status, Flow script]
---

A Custom Script step opens selected source data and executes its child script item. It is suitable for Flow-local logic that cannot be expressed by existing modules, but it must not become an undocumented replacement for a reusable Map or governed module.

| Setting | Default | Effect |
| --- | --- | --- |
| **Source Data** | None | Definition-backed context exposed to the script. Missing source data prevents normal execution. |
| **Script item name** / `ItemName` | New Script Item | Display/log identity. |
| **Formula** | Empty until a template is created | Velox script text compiled/executed at runtime. |
| **Compiled status** | `0` | Internal compile state; code sets success/error states and checks can return additional codes. Use the Designer's displayed compile result rather than hard-coding numeric meanings. |
| **Ignore empty source data** | Cleared | Allows the step's empty-source path only when explicitly valid. |

## Procedure

1. Select the narrowest source data item and create/edit the script.
2. Use **Help > Code Library** for the exact functions in the installed Velox version.
3. Compile until the Designer reports success; then save, reopen and compile again.
4. Test valid, empty, null, boundary and deliberately rejected data.
5. Make failures explicit and inspect the log status/message.

Script exceptions and user-failed results are logged and stop normal processing. A script can also call database, filesystem, process or network functions with the runtime account's privileges; Test Run does not automatically neutralise those calls. Do not place secrets in source or logs, do not construct SQL/commands from untrusted text without appropriate parameterisation/validation, and document every external side effect. See [scripting concepts](../../scripting-code-library/scripting-concepts.md) and [retry/failure semantics](../runtime/retry-failure-and-cancellation.md).
