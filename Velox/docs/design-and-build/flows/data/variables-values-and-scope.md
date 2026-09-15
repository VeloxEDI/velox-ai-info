---
title: "Variables, values and scope in a Flow"
description: "Use Flow parameters, local values and Velox tags without leaking secrets or assuming values persist across executions."
sidebar_position: 40
classification: public
status: approved
owner: Cam Hart
keywords: [Flow variables, locals, parameters, tags, scope]
---

Velox resolves values from several scopes. Choose the narrowest suitable scope and document where each value originates; identical display text does not imply identical lifetime or persistence.

| Value source | Scope and lifetime | Typical use |
| --- | --- | --- |
| Definition criteria/parameters | Saved on a Flow data item; processed when the data opens | Database filters and reviewed runtime criteria |
| Flow locals | Current Flow execution; passed into a Sub Action | Intermediate values shared by scripts/steps in one call chain |
| Tags in a property | Evaluated by the consuming step at runtime | File names, command parameters, SQL/report output details |
| General Setup/system values | Environment-wide configuration | Default directories, notification settings and runtime identities |
| Request data | Current REST execution | Request fields mapped through the configured request Definition |
| File/record fields | Current opened data/record | Mapping, reporting and script logic |

## Design rules

- Use stable, descriptive names and state the expected type, nullability and format.
- Treat empty, missing, zero and null as different states unless the consumer explicitly equates them.
- Do not store credentials, tokens or private keys in ordinary Flow parameters, locals, script text or command arguments.
- Validate/tag-escape values before they enter SQL, command lines, file paths or remote requests. Runtime substitution is not automatic input sanitisation.
- A Sub Action inherits the parent's test flag and locals. A separately linked successor is a new successful-follow-on execution and must not be assumed to share every transient object.
- Values can be reset when the Flow object is returned to the pool. Do not rely on an in-memory value surviving into a later trigger.

## Verification

For each dynamic value, test an ordinary value, empty/missing value, boundary length, delimiter/quote characters, non-ASCII content and an invalid value. Inspect the actual SQL parameter, output file name/content or destination effect using sanitised data. Keep high-detail SQL/HTTP/file logging temporary because it can capture the evaluated values.

Use the installed **Help > Code Library** for the exact scripting functions available in the local Velox version. See [database data items](database-data-items.md), [file data items](file-data-items.md) and [REST invocation](../triggers/rest-invocation.md) for their context-specific rules.
