---
title: "Configure Variable Groups"
description: "Create typed shared variables, group codes and encrypted values with cache and dependency controls."
sidebar_position: 50
classification: public
status: approved
owner: Cam Hart
keywords: [Variable Group, variable code, ParamType, encrypted variable, cache]
---

A Variable Group stores named child variables for use by tags and scripts. Shared codes are an API: changing a code or type can break consumers without changing their module reference.

## Properties

| Setting | Default | Effect |
| --- | --- | --- |
| **Variable Group name** | New Variable Group | Module identity. Non-default group code is derived from the configured prefix plus module name with spaces removed. Review the effective group code after rename. |
| **Variable code** | Empty | Unique code within the group used by runtime lookup. Duplicate codes are rejected by validation. |
| **Value** | Null | Persisted value returned through group/tag/script access. |
| **Item name** | Empty | Human-readable description/name for the variable. |
| **Operator** | `=` | Stored operator metadata used by applicable parameter/criteria contexts. |
| **Parameter type** | String | Delphi field type used to interpret/format the value. Test conversion, nulls, dates and locale-sensitive numbers. |
| **Encrypted** | Cleared | Marks the value for encrypted persistence/display handling. It remains sensitive configuration; restrict database/export/log access. |

Variable access and the global Variable Group cache are thread-safe. Save/delete invalidates cached group state and module relations record consumers. A running execution may have already evaluated a value, so changes are not a transactional broadcast to work already in progress.

Do not use ordinary variables for long-lived credentials when a dedicated credential/key-vault mechanism exists. Avoid embedding secrets in logs or examples. Use **Check Usage**, preserve the prior value/type, test each consumer and verify the runtime refresh boundary before production activation. See [variables and Scriptlets](../scripting-code-library/variables-and-scriptlets.md).
