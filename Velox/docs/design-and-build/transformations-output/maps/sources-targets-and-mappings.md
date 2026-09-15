---
title: "Map sources, targets and mappings"
description: "Configure Map Definition references, view relationships, destination fields, null handling and save behaviour."
sidebar_position: 20
classification: public
status: approved
owner: Cam Hart
keywords: [Map source, Map destination, ViewMap, FieldMap, master detail]
---

A Map inherits a source and destination Definition reference and stores view/field mapping items against those structures. Stable Definition identities and names are therefore part of the Map contract.

## Module and mapping properties

| Setting | Default | Effect |
| --- | --- | --- |
| **Source type / Definition** | No source | DB/File type and `SourceFIDS` reference opened for read. |
| **Destination type / Definition** | No destination | DB/File type and `DestFIDS` reference opened for mapped output. |
| **Initialised** | Cleared | Persists whether the Map design has been initialised/synchronised. Do not edit it manually. |
| **Use XSI nil for nulls** | Cleared | Map-level null-output choice used for applicable XML/JSON destination behaviour; test against the destination contract. |
| **Save data** | Runtime reset to selected | Controls applicable destination save behaviour during execution. It is runtime state rather than a normal setup checkbox in the saved Map contract. |
| View description/mapping | Per destination view | Associates a destination dataview with its source and owns view events/record counters. |
| Field name/type | Per destination field | Identifies the destination field and Velox field type; source comment confirms matching is by field name rather than a live field-object reference. |

## Design procedure

1. Select tested source and destination Definitions.
2. Open **Map** and reconcile every destination view with the intended source view.
3. For master/detail data, map parent/child relationships before individual fields.
4. Map required keys and destination fields; leave a field unmapped only when the destination default/null rule is deliberate.
5. Verify data types, size/truncation, nulls, dates/time zones, decimal precision and repeated records.
6. Preserve the current Map before accepting a Definition synchronisation/reset.

Changing or renaming a Definition field can orphan a field-name mapping even when the module FID remains valid. Reopen, compile, preview and run an isolated persisted test after any Definition change. See [expressions and validation](expressions-and-validation.md) and [runtime troubleshooting](runtime-and-troubleshooting.md).
