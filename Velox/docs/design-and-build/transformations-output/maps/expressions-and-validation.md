---
title: "Map expressions and validation"
description: "Use Map view and field events, global script, Scriptlets and variables with explicit compile and result validation."
sidebar_position: 30
classification: public
status: approved
owner: Cam Hart
keywords: [Map expression, BeforeMap, OnMap, AfterMap, GlobalScript]
---

Direct field mappings should remain the default. Add script only where the transformation needs conditional, calculated or record-lifecycle behaviour.

## Script locations

Map items persist formulas for **On Start Map**, **Before Map**, **On Map**, **After Map**, **After Detail Map**, **Linked Data** and **On End Map**, plus a Map-level **Global Script**. Field and view items also retain compile status and editor position.

Execution creates/synchronises data sources, runs start/view/field events, maps primary keys, processes linked data and finishes end events. The exact available fields/locals depend on the event scope; do not copy an expression between scopes without recompiling and testing it.

## Rules

- Use **Help > Code Library** for the functions in the installed Velox version.
- Keep business rules deterministic and state their inputs, output type, null behaviour and failure result.
- Use [Scriptlets](../scriptlets.md) for genuinely shared code and [Variable Groups](../variables.md) for governed shared values.
- Do not place credentials in script text or ordinary variables.
- Validate text before constructing SQL, paths, commands or external requests.
- Treat a successful compile as syntax/type evidence, not as proof of business correctness.

## Test matrix

Compile every event, then test zero/one/many records, every conditional branch, null/empty values, minimum/maximum numbers/dates/text, master/detail repetitions, invalid input and a forced destination failure. Compare record counts and persisted output with the source contract. If a formula intentionally skips or changes a record, make that result visible in logs or reconciliation evidence.

See [scripting concepts](../../scripting-code-library/scripting-concepts.md) and [Map runtime](runtime-and-troubleshooting.md).
