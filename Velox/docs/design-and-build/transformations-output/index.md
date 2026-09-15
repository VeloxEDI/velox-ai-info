---
title: "Transformations, output and reusable logic"
description: "Choose Maps, Reports, SQL Scripts, Scriptlets or Variable Groups for reusable Velox processing logic."
sidebar_position: 10
classification: public
status: approved
owner: Cam Hart
keywords: [Map, Report, SQL Script, Scriptlet, Variable Group]
---

Use this branch for reusable logic that consumes Definitions or is referenced by Flows and scripts.

| Module | Use it for | Runtime boundary |
| --- | --- | --- |
| [Map](maps/index.md) | Transform structured source records into destination records | A Flow Map step opens source/destination and executes the Map; destination persistence follows Definition/file behaviour. |
| [Report](reports/index.md) | Design ReportBuilder output over a Definition | A Report step renders to viewer, printer, file, email or REST response. |
| [SQL Script](sql-scripts.md) | Save a named interactive SQL workspace tied to a DB Connection | Saving does not schedule it; the Flow Custom SQL step owns separate SQL text. |
| [Scriptlet](scriptlets.md) | Share PascalScript include code | Loaded through a thread-safe global cache and referenced by script-aware modules. |
| [Variable Group](variables.md) | Share governed typed values | Loaded by group code into the variable cache and used by tags/scripts. |

Create and test the underlying [Definitions](../data-definitions/index.md) first. Use [Check Usage](../../administer-velox/modules-and-folders/index.md) before modifying shared script text, variable codes or Definition fields.
