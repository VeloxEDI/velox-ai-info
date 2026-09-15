---
title: "Data Definition concepts"
description: "Understand structured views, parameters and Flow data"
sidebar_position: 20
slug: /data/definition-concepts
classification: public
status: approved
owner: Cam Hart
keywords:
  - "data-definition"
  - "parameters"
  - "schema"
---

A Data Definition gives Velox a structured view of data. It identifies fields and their shape, uses a Data Connection for access, and can expose parameters or criteria that a Flow supplies at runtime.

## Why Definitions matter

Connections answer “where is the data?” Definitions answer “what does the data look like and how should Velox access it?” Maps, Reports, scripts and Flow data items can then work with a consistent definition-backed view instead of embedding access and format rules in every task.

## DB Definitions

A DB Definition uses a DB Connection and describes database-backed data. Its configuration can include fields, query or table behaviour, criteria, parameters and save behaviour.

Database behaviour depends on the selected technology, permissions and SQL dialect. Verify queries and writes against a safe test database. Do not assume that a query valid for one database type is portable to another.

## File Definitions

A File Definition uses a File Connection and describes a supported file structure. Confirmed definition types include:

- delimited or positional flat text, including CSV-style data;
- XML;
- JSON;
- EDI; and
- Excel workbooks.

Each format has its own settings and constraints. Representative sample files help verify field order, delimiters, namespaces, repeating structures, encodings and other format-specific decisions. A filename extension alone does not prove that the content matches a Definition.

## Fields and parameters

Fields form the structured data view used by mapping, reporting and scripting. Keep names and types aligned with the source or destination contract. A mismatch can cause parsing, conversion, validation or save failures.

Parameters provide values at runtime, for example to constrain a database query or pass context into definition-backed processing. Their value can come from Flow configuration, local runtime context or another configured source. Treat missing, empty and invalid values as distinct cases when testing.

## Relationship to Flow data

A Flow can add one or more Definition-backed data items. When the Flow runs, Velox opens or creates the relevant data, makes it available to steps, and saves or commits output according to the Flow and Definition configuration.

The Definition does not decide when processing starts. The Flow trigger and execution policy own that lifecycle. Likewise, a Definition does not grant access: the execution account and underlying Connection must have the required permissions.

## Design considerations

- Reuse a Definition when the same data contract genuinely applies; create a separate Definition when structure or lifecycle differs.
- Test reads and writes independently before using the Definition in a production Flow.
- Use sanitised representative data that includes optional, repeating and invalid cases.
- Check module usage before changing shared fields or parameters.
- Keep business-data examples fictional and free of customer identifiers.

## Related tasks

- [Configure a DB Definition](database-definitions.md)
- [Configure File Definitions](file/index.md)
- [Configure Flow data items](../flows/data/index.md)
- [Velox data-format reference](../../technical-reference/data-format-reference.md)
