---
title: "Connect and define data"
description: "Configure reusable access and structured data views"
sidebar_position: 20
slug: /data/
classification: public
status: approved
owner: Cam Hart
keywords:
  - "data"
  - "connections"
  - "definitions"
---

Use this section to configure how Velox reaches data and how it interprets that data. It is intended for implementers and administrators who prepare reusable data sources for Flows, Maps, Reports and other modules.

## Choose a path

- **Understand the model** — start with [Connection concepts](connections/connection-concepts.md) and [Data Definition concepts](data-definitions/definition-concepts.md).
- **Connect to a database** — [configure a DB Connection](connections/database/index.md), then use it in a [DB Definition](data-definitions/database-definitions.md).
- **Work with files** — [configure a File Connection](connections/file/index.md), then describe the format with a [File Definition](data-definitions/file/index.md).

## Connections provide access

A Connection stores reusable access details. A DB Connection identifies a database endpoint and its authentication method. A File Connection identifies the folders, file patterns and naming rules used while processing files.

Read [Connection concepts](connections/connection-concepts.md) before creating either type. It explains reuse, runtime account permissions and why a successful configuration test is only one part of validation.

## Definitions describe structure

A Definition describes the data that Velox reads or writes. DB Definitions contain database dataviews and queries. File Definitions contain dataviews plus format-specific rules for flat files, CSV, XML, JSON, EDI or Excel.

Read [Data Definition concepts](data-definitions/definition-concepts.md) to understand dataviews, fields, parameters and how Definitions are used by other modules.

## Complete the configuration

Create Connections before the Definitions that refer to them. Validate with non-production data and the same Windows or database identity that will run the workload. After changing a shared Connection or Definition, retest every affected Flow or other consuming module before using it in production.
