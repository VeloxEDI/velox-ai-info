---
title: Configuration authoring instruction catalogue
description: Routes agents to shared rules and type-specific authoring instructions.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-11-16T23:15:15Z"
---

# Configuration authoring instructions

Before creating, editing or reviewing Velox configuration, read [common.md](common.md) and every type entry point relevant to the objects involved. Read type entry points explicitly even if generated output is saved elsewhere: nested `AGENTS.md` files are not necessarily discovered automatically.

For importable CFG output, also follow [CFG import packaging](cfg-packaging.md) and complete [the AI-generation checklist](common.md#ai-generation-checklist). These cross-type rules cover the template wrapper, primary module, identities, activation states and separate import/compilation checks.

| Configuration type | Entry point | Additional local standards |
| --- | --- | --- |
| Maps | [maps/AGENTS.md](maps/AGENTS.md) | [Field authoring](maps/field-authoring.md) |
| DB connections | [db-connections/AGENTS.md](db-connections/AGENTS.md) | No additional type-specific convention recorded yet |
| File connections | [file-connections/AGENTS.md](file-connections/AGENTS.md) | No additional type-specific convention recorded yet |
| DB Definitions | [db-definitions/AGENTS.md](db-definitions/AGENTS.md) | No additional type-specific convention recorded yet |
| File Definitions | [file-definitions/AGENTS.md](file-definitions/AGENTS.md) | No additional type-specific convention recorded yet |
| Flows | [flows/AGENTS.md](flows/AGENTS.md) | No additional type-specific convention recorded yet |
| Actions | [actions/AGENTS.md](actions/AGENTS.md) | No additional type-specific convention recorded yet |
| Transports | [transports/AGENTS.md](transports/AGENTS.md) | No additional type-specific convention recorded yet |
| Scripts and SQL scripts | [scripts/AGENTS.md](scripts/AGENTS.md) | [Failure handling](scripts/failure-handling.md); [compatibility](scripts/compatibility.md); [managed helpers](scripts/helpers.md); [event Value context](scripts/event-value-context.md) |
| Scriptlets | [scriptlets/AGENTS.md](scriptlets/AGENTS.md) | No additional type-specific convention recorded yet |
| Reports | [reports/AGENTS.md](reports/AGENTS.md) | No additional type-specific convention recorded yet |
| Variables | [variables/AGENTS.md](variables/AGENTS.md) | No additional type-specific convention recorded yet |
| APIs | [apis/AGENTS.md](apis/AGENTS.md) | No additional type-specific convention recorded yet |

For a Flow containing a Map action with database source/destination Definitions and connections, read the Flow, action, Map, DB Definition and DB connection entry points. Script changes also require the scripts entry point. Route other tasks according to their actual dependencies.

## Maintaining the framework

- Keep this tree in `velox-ai-info/instructions/`, outside the `Velox/docs/` and `CodeLibrary/` folders replaced by the current sync.
- Give each type its own folder and `AGENTS.md`. Store detailed standards in separately named files within that folder; link them from the entry point and this catalogue.
- Keep shared rules in `common.md`. Avoid copying substantive standards into several files.
- Use the metadata above for new entries. Record the real owner, updater and update date. Do not mark new guidance approved without review.
- Record `last_updated` as a quoted ISO 8601 UTC timestamp (`YYYY-MM-DDTHH:mm:ssZ`). Update it and `last_updated_by` whenever a file changes; retain the accountable `owner` unless ownership changes.
- Type entry points initially route to existing product documentation. They do not mean custom authoring conventions have been defined for every type.
- Each new standard states scope, required rules, exceptions, generic examples, validation, evidence and verification limits.

