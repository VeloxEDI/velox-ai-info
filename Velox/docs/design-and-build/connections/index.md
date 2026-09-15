---
title: "Configure Connections"
description: "Select, configure and validate reusable database and file Connections in Velox."
sidebar_position: 10
classification: public
status: approved
owner: Cam Hart
keywords: [Connections, DB Connection, File Connection, Velox]
---

A Connection owns reusable access to a database or file location. Data Definitions and Flows reference it by module identity, so a change can affect many integrations.

- Start with [Connection concepts](connection-concepts.md) and [common properties](common-connection-properties.md).
- Choose a [database type](database/index.md) when Velox must query or write database data.
- Choose a [File Connection](file/index.md) for folder, mask, naming and post-processing behaviour.

Validate a Connection under the same Windows/service identity and environment that will execute it. A successful interactive test does not prove background access.
